// Question and answer types for the questionnaire

export interface Question {
  id: string;
  dataKey: string;
  displayText: string;
  options: string[];
  whyWeAsk: string;
}

export interface UserAnswers {
  // Email gate
  name: string;
  email: string;
  isPractitioner: boolean | null;

  // Structured questions
  stage: string;
  deviceType: string;
  complexity: string;
  ipStatus: string;
  timeCommitment: string;
  budgetExpectation: string;
  endGoal: string;
  biggestConcern: string;
  employerType: string;
  coinventors: string;
  targetMarkets: string;

  // Free text
  deviceDescription: string;
}

export interface GeneratedPlan {
  header: {
    title: string;
    subtitle: string;
    generatedDate: string;
  };
  sections: {
    whereYouAreNow: string;
    regulatoryPathway: string;
    nextThreeSteps: string[];
    timeline: TimelineMilestone[];
    budgetRealityCheck: BudgetSection;
    keyRisks: Risk[];
    designFirstFocus: string[];
    callToAction: CallToAction;
  };
}

export interface TimelineMilestone {
  milestone: string;
  timeframe: string;
}

export interface BudgetSection {
  expectationComparison: string;
  breakdown: BudgetBreakdownItem[];
  disclaimer: string;
}

export interface BudgetBreakdownItem {
  category: string;
  range: string;
}

export interface Risk {
  title: string;
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface CallToAction {
  showBookingButton: boolean;
  headline: string;
  body: string;
  calendlyLink: string;
}

// Knowledge base types
export interface RegulatoryPathway {
  deviceType: string;
  typicalClass: string;
  likelyPathway: string;
  timeline: string;
}

export interface BudgetRange {
  deviceType: string;
  development: string;
  regulatory: string;
  totalRange: string;
}
