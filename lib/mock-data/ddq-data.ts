export interface DDQQuestion {
  id: string
  section: string
  question: string
  answer?: string
  type:
    | "short_text"
    | "long_text"
    | "multiple_choice"
    | "yes_no"
    | "number"
    | "currency"
    | "percentage"
    | "date"
    | "file_upload"
  required: boolean
  answeredAt?: string
  options?: string[]
}

export interface DDQSection {
  id: string
  name: string
  questions: DDQQuestion[]
}

export interface MockDDQData {
  id: string
  templateName: string
  managerName: string
  managerFirm: string
  allocatorName: string
  status: string
  submittedDate?: string
  completedDate?: string
  dueDate?: string
  lastUpdated?: string
  strategy: string
  fundSize?: string
  vintage?: string
  priority?: string
  progress?: number
  sections: DDQSection[]
  metadata?: {
    reviewers?: string[]
    tags?: string[]
    notes?: string
  }
}

export const generateMockDDQData = (
  requestId: string,
  templateName: string,
  managerName: string,
  managerFirm: string,
  allocatorName: string,
  strategy: string,
  status: string,
  progress = 0,
): MockDDQData => {
  const sections: DDQSection[] = [
    {
      id: "org_management",
      name: "Organization & Management",
      questions: [
        {
          id: "q1",
          section: "Organization & Management",
          question:
            "Please provide a detailed overview of your firm's history, organizational structure, and key personnel.",
          answer: `${managerFirm} was founded in 2010 and has grown to become a leading ${strategy.toLowerCase()} investment firm. Our organizational structure consists of three main divisions:

**Investment Team (25 professionals):**
- Managing Partners: 3 senior professionals with 15+ years experience
- Investment Directors: 8 professionals with 10+ years experience  
- Investment Associates: 14 junior professionals with 3-8 years experience

**Operations Team (12 professionals):**
- Chief Operating Officer
- Risk Management (3 professionals)
- Compliance (2 professionals)
- Finance & Accounting (4 professionals)
- IT & Technology (2 professionals)

**Client Relations Team (8 professionals):**
- Head of Investor Relations
- Client Relationship Managers (4 professionals)
- Marketing & Communications (3 professionals)

Our leadership team has extensive experience in ${strategy.toLowerCase()} investments, with a combined 200+ years of industry experience. We maintain offices in New York, London, and Singapore to serve our global client base.`,
          type: "long_text",
          required: true,
          answeredAt: progress > 20 ? "2024-01-15T10:30:00Z" : undefined,
        },
        {
          id: "q2",
          section: "Organization & Management",
          question: "What is your firm's current Assets Under Management (AUM)?",
          answer: progress > 20 ? "$3.2 billion" : undefined,
          type: "currency",
          required: true,
          answeredAt: progress > 20 ? "2024-01-15T10:32:00Z" : undefined,
        },
        {
          id: "q3",
          section: "Organization & Management",
          question: "How many full-time employees does your firm currently have?",
          answer: progress > 20 ? "45" : undefined,
          type: "number",
          required: true,
          answeredAt: progress > 20 ? "2024-01-15T10:35:00Z" : undefined,
        },
        {
          id: "q4",
          section: "Organization & Management",
          question: "Please list your key service providers (auditor, administrator, prime broker, etc.)",
          answer:
            progress > 30
              ? `**Auditor:** PricewaterhouseCoopers LLP
**Administrator:** SS&C Technologies
**Prime Broker:** Goldman Sachs, Morgan Stanley
**Legal Counsel:** Kirkland & Ellis LLP
**Custodian:** State Street Corporation
**Technology Provider:** Bloomberg Terminal, FactSet`
              : undefined,
          type: "long_text",
          required: true,
          answeredAt: progress > 30 ? "2024-01-15T11:00:00Z" : undefined,
        },
      ],
    },
    {
      id: "investment_strategy",
      name: "Investment Strategy",
      questions: [
        {
          id: "q5",
          section: "Investment Strategy",
          question: "Describe your investment strategy, approach, and philosophy in detail.",
          answer:
            progress > 40
              ? `Our ${strategy.toLowerCase()} investment strategy is built on four core pillars:

**1. Disciplined Investment Process**
We employ a rigorous, research-driven approach that combines top-down macro analysis with bottom-up fundamental research. The Investment Committee meets weekly to review opportunities and portfolio performance.

**2. Focus on Quality Assets**
We target high-quality ${strategy.toLowerCase()} assets with strong fundamentals, predictable cash flows, and defensive characteristics. Typical investment criteria include:
- Established market positions
- Experienced management teams
- Strong regulatory frameworks
- ESG compliance

**3. Active Asset Management**
Post-investment we work closely with management teams to optimise operations, implement best practices, and drive value creation.

**4. Risk Management**
We maintain a conservative approach to leverage and diversification, with strict position-sizing limits and comprehensive risk monitoring.

Our target returns are ${getTargetReturns(strategy)} net IRR over a 5-7 year horizon.`
              : undefined,
          type: "long_text",
          required: true,
          answeredAt: progress > 40 ? "2024-01-15T11:15:00Z" : undefined,
        },
        {
          id: "q6",
          section: "Investment Strategy",
          question: "What is your target fund size for this strategy?",
          answer: progress > 40 ? "$1.5 billion" : undefined,
          type: "currency",
          required: true,
          answeredAt: progress > 40 ? "2024-01-15T11:20:00Z" : undefined,
        },
        {
          id: "q7",
          section: "Investment Strategy",
          question: "What is your target net IRR for this fund?",
          answer: progress > 40 ? getTargetReturns(strategy) : undefined,
          type: "percentage",
          required: true,
          answeredAt: progress > 40 ? "2024-01-15T11:25:00Z" : undefined,
        },
      ],
    },
    {
      id: "risk_management",
      name: "Risk Management",
      questions: [
        {
          id: "q8",
          section: "Risk Management",
          question: "Please describe your comprehensive risk management framework.",
          answer:
            progress > 60
              ? `Our risk management framework is designed to identify, measure, monitor, and mitigate investment risks across multiple dimensions:

**Investment Committee Oversight:**
- All investments require unanimous approval from our 5-member Investment Committee
- Monthly portfolio reviews with detailed risk assessments
- Quarterly stress testing and scenario analysis

**Portfolio Construction:**
- Maximum 15% allocation to any single investment
- Geographic diversification across developed markets
- Sector diversification within ${strategy.toLowerCase()}
- Vintage year diversification

**Operational Risk Management:**
- Independent Risk Officer reporting to the Board
- Daily portfolio monitoring and reporting
- Comprehensive insurance coverage
- Business continuity planning

**ESG Risk Assessment:**
- Integrated ESG due diligence for all investments
- Annual ESG monitoring and reporting
- Climate risk assessment and mitigation strategies

**Liquidity Management:**
- Quarterly liquidity assessments
- Stress testing under various market scenarios
- Contingency funding arrangements`
              : undefined,
          type: "long_text",
          required: true,
          answeredAt: progress > 60 ? "2024-01-15T14:45:00Z" : undefined,
        },
      ],
    },
    {
      id: "performance_track_record",
      name: "Performance & Track Record",
      questions: [
        {
          id: "q9",
          section: "Performance & Track Record",
          question: "Please provide your historical performance data for the last 5 years.",
          answer:
            progress > 70
              ? `**Net Returns (Annual):**
- 2023: 14.2%
- 2022: 11.8% 
- 2021: 16.5%
- 2020: 9.3%
- 2019: 13.7%

**Key Performance Metrics:**
- 5-Year Average Return: 13.1%
- Volatility: 8.2%
- Sharpe Ratio: 1.45
- Maximum Drawdown: -4.2%

**Benchmark Comparison:**
Our performance has consistently outperformed the relevant ${strategy} benchmark by an average of 280 basis points annually over the past 5 years, while maintaining lower volatility.

**Fund Performance:**
- Fund I (2015-2022): 15.3% net IRR, 2.1x multiple
- Fund II (2018-ongoing): 12.8% net IRR to date, 1.7x multiple
- Current Fund III: 8.2% net IRR to date (early stage)`
              : undefined,
          type: "long_text",
          required: true,
          answeredAt: progress > 70 ? "2024-01-16T09:30:00Z" : undefined,
        },
      ],
    },
    {
      id: "esg_compliance",
      name: "ESG & Compliance",
      questions: [
        {
          id: "q10",
          section: "ESG & Compliance",
          question: "Do you have formal ESG policies and procedures in place?",
          answer: progress > 80 ? "Yes" : undefined,
          type: "yes_no",
          required: true,
          answeredAt: progress > 80 ? "2024-01-16T10:00:00Z" : undefined,
        },
        {
          id: "q11",
          section: "ESG & Compliance",
          question: "Please describe your ESG integration approach and reporting framework.",
          answer:
            progress > 80
              ? `Our ESG integration approach is comprehensive and embedded throughout our investment lifecycle:

**Pre-Investment ESG Due Diligence:**
- ESG risk assessment for all potential investments
- Climate risk analysis and carbon footprint evaluation
- Social impact assessment including community relations
- Governance review including board composition and executive compensation

**Post-Investment ESG Monitoring:**
- Annual ESG performance reviews for all portfolio companies
- Quarterly ESG metrics reporting
- Implementation of ESG improvement plans
- Regular stakeholder engagement

**ESG Reporting & Transparency:**
- Annual ESG report published for all stakeholders
- UN PRI signatory with A+ rating
- TCFD-aligned climate risk reporting
- Regular investor updates on ESG initiatives

**ESG Team & Governance:**
- Dedicated ESG Officer with direct Board reporting
- ESG Committee with external expert advisors
- Regular ESG training for all investment professionals
- Integration of ESG factors in compensation decisions

We are committed to achieving net-zero carbon emissions across our portfolio by 2050, with interim targets of 50% reduction by 2030.`
              : undefined,
          type: "long_text",
          required: false,
          answeredAt: progress > 80 ? "2024-01-16T10:15:00Z" : undefined,
        },
      ],
    },
    {
      id: "legal_regulatory",
      name: "Legal & Regulatory",
      questions: [
        {
          id: "q12",
          section: "Legal & Regulatory",
          question: "Please provide details of your regulatory registrations and compliance history.",
          answer:
            progress > 90
              ? `**Regulatory Registrations:**
- SEC Registered Investment Adviser (RIA) - File Number: 801-12345
- CFTC Commodity Pool Operator (CPO) - Registration Number: CPO-67890
- FCA Authorized Person (UK) - FRN: 123456
- FINRA Member Firm - CRD Number: 98765

**Compliance History:**
- No material regulatory violations or enforcement actions in the past 10 years
- Clean regulatory examination history with SEC, CFTC, and FCA
- Annual compliance reviews conducted by independent third parties
- Comprehensive compliance policies updated annually

**Key Compliance Personnel:**
- Chief Compliance Officer: Jane Williams, CFA (8+ years experience)
- Deputy CCO: Robert Davis, JD (6+ years experience)
- Compliance Analyst: Sarah Chen, CPA (4+ years experience)

**Regulatory Oversight:**
- Monthly compliance monitoring and reporting
- Quarterly compliance committee meetings
- Annual compliance training for all employees
- Regular consultation with external regulatory counsel`
              : undefined,
          type: "long_text",
          required: true,
          answeredAt: progress > 90 ? "2024-01-17T11:00:00Z" : undefined,
        },
      ],
    },
  ]

  return {
    id: requestId,
    templateName,
    managerName,
    managerFirm,
    allocatorName,
    status,
    strategy,
    progress,
    sections,
    metadata: {
      tags: [strategy, "Institutional", "Alternative Investments"],
      notes: "DDQ response for " + allocatorName + " - " + templateName,
    },
  }
}

const getTargetReturns = (strategy: string): string => {
  switch (strategy) {
    case "Infrastructure":
      return "12-15%"
    case "Private Equity":
      return "15-20%"
    case "Real Estate":
      return "10-14%"
    case "Private Credit":
      return "8-12%"
    case "Growth Equity":
      return "18-25%"
    default:
      return "10-15%"
  }
}

export const convertSectionsToQuestions = (sections: DDQSection[]): DDQQuestion[] => {
  return sections.flatMap((section) => section.questions)
}
