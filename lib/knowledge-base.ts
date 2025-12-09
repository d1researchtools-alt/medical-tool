// Knowledge base from the spec - reference data for AI responses

export const REGULATORY_PATHWAY_MATRIX = [
  {
    deviceType: 'Surgical instrument / tool',
    typicalClass: 'Class I-II',
    likelyPathway: '510(k) or Exempt',
    timeline: '6-12 months (510k); N/A (exempt)',
  },
  {
    deviceType: 'Diagnostic device',
    typicalClass: 'Class II',
    likelyPathway: '510(k)',
    timeline: '9-15 months',
  },
  {
    deviceType: 'Therapeutic device',
    typicalClass: 'Class II-III',
    likelyPathway: '510(k) or PMA',
    timeline: '12-24 months (510k); 2-4 years (PMA)',
  },
  {
    deviceType: 'Implant',
    typicalClass: 'Class II-III',
    likelyPathway: '510(k), De Novo, PMA',
    timeline: '18-36 months (often requires clinical)',
  },
  {
    deviceType: 'Dental device',
    typicalClass: 'Class I-II',
    likelyPathway: '510(k) or Exempt',
    timeline: '6-12 months',
  },
  {
    deviceType: 'Software / digital health (SaMD)',
    typicalClass: 'Class I-II',
    likelyPathway: '510(k) or De Novo',
    timeline: '6-18 months',
  },
  {
    deviceType: 'Device + Drug combination',
    typicalClass: 'Varies',
    likelyPathway: 'OCP designation',
    timeline: '3-5+ years',
  },
];

export const BUDGET_RANGES = [
  {
    deviceType: 'Simple surgical tool',
    development: '$75K - $150K',
    regulatory: '$25K - $75K',
    totalRange: '$100K - $250K',
  },
  {
    deviceType: 'Electromechanical device',
    development: '$150K - $350K',
    regulatory: '$50K - $150K',
    totalRange: '$200K - $500K',
  },
  {
    deviceType: 'Implant (Class II)',
    development: '$250K - $500K',
    regulatory: '$100K - $300K',
    totalRange: '$350K - $800K',
  },
  {
    deviceType: 'Implant (Class III)',
    development: '$500K - $1.5M',
    regulatory: '$500K - $2M+',
    totalRange: '$1M - $3.5M+',
  },
  {
    deviceType: 'Dental device',
    development: '$75K - $200K',
    regulatory: '$25K - $75K',
    totalRange: '$100K - $300K',
  },
  {
    deviceType: 'SaMD / Software',
    development: '$100K - $300K',
    regulatory: '$30K - $100K',
    totalRange: '$130K - $400K',
  },
];

export const TIMELINE_MODIFIERS = [
  { factor: 'Time commitment < 2 hours/week', adjustment: '+50% to timeline' },
  { factor: 'Hardware + Software complexity', adjustment: '+3-6 months' },
  { factor: 'Device + Drug combination', adjustment: '+12-24 months' },
  { factor: 'Europe market (CE marking)', adjustment: '+6-12 months' },
  { factor: 'Clinical study required', adjustment: '+12-24 months' },
  { factor: 'Working prototype already exists', adjustment: '-3-6 months (head start)' },
];

export const DESIGN_1ST_POSITIONING = {
  ipOwnership: 'You keep 100% of your IP. We\'re your technical team, not partners or investors.',
  businessModel: 'Hourly rate model - no equity stake, no ownership claims, no surprises.',
  flexibility: 'Phased development with exit points. Pause or stop anytime - you keep all work product.',
  timeCommitment: 'Keep your practice. We need 30-60 minutes per week for decisions and direction.',
  manufacturing: 'Manufacturing is baked in from day one. We don\'t hand off designs that can\'t be built.',
  experience: '16+ years, 1200+ products, 25+ physician inventors, 10+ dentist inventors.',
  regulatory: 'Right team, right process, 16 years of experience. FDA is confidently navigable with consistency.',
};

export const RISK_TRIGGERS = [
  {
    condition: 'ipStatus === "No IP protection yet"',
    riskTitle: 'IP EXPOSURE',
    riskDescription: 'Sharing details without protection risks losing rights to your invention.',
    severity: 'HIGH' as const,
  },
  {
    condition: 'employerType !== "No - private practice or self-employed"',
    riskTitle: 'EMPLOYER IP CLAIM',
    riskDescription: 'Employment agreement may assign invention rights to your employer.',
    severity: 'HIGH' as const,
  },
  {
    condition: 'budgetExpectation === "Less than $50,000"',
    riskTitle: 'UNDERFUNDING',
    riskDescription: 'Project may stall mid-development due to insufficient budget.',
    severity: 'HIGH' as const,
  },
  {
    condition: 'deviceType === "Implant"',
    riskTitle: 'CLINICAL DATA REQUIRED',
    riskDescription: 'Implants typically require clinical studies before FDA approval.',
    severity: 'MEDIUM' as const,
  },
  {
    condition: 'complexity === "Device + Drug combination"',
    riskTitle: 'COMBO PRODUCT COMPLEXITY',
    riskDescription: 'Requires coordination with FDA\'s Office of Combination Products.',
    severity: 'HIGH' as const,
  },
  {
    condition: 'coinventors !== "Just me"',
    riskTitle: 'OWNERSHIP DISPUTES',
    riskDescription: 'Multiple inventors without agreement = potential future conflict.',
    severity: 'MEDIUM' as const,
  },
  {
    condition: 'stage === "Already using informally in my practice"',
    riskTitle: 'REGULATORY VIOLATION',
    riskDescription: 'Unapproved clinical use has legal and regulatory implications.',
    severity: 'HIGH' as const,
  },
];

export const STAGE_CONTENT = {
  'Napkin sketch / concept only':
    "You're at the concept stage. Many successful devices started exactly here. Your clinical insight is your biggest asset.",
  'Detailed drawings or CAD models':
    "You've moved past concept into design documentation. This puts you ahead of most physician inventors who never get ideas out of their heads.",
  'Basic prototype (non-functional or rough)':
    "You have tangible proof of concept. The next step is evaluating whether this prototype can evolve toward a manufacturable design.",
  'Working prototype':
    "You've validated core functionality. Focus now shifts to design for manufacturing, regulatory strategy, and testing requirements.",
  'Already using informally in my practice':
    "Real-world use is valuable data - but proceed carefully. Informal clinical use without clearance has regulatory implications. Document everything.",
};
