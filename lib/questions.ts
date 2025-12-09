// All 11 structured questions from the spec

export const QUESTIONS = [
  {
    id: 'q1',
    dataKey: 'stage',
    displayText: 'What stage is your device idea?',
    options: [
      'Napkin sketch / concept only',
      'Detailed drawings or CAD models',
      'Basic prototype (non-functional or rough)',
      'Working prototype',
      'Already using informally in my practice',
    ],
    whyWeAsk: 'Determines starting point and how much work is already done.',
  },
  {
    id: 'q2',
    dataKey: 'deviceType',
    displayText: 'What type of device is this?',
    options: [
      'Surgical instrument / tool',
      'Diagnostic device',
      'Therapeutic device',
      'Implant',
      'Dental device',
      'Veterinary device',
      'Software / digital health (SaMD)',
      'Other',
    ],
    whyWeAsk: 'Drives regulatory pathway logic and expertise matching.',
  },
  {
    id: 'q3',
    dataKey: 'complexity',
    displayText: 'Is your device hardware-only, software-only, or a combination?',
    options: [
      'Hardware only (mechanical, electrical, or both)',
      'Software only (app, algorithm, SaMD)',
      'Hardware + Software combination',
      'Device + Drug combination',
    ],
    whyWeAsk: 'Combination products have different regulatory paths.',
  },
  {
    id: 'q4',
    dataKey: 'ipStatus',
    displayText: "What's the current status of intellectual property protection?",
    options: [
      'No IP protection yet',
      'Provisional patent filed',
      'Full patent application filed',
      'Patent granted',
      'Not sure / need to check',
    ],
    whyWeAsk: 'Critical risk flag. No IP + sharing details = potential exposure.',
  },
  {
    id: 'q5',
    dataKey: 'timeCommitment',
    displayText: 'How much time can you realistically commit to this project each week?',
    options: [
      'Less than 2 hours',
      '2-5 hours',
      '5-10 hours',
      '10+ hours',
    ],
    whyWeAsk: 'Sets timeline expectations. Less time = longer project.',
  },
  {
    id: 'q6',
    dataKey: 'budgetExpectation',
    displayText: "What's your budget expectation for full development through FDA clearance?",
    options: [
      'Less than $50,000',
      '$50,000 - $150,000',
      '$150,000 - $300,000',
      '$300,000 - $500,000',
      '$500,000+',
      'I have no idea',
    ],
    whyWeAsk: 'Reality check trigger for budget expectations.',
  },
  {
    id: 'q7',
    dataKey: 'endGoal',
    displayText: "What's your end goal for this device?",
    options: [
      'Build a company around it',
      'License to an existing manufacturer',
      'Sell the IP outright',
      'Use in my own practice only',
      'Not sure yet',
    ],
    whyWeAsk: 'Shapes the entire development path.',
  },
  {
    id: 'q8',
    dataKey: 'biggestConcern',
    displayText: "What's your biggest concern right now?",
    options: [
      "I don't know where to start",
      'FDA/regulatory process seems impossible',
      'Cost and financial risk',
      'Time commitment while running my practice',
      'Finding the right development partners',
      'Protecting my idea / IP concerns',
    ],
    whyWeAsk: 'Emotional hook for personalization. Plan addresses this directly.',
  },
  {
    id: 'q9',
    dataKey: 'employerType',
    displayText: 'Are you employed by a hospital, academic institution, or healthcare system?',
    options: [
      'No - private practice or self-employed',
      'Yes - hospital employed',
      'Yes - academic/university',
      'Yes - healthcare system employed',
    ],
    whyWeAsk: 'Employment contracts often include IP assignment clauses.',
  },
  {
    id: 'q10',
    dataKey: 'coinventors',
    displayText: 'Are there other inventors or stakeholders involved in this idea?',
    options: [
      'Just me',
      'Yes, 1-2 other people',
      'Yes, 3 or more people',
      'Working with a company already',
    ],
    whyWeAsk: 'Multiple inventors = IP ownership complexity.',
  },
  {
    id: 'q11',
    dataKey: 'targetMarkets',
    displayText: 'Where do you intend to sell this device?',
    options: [
      'United States only',
      'US and Canada',
      'US and Europe',
      'Global',
      'Not sure yet',
    ],
    whyWeAsk: 'Different markets = different regulatory requirements.',
  },
];

export type QuestionDataKey =
  | 'stage'
  | 'deviceType'
  | 'complexity'
  | 'ipStatus'
  | 'timeCommitment'
  | 'budgetExpectation'
  | 'endGoal'
  | 'biggestConcern'
  | 'employerType'
  | 'coinventors'
  | 'targetMarkets';
