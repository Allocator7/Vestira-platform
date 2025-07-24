// Centralized taxonomy for the entire Vestira platform
// This ensures consistency across all filters, profiles, and search functionality

export const AssetClasses = [
  "Public Equities",
  "Public Fixed Income",
  "Private Fixed Income",
  "Real Estate",
  "Private Equity & Other Alternatives",
] as const

export const PublicEquitiesStrategies = [
  "Index/ETF Strategies",
  "Large Cap Equity",
  "Small/Mid Cap Equity",
  "Global/International Equity",
  "Emerging Markets Equity",
  "Sector-Specific Equity",
  "ESG/Sustainable Equity",
  "Long/Short Equity",
] as const

export const PublicFixedIncomeStrategies = [
  "Investment Grade Corporate Bonds",
  "High Yield Bonds",
  "Emerging Market Bonds",
  "Long Duration",
  "Short Duration",
  "Liability Driven Investing",
  "Core Fixed Income",
  "Core Insurance",
  "Structured Credit",
] as const

export const PrivateFixedIncomeStrategies = [
  "Corporate Private Placements",
  "Infrastructure Debt",
  "Private Asset Based Finance",
  "Direct Lending",
] as const

export const RealEstateStrategies = [
  "Real Estate Debt",
  "Commercial Mortgage Loans",
  "Residential Mortgage Loans",
  "Real Estate Equity",
] as const

export const PrivateEquityAndAlternativesStrategies = [
  "Private Equity",
  "Buyouts",
  "Growth Equity",
  "Venture Capital",
  "Digital Assets",
] as const

// Combined list of all focus areas for universal use
export const AllFocusAreas = [
  ...PublicEquitiesStrategies,
  ...PublicFixedIncomeStrategies,
  ...PrivateFixedIncomeStrategies,
  ...RealEstateStrategies,
  ...PrivateEquityAndAlternativesStrategies,
] as const

// Sector-specific categories for sector-based filtering
export const SectorCategories = [
  "Technology",
  "Healthcare",
  "Financial Services",
  "Consumer",
  "Industrial",
  "Energy",
  "Media & Telecom",
  "Real Estate",
  "Infrastructure",
] as const

// Organization types by user category
export const AllocatorTypes = [
  "Public Pension",
  "Corporate Pension",
  "Endowment",
  "Foundation",
  "Family Office",
  "Insurance Company",
  "Sovereign Wealth Fund",
] as const

export const ManagerTypes = [
  "Private Equity",
  "Venture Capital",
  "Hedge Fund",
  "Real Estate",
  "Infrastructure",
  "Credit",
  "Growth Equity",
  "Alternative Asset Manager",
  "Investment Firm",
] as const

export const ConsultantTypes = [
  "Investment Consultant",
  "OCIO Provider",
  "Advisory Firm",
  "Wealth Management",
  "Independent Consultant",
] as const

// Geographic regions
export const GeographicRegions = [
  "North America",
  "Europe",
  "Asia",
  "Middle East",
  "Australia",
  "South America",
  "Africa",
] as const

// AUM ranges for filtering
export const AUMRanges = [
  "Under $1B",
  "Under $5B",
  "$1B - $5B",
  "$5B - $10B",
  "$10B - $25B",
  "$25B - $50B",
  "$50B - $100B",
  "$100B - $300B",
  "$300B - $500B",
  "Over $100B",
  "Over $500B",
] as const

// Experience levels
export const ExperienceLevels = ["0-5 years", "5-10 years", "10-15 years", "15-20 years", "20+ years"] as const

export type AssetClass = (typeof AssetClasses)[number]
export type FocusArea = (typeof AllFocusAreas)[number]
export type SectorCategory = (typeof SectorCategories)[number]
export type AllocatorType = (typeof AllocatorTypes)[number]
export type ManagerType = (typeof ManagerTypes)[number]
export type ConsultantType = (typeof ConsultantTypes)[number]
export type GeographicRegion = (typeof GeographicRegions)[number]
export type AUMRange = (typeof AUMRanges)[number]
export type ExperienceLevel = (typeof ExperienceLevels)[number]
