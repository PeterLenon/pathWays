/**
 * Hardcoded career knowledge base for the Jackson, MS / Hinds County area.
 *
 * Wage data sources:
 *   - BLS Occupational Employment and Wage Statistics (OEWS), Jackson MSA, May 2024
 *   - BLS County Employment and Wages, Hinds County, Q3/Q4 2025
 *   - Salary.com MS-specific data (2024)
 *   - TrustedHealth RN salary guide, Mississippi (2024)
 *
 * Program cost sources:
 *   - Hinds Community College official tuition page (hindscc.edu)
 *   - Jackson State University tuition and fees (jsums.edu)
 *   - CDLexpert.com Mississippi CDL cost guide
 *   - Institution-specific program pages (verified 2024)
 *
 * This data is static for the MVP. Every display surface must show the source
 * and approximate date so users can verify before making decisions.
 */

export interface CareerProfile {
  id: string;
  name: string;
  sector: string;
  pathwayType: string;
  trainingCostLow: number;
  trainingCostHigh: number;
  durationDescription: string;
  salaryLow: number;
  salaryMedian: number;
  salaryHigh: number;
  salaryConfidence: "high" | "medium" | "low";
  salaryConfidenceReason: string;
  salarySource: string;
  demandLabel: "very_high" | "high" | "moderate" | "low";
  demandNotes: string;
  physicalDemands: "sedentary" | "light" | "moderate" | "heavy";
  workEnvironment: "indoor" | "outdoor" | "mixed";
  educationRequired: string;
  programOptions: ProgramOptionStatic[];
  barriers: string[];
  supports: string[];
  fastEntry: boolean; // true = < 3 months to employment (used for "crisis" financial situations)
}

export interface ProgramOptionStatic {
  name: string;
  institution: string;
  location: string;
  estimatedCost: number;
  duration: string;
}

export const CAREER_PROFILES: CareerProfile[] = [
  {
    id: "cdl_driver",
    name: "CDL Class A Truck Driver",
    sector: "transportation",
    pathwayType: "vocational_cert",
    trainingCostLow: 3000,
    trainingCostHigh: 7000,
    durationDescription: "4–8 weeks",
    salaryLow: 40000,
    salaryMedian: 50700,
    salaryHigh: 65000,
    salaryConfidence: "medium",
    salaryConfidenceReason:
      "Based on BLS Mississippi statewide data; Jackson MSA-specific CDL driver figures are not separately reported. Local rates vary by carrier.",
    salarySource: "BLS OES, Mississippi statewide, May 2024",
    demandLabel: "high",
    demandNotes:
      "Mississippi employs approximately 25,490 CDL drivers. National shortage continues; many MS carriers actively hiring.",
    physicalDemands: "moderate",
    workEnvironment: "mixed",
    educationRequired: "High school diploma or GED + DOT medical card",
    programOptions: [
      {
        name: "CDL Class A Program",
        institution: "Hinds Community College",
        location: "Raymond, MS",
        estimatedCost: 3500,
        duration: "4–6 weeks",
      },
      {
        name: "CDL Training Program",
        institution: "Holmes Community College",
        location: "Goodman, MS",
        estimatedCost: 3800,
        duration: "4–6 weeks",
      },
      {
        name: "Accelerated CDL Program",
        institution: "Delta Technical College",
        location: "Ridgeland, MS",
        estimatedCost: 6500,
        duration: "3–4 weeks",
      },
    ],
    barriers: [
      "Requires DOT physical and medical card — some health conditions are disqualifying",
      "Clean driving record required; DUIs are typically disqualifying for 10 years",
      "Long hours and time away from home for over-the-road routes",
      "Some carriers require 1–2 years local driving experience before regional/OTR routes",
    ],
    supports: [
      "WIOA Adult/Dislocated Worker funding covers CDL at approved MS providers — contact MDES",
      "Many major carriers (Werner, Walmart, Swift) offer tuition reimbursement programs",
      "Hinds CC Workforce Development scholarships available for Hinds County residents",
      "Mississippi Works American Job Centers: (888) 844-3577",
    ],
    fastEntry: true,
  },
  {
    id: "hvac_tech",
    name: "HVAC Technician",
    sector: "trades",
    pathwayType: "vocational_cert",
    trainingCostLow: 4000,
    trainingCostHigh: 8000,
    durationDescription: "6–12 months",
    salaryLow: 50965,
    salaryMedian: 57211,
    salaryHigh: 64255,
    salaryConfidence: "medium",
    salaryConfidenceReason:
      "Based on Salary.com Mississippi data (2024). Jackson MSA-specific HVAC data not separately published by BLS OEWS.",
    salarySource: "Salary.com, Mississippi HVAC Technician, 2024",
    demandLabel: "high",
    demandNotes:
      "High demand across Mississippi due to climate and aging housing stock. Shortage of qualified technicians in the Jackson metro area.",
    physicalDemands: "heavy",
    workEnvironment: "mixed",
    educationRequired: "High school diploma or GED",
    programOptions: [
      {
        name: "HVAC/R Technology Certificate",
        institution: "Hinds Community College",
        location: "Vicksburg, MS (Career-Technical Center)",
        estimatedCost: 5500,
        duration: "9–12 months",
      },
      {
        name: "HVAC Technology Program",
        institution: "East Mississippi Community College",
        location: "Mayhew, MS",
        estimatedCost: 4500,
        duration: "6–9 months",
      },
    ],
    barriers: [
      "EPA Section 608 certification required by law to handle refrigerants (exam ~$20–$100)",
      "Heavy physical work — lifting equipment, working in attics and crawl spaces",
      "Hot outdoor/attic work especially challenging in Mississippi summers",
      "May need own hand tools ($500–$1,500 investment)",
    ],
    supports: [
      "WIOA funding covers HVAC programs at approved providers",
      "EPA 608 prep materials available free through HVAC Excellence",
      "Hinds CC Workforce Development scholarships",
      "Many HVAC companies offer on-the-job apprenticeship arrangements",
    ],
    fastEntry: false,
  },
  {
    id: "rn",
    name: "Registered Nurse (ADN pathway)",
    sector: "healthcare",
    pathwayType: "associates_degree",
    trainingCostLow: 12000,
    trainingCostHigh: 16000,
    durationDescription: "2 years",
    salaryLow: 66060,
    salaryMedian: 76000,
    salaryHigh: 90806,
    salaryConfidence: "high",
    salaryConfidenceReason:
      "Strong BLS OEWS data for registered nurses in Mississippi; multiple corroborating sources (BLS, TrustedHealth 2024). Jackson MSA nursing demand is well-documented.",
    salarySource: "BLS OEWS Mississippi + TrustedHealth RN Salary Guide MS, 2024",
    demandLabel: "very_high",
    demandNotes:
      "Mississippi faces a severe nursing shortage. ADN graduates are actively recruited by Jackson-area hospitals. Many employers offer sign-on bonuses.",
    physicalDemands: "moderate",
    workEnvironment: "indoor",
    educationRequired: "Associate's Degree in Nursing (ADN) + NCLEX-RN license",
    programOptions: [
      {
        name: "Associate Degree in Nursing (ADN)",
        institution: "Hinds Community College",
        location: "Raymond, MS",
        estimatedCost: 13000,
        duration: "2 years (full-time)",
      },
      {
        name: "ADN Program",
        institution: "Holmes Community College",
        location: "Goodman, MS",
        estimatedCost: 12000,
        duration: "2 years",
      },
    ],
    barriers: [
      "Competitive ADN program admissions — GPA and TEAS entrance exam required",
      "NCLEX-RN licensing exam required after graduation",
      "Clinical hours requirement — must arrange childcare/transportation for clinical rotations",
      "Full 2-year commitment; part-time options are limited",
    ],
    supports: [
      "Pell Grant (up to $7,395/year) covers most Hinds CC ADN tuition",
      "HRSA Nursing Workforce Development scholarships",
      "Mississippi Nursing Education Loan Repayment Program (state-funded)",
      "Complete 2 Compete (C2C) for adults with prior college credit: ihl.state.ms.us/complete2compete",
      "Many Jackson hospitals offer tuition reimbursement for nursing students who commit to employment",
    ],
    fastEntry: false,
  },
  {
    id: "lpn",
    name: "Licensed Practical Nurse (LPN)",
    sector: "healthcare",
    pathwayType: "vocational_cert",
    trainingCostLow: 8000,
    trainingCostHigh: 14000,
    durationDescription: "12–18 months",
    salaryLow: 45000,
    salaryMedian: 51680,
    salaryHigh: 58000,
    salaryConfidence: "high",
    salaryConfidenceReason:
      "Solid BLS OEWS data for LPNs in Mississippi. Well-established occupation with consistent local demand.",
    salarySource: "BLS OEWS Mississippi, May 2024 + Salary.com MS, 2024",
    demandLabel: "high",
    demandNotes:
      "High demand in nursing homes, clinics, and home health. LPN is a common stepping stone to RN via bridge programs.",
    physicalDemands: "moderate",
    workEnvironment: "indoor",
    educationRequired: "Practical Nursing Certificate + NCLEX-PN license",
    programOptions: [
      {
        name: "Practical Nursing Certificate",
        institution: "Hinds Community College",
        location: "Raymond, MS",
        estimatedCost: 10000,
        duration: "12 months",
      },
      {
        name: "Practical Nursing Program",
        institution: "Copiah-Lincoln Community College",
        location: "Wesson, MS",
        estimatedCost: 8500,
        duration: "12–14 months",
      },
    ],
    barriers: [
      "Competitive admissions; requires entrance exam (TEAS or NLN)",
      "NCLEX-PN licensing exam required",
      "Clinical rotations require flexible scheduling",
    ],
    supports: [
      "Pell Grant covers significant portion of tuition",
      "WIOA funding available for healthcare certificate programs",
      "Many employers sponsor LPN training in exchange for employment commitment",
      "LPN-to-RN bridge programs available at Hinds CC for advancement",
    ],
    fastEntry: false,
  },
  {
    id: "it_support",
    name: "IT Support Specialist (CompTIA A+ pathway)",
    sector: "technology",
    pathwayType: "industry_cert",
    trainingCostLow: 500,
    trainingCostHigh: 5000,
    durationDescription: "3–6 months",
    salaryLow: 35000,
    salaryMedian: 45000,
    salaryHigh: 55000,
    salaryConfidence: "low",
    salaryConfidenceReason:
      "Jackson MSA tech market is smaller than national average. Local IT support salaries are lower than national BLS figures. Remote work opens access to national salary rates, which changes the picture significantly.",
    salarySource: "BLS OEWS Jackson MSA May 2024 (limited sample) + talent.com Jackson MS, 2024",
    demandLabel: "moderate",
    demandNotes:
      "Moderate local demand; strong national/remote demand. CompTIA A+ is an entry point — Security+ and cloud certs increase earning potential to $60K–$90K+.",
    physicalDemands: "sedentary",
    workEnvironment: "indoor",
    educationRequired: "CompTIA A+ certification (no degree required)",
    programOptions: [
      {
        name: "CompTIA A+ Self-Study (exam vouchers only)",
        institution: "CompTIA (self-directed)",
        location: "Online / Jackson testing centers",
        estimatedCost: 600,
        duration: "2–4 months self-study",
      },
      {
        name: "IT Support Professional Certificate",
        institution: "Hinds Community College",
        location: "Raymond, MS",
        estimatedCost: 3500,
        duration: "6 months",
      },
    ],
    barriers: [
      "Local Jackson tech market is limited — remote work skills or relocation may be needed for higher salaries",
      "Self-directed study path requires discipline without classroom structure",
      "Entry-level roles are competitive; experience via volunteer IT help builds resume",
    ],
    supports: [
      "Google IT Support Professional Certificate on Coursera (~$200, widely recognized)",
      "Mississippi Works job placement assistance",
      "WIOA funding may cover approved IT certification programs",
      "CompTIA exam voucher discounts through student/workforce programs",
    ],
    fastEntry: true,
  },
  {
    id: "welder",
    name: "Welder (AWS Certified)",
    sector: "manufacturing",
    pathwayType: "vocational_cert",
    trainingCostLow: 3000,
    trainingCostHigh: 6000,
    durationDescription: "6–12 months",
    salaryLow: 38000,
    salaryMedian: 45000,
    salaryHigh: 58000,
    salaryConfidence: "medium",
    salaryConfidenceReason:
      "Based on BLS Mississippi statewide welding data. Jackson-area welding salaries vary by industry; shipbuilding and industrial welding pay toward the higher end.",
    salarySource: "BLS OES Mississippi statewide, May 2024",
    demandLabel: "moderate",
    demandNotes:
      "Moderate demand in central MS. Higher demand in coastal MS (Ingalls Shipbuilding in Pascagoula). Skilled welders with AWS certification command premium rates.",
    physicalDemands: "heavy",
    workEnvironment: "mixed",
    educationRequired: "High school diploma or GED + AWS certification",
    programOptions: [
      {
        name: "Welding Technology Certificate",
        institution: "Hinds Community College",
        location: "Raymond, MS",
        estimatedCost: 4000,
        duration: "9–12 months",
      },
      {
        name: "Welding Program",
        institution: "Mississippi Delta Community College",
        location: "Moorhead, MS",
        estimatedCost: 3500,
        duration: "6–9 months",
      },
    ],
    barriers: [
      "Physically demanding — fumes, heat, protective equipment required",
      "AWS certification exam costs (~$300–$500)",
      "Jackson-area manufacturing jobs are more limited than coastal MS or larger metro areas",
    ],
    supports: [
      "WIOA funding covers welding programs at approved providers",
      "Mississippi Development Authority (MDA) workforce training programs",
      "Hinds CC Workforce Development scholarships",
    ],
    fastEntry: false,
  },
  {
    id: "cna",
    name: "Certified Nursing Assistant (CNA)",
    sector: "healthcare",
    pathwayType: "vocational_cert",
    trainingCostLow: 500,
    trainingCostHigh: 1500,
    durationDescription: "4–8 weeks",
    salaryLow: 26000,
    salaryMedian: 30000,
    salaryHigh: 35000,
    salaryConfidence: "high",
    salaryConfidenceReason:
      "CNA wages are well-documented in BLS data for Mississippi. Rates are consistent across the state with modest local variation.",
    salarySource: "BLS OEWS Mississippi, May 2024",
    demandLabel: "very_high",
    demandNotes:
      "Very high demand in Jackson-area nursing homes, hospitals, and home health agencies. Many employers pay for CNA training in exchange for a work commitment. Fast entry into healthcare sector with clear advancement path to LPN and RN.",
    physicalDemands: "moderate",
    workEnvironment: "indoor",
    educationRequired: "High school diploma or GED + state CNA certification",
    programOptions: [
      {
        name: "Nurse Aide Training Program",
        institution: "Hinds Community College",
        location: "Raymond, MS",
        estimatedCost: 800,
        duration: "4–6 weeks",
      },
      {
        name: "Employer-Sponsored CNA Training",
        institution: "Various Jackson-area nursing homes and hospitals",
        location: "Jackson, MS area",
        estimatedCost: 0,
        duration: "4–6 weeks (paid employment after week 1)",
      },
    ],
    barriers: [
      "Entry-level wages are low — best treated as a stepping stone to LPN/RN",
      "Physically and emotionally demanding work",
      "State certification exam required after training",
    ],
    supports: [
      "Many nursing homes offer fully employer-paid CNA training",
      "WIOA funding available",
      "Clear advancement path: CNA → LPN → RN with further education",
      "Mississippi State Department of Health maintains approved CNA program list",
    ],
    fastEntry: true,
  },
  {
    id: "business_admin",
    name: "Business Administration (Associate's Degree)",
    sector: "business_admin",
    pathwayType: "associates_degree",
    trainingCostLow: 8500,
    trainingCostHigh: 10000,
    durationDescription: "2 years",
    salaryLow: 32000,
    salaryMedian: 40000,
    salaryHigh: 55000,
    salaryConfidence: "low",
    salaryConfidenceReason:
      "Business administration is a broad degree with wide salary variation by specific role (office manager vs. accountant vs. HR). BLS data for 'business and financial operations' in Jackson MSA shows averages, but entry-level varies significantly.",
    salarySource: "BLS OEWS Jackson MSA, May 2024 (general business/admin occupations)",
    demandLabel: "moderate",
    demandNotes:
      "Steady demand for office administration, accounting clerks, HR assistants. Salary ceiling depends heavily on specific specialization and advancement.",
    physicalDemands: "sedentary",
    workEnvironment: "indoor",
    educationRequired: "Associate's Degree in Business Administration",
    programOptions: [
      {
        name: "Associate of Applied Science in Business Administration",
        institution: "Hinds Community College",
        location: "Raymond, MS",
        estimatedCost: 8500,
        duration: "2 years",
      },
      {
        name: "Business Administration AAS",
        institution: "Holmes Community College",
        location: "Goodman, MS",
        estimatedCost: 9000,
        duration: "2 years",
      },
    ],
    barriers: [
      "2-year commitment with lower entry-level salary compared to trades or healthcare certs",
      "Wide range of outcomes — specialization matters for advancement",
      "Job market is competitive at entry level without work experience",
    ],
    supports: [
      "Pell Grant covers most or all Hinds CC tuition for eligible students",
      "Complete 2 Compete (C2C) for adults with prior college credit",
      "Mississippi Office of Student Financial Aid (MOSFA) MTAG grant",
      "Hinds CC Career Services for job placement assistance",
    ],
    fastEntry: false,
  },
];

// ---- Financial Aid Resources ----

export interface FinancialAidResource {
  name: string;
  description: string;
  contact: string;
  phone?: string;
}

export const FINANCIAL_AID_RESOURCES: FinancialAidResource[] = [
  {
    name: "WIOA Adult/Dislocated Worker Program",
    description:
      "Federally funded training grants administered by MDES. Covers tuition at approved providers including CDL, healthcare, IT, and trades programs. Does not need to be repaid.",
    contact: "mdes.ms.gov or any Mississippi American Job Center",
    phone: "(888) 844-3577",
  },
  {
    name: "Federal Pell Grant",
    description:
      "Federal grant up to $7,395/year for eligible students at accredited institutions. Does not need to be repaid. Apply at fafsa.gov.",
    contact: "fafsa.gov",
  },
  {
    name: "Mississippi Office of Student Financial Aid (MOSFA)",
    description:
      "State aid programs including MTAG (Mississippi Tuition Assistance Grant) and HELP scholarship for community college students.",
    contact: "msfinancialaid.org",
  },
  {
    name: "Complete 2 Compete (C2C)",
    description:
      "For adults with some college credit who did not finish their degree. Reduces barriers to re-enrollment and may offer financial assistance.",
    contact: "ihl.state.ms.us/complete2compete",
  },
  {
    name: "Hinds CC Workforce Development",
    description:
      "Short-term training scholarships prioritizing displaced workers and low-income residents of Hinds County.",
    contact: "hindscc.edu/workforce",
    phone: "(601) 857-3200",
  },
];

// ---- Human Counselor Resources ----

export const COUNSELOR_RESOURCES = {
  hindsCCCareers: {
    name: "Hinds Community College Career Services",
    phone: "(601) 857-3200",
    website: "hindscc.edu",
  },
  mdes: {
    name: "Mississippi Department of Employment Security (MDES)",
    phone: "(601) 321-6000",
    website: "mdes.ms.gov",
  },
  msWorks: {
    name: "Mississippi Works American Job Centers",
    phone: "(888) 844-3577",
    website: "msworks.ms.gov",
  },
};
