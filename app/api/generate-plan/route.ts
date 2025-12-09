import { NextRequest, NextResponse } from 'next/server';
import { UserAnswers } from '@/lib/types';
import {
  REGULATORY_PATHWAY_MATRIX,
  BUDGET_RANGES,
  TIMELINE_MODIFIERS,
  DESIGN_1ST_POSITIONING,
  STAGE_CONTENT,
} from '@/lib/knowledge-base';
import { sql } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers, sessionId } = body as { answers: UserAnswers; sessionId?: string };

    // Validate required fields
    if (!answers || !answers.deviceDescription) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for API key
    if (!process.env.CLAUDE_API_KEY) {
      return NextResponse.json(
        { error: 'Claude API key not configured' },
        { status: 500 }
      );
    }

    // Build the comprehensive prompt
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(answers);

    console.log('Generating plan for:', answers.name);

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        system: systemPrompt,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Claude API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate plan', details: errorData },
        { status: 500 }
      );
    }

    const claudeResponse = await response.json();
    const planContent = claudeResponse.content[0].text;

    // Parse the structured response
    const plan = parseClaudeResponse(planContent, answers);

    // Save submission and plan to database
    let submissionId: number | null = null;
    try {
      // Calculate lead score based on budget + stage + practitioner (Section 6.4)
      const leadScore = calculateLeadScore(answers);
      const isQualifiedLead = plan.sections.callToAction.showBookingButton;

      // Generate CRM tags
      const crmTags = [
        answers.isPractitioner ? 'practitioner' : 'non-practitioner',
        answers.deviceType,
        answers.stage,
        answers.budgetExpectation,
      ].filter(Boolean);

      // 90-day expiry for device description (Section 6.1)
      const descriptionExpiresAt = new Date();
      descriptionExpiresAt.setDate(descriptionExpiresAt.getDate() + 90);

      // Insert submission
      const submissionResult = await sql`
        INSERT INTO submissions (
          session_id, name, email, is_practitioner,
          stage, device_type, complexity, ip_status,
          time_commitment, budget_expectation, end_goal,
          biggest_concern, employer_type, coinventors,
          target_markets, device_description,
          is_qualified_lead, lead_score, crm_tags, description_expires_at
        ) VALUES (
          ${sessionId || null}, ${answers.name}, ${answers.email}, ${answers.isPractitioner},
          ${answers.stage}, ${answers.deviceType}, ${answers.complexity}, ${answers.ipStatus},
          ${answers.timeCommitment}, ${answers.budgetExpectation}, ${answers.endGoal},
          ${answers.biggestConcern}, ${answers.employerType}, ${answers.coinventors},
          ${answers.targetMarkets}, ${answers.deviceDescription},
          ${isQualifiedLead}, ${leadScore}, ${crmTags}, ${descriptionExpiresAt.toISOString()}
        )
        RETURNING id
      `;

      submissionId = submissionResult[0]?.id;

      // Insert plan
      if (submissionId) {
        await sql`
          INSERT INTO plans (submission_id, plan_json)
          VALUES (${submissionId}, ${JSON.stringify(plan)})
        `;
      }

      // Track plan generation event
      await sql`
        INSERT INTO analytics_events (session_id, event_type, event_data)
        VALUES (${sessionId || null}, 'plan_generated', ${JSON.stringify({
          submissionId,
          isQualifiedLead,
          deviceType: answers.deviceType,
          stage: answers.stage,
          budgetExpectation: answers.budgetExpectation,
        })})
      `;

      console.log('Saved submission:', submissionId);
    } catch (dbError) {
      // Log but don't fail the request if database save fails
      console.error('Database save error:', dbError);
    }

    return NextResponse.json({ plan, submissionId });
  } catch (error) {
    console.error('Plan generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate plan', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function buildSystemPrompt(): string {
  return `You are an expert medical device development consultant working for Design 1st, a product development firm with 16+ years of experience and 1200+ products developed.

Your role is to generate personalized development plans for physician and dentist inventors who have medical device ideas. You must be:
- Encouraging but realistic
- Direct about risks and challenges
- Clear about timelines and budgets
- Never provide legal advice (always defer to "consult patent attorney")
- Never provide fixed estimates (always ranges)

IMPORTANT POSITIONING POINTS TO WEAVE IN:
${JSON.stringify(DESIGN_1ST_POSITIONING, null, 2)}

REGULATORY PATHWAY KNOWLEDGE:
${JSON.stringify(REGULATORY_PATHWAY_MATRIX, null, 2)}

BUDGET RANGE KNOWLEDGE:
${JSON.stringify(BUDGET_RANGES, null, 2)}

TIMELINE MODIFIERS:
${JSON.stringify(TIMELINE_MODIFIERS, null, 2)}

STAGE-SPECIFIC CONTENT:
${JSON.stringify(STAGE_CONTENT, null, 2)}

OUTPUT FORMAT:
You must respond with a JSON object containing these exact sections. Each section should be well-written, personalized content based on the user's inputs.

{
  "whereYouAreNow": "string - 2-3 paragraphs reflecting their current stage and validating their progress",
  "regulatoryPathway": "string - explanation of likely classification, pathway, timeline, and key considerations. Include the disclaimer.",
  "nextThreeSteps": ["step1", "step2", "step3"] - three specific, actionable steps based on their situation,
  "timeline": [{"milestone": "name", "timeframe": "X-Y months"}] - array of 5-7 milestones with timeframes,
  "budgetComparison": "string - compare their expectation to reality, be direct if there's a gap",
  "budgetBreakdown": [{"category": "name", "range": "$X - $Y"}] - 4-5 budget categories,
  "keyRisks": [{"title": "RISK NAME", "description": "explanation", "severity": "HIGH|MEDIUM|LOW"}] - top 3 risks,
  "designFirstFocus": ["action1", "action2", "action3"] - 2-3 specific things D1 would focus on,
  "isQualifiedLead": boolean - true if budget >= $50K or "I have no idea"
}

REQUIRED DISCLAIMERS TO INCLUDE:
- Regulatory: "This is a preliminary assessment based on device category. Final classification requires detailed technical and intended use review. Design 1st recommends regulatory consultation before making business decisions based on this pathway estimate."
- Budget: "These are planning estimates only. Actual costs depend on technical complexity, testing requirements, and regulatory pathway. Design 1st provides detailed cost estimates after technical review."
- Timeline: "These timelines assume no major design pivots, regulatory delays, or funding gaps. Actual duration varies based on technical complexity and market factors."`;
}

function buildUserPrompt(answers: UserAnswers): string {
  return `Generate a personalized medical device development plan based on these inputs:

USER PROFILE:
- Name: ${answers.name}
- Email: ${answers.email}
- Is Practitioner: ${answers.isPractitioner ? 'Yes' : 'No'}

DEVICE & SITUATION:
- Development Stage: ${answers.stage}
- Device Type: ${answers.deviceType}
- Complexity: ${answers.complexity}
- IP Status: ${answers.ipStatus}
- Time Available: ${answers.timeCommitment}
- Budget Expectation: ${answers.budgetExpectation}
- End Goal: ${answers.endGoal}
- Biggest Concern: ${answers.biggestConcern}
- Employment Status: ${answers.employerType}
- Co-inventors: ${answers.coinventors}
- Target Markets: ${answers.targetMarkets}

DEVICE DESCRIPTION:
${answers.deviceDescription}

Based on these inputs, generate a comprehensive, personalized development plan. Be specific to their situation. Address their biggest concern directly. Flag any critical risks based on their IP status, employment, and other factors.

Respond with ONLY the JSON object, no other text.`;
}

interface ClaudePlanResponse {
  whereYouAreNow: string;
  regulatoryPathway: string;
  nextThreeSteps: string[];
  timeline: { milestone: string; timeframe: string }[];
  budgetComparison: string;
  budgetBreakdown: { category: string; range: string }[];
  keyRisks: { title: string; description: string; severity: 'HIGH' | 'MEDIUM' | 'LOW' }[];
  designFirstFocus: string[];
  isQualifiedLead: boolean;
}

// Calculate lead score based on budget + stage + practitioner (Section 6.4)
function calculateLeadScore(answers: UserAnswers): number {
  let score = 0;

  // Budget score (0-40 points)
  const budgetScores: Record<string, number> = {
    '$500,000+': 40,
    '$300,000 - $500,000': 35,
    '$150,000 - $300,000': 30,
    '$50,000 - $150,000': 20,
    'I have no idea': 15, // Still shows interest
    'Less than $50,000': 5,
  };
  score += budgetScores[answers.budgetExpectation] || 0;

  // Stage score (0-30 points) - more advanced = higher score
  const stageScores: Record<string, number> = {
    'Already using informally in my practice': 30,
    'Working prototype': 25,
    'Basic prototype (non-functional or rough)': 20,
    'Detailed drawings or CAD models': 15,
    'Napkin sketch / concept only': 10,
  };
  score += stageScores[answers.stage] || 0;

  // Practitioner bonus (0-20 points)
  if (answers.isPractitioner) {
    score += 20;
  }

  // Time commitment bonus (0-10 points)
  const timeScores: Record<string, number> = {
    '10+ hours': 10,
    '5-10 hours': 8,
    '2-5 hours': 5,
    'Less than 2 hours': 2,
  };
  score += timeScores[answers.timeCommitment] || 0;

  return score;
}

function parseClaudeResponse(content: string, answers: UserAnswers) {
  try {
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed: ClaudePlanResponse = JSON.parse(jsonMatch[0]);

    // Build the full plan structure
    return {
      header: {
        title: 'Your Medical Device Development Plan',
        subtitle: `${answers.deviceType} - ${answers.stage} - ${answers.endGoal}`,
        generatedDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      },
      sections: {
        whereYouAreNow: parsed.whereYouAreNow,
        regulatoryPathway: parsed.regulatoryPathway,
        nextThreeSteps: parsed.nextThreeSteps,
        timeline: {
          milestones: parsed.timeline,
          disclaimer: 'These timelines assume no major design pivots, regulatory delays, or funding gaps. Actual duration varies based on technical complexity and market factors.',
        },
        budgetRealityCheck: {
          expectationComparison: parsed.budgetComparison,
          breakdown: parsed.budgetBreakdown,
          disclaimer:
            'These are planning estimates only. Actual costs depend on technical complexity, testing requirements, and regulatory pathway. Design 1st provides detailed cost estimates after technical review.',
        },
        keyRisks: parsed.keyRisks,
        designFirstFocus: parsed.designFirstFocus,
        callToAction: {
          showBookingButton: parsed.isQualifiedLead,
          headline: parsed.isQualifiedLead
            ? 'Ready to Discuss Your Plan?'
            : 'Explore Our Resources',
          body: parsed.isQualifiedLead
            ? "Our senior technical team reviews early-stage device concepts at no cost. We'll tell you what we see - including whether now is the right time to move forward."
            : 'Learn more about medical device development with our educational resources and case studies.',
          calendlyLink: 'https://calendly.com/design1st?utm_source=AI-Public-Footer&utm_medium=Knowledge-Hub&utm_campaign=calendly-link',
          resourcesLink: 'https://design1st.com/blog/',
        },
      },
      userInfo: {
        name: answers.name,
        email: answers.email,
        isPractitioner: answers.isPractitioner,
      },
      answers: answers,
    };
  } catch (error) {
    console.error('Failed to parse Claude response:', error);
    console.error('Raw content:', content);
    throw new Error('Failed to parse plan response');
  }
}
