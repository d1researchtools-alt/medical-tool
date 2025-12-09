import { NextRequest, NextResponse } from 'next/server';
import { UserAnswers } from '@/lib/types';
import {
  REGULATORY_PATHWAY_MATRIX,
  BUDGET_RANGES,
  TIMELINE_MODIFIERS,
  DESIGN_1ST_POSITIONING,
  STAGE_CONTENT,
} from '@/lib/knowledge-base';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers } = body as { answers: UserAnswers };

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
        model: 'claude-sonnet-4-20250514',
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

    return NextResponse.json({ plan });
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
        timeline: parsed.timeline,
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
          calendlyLink: 'https://calendly.com/design1st/consultation', // Placeholder
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
