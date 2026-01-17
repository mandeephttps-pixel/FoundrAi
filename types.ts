
export interface UserPreferences {
  budget: string;
  skillLevel: string;
  timeAvailability: string;
  geography: string;
  preference: 'Online' | 'Offline' | 'Hybrid';
  riskTolerance: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedDate: string;
  status: UserStatus;
}

export interface BusinessModelCanvas {
  customerSegments?: string;
  valueProposition?: string;
  channels?: string;
  customerRelationships?: string;
  revenueStreams?: string;
  keyActivities?: string;
  keyResources?: string;
  keyPartners?: string;
  costStructure?: string;
}

export interface Roadmap {
  day30?: string;
  day60?: string;
  day90?: string;
}

export interface ToolStackItem {
  category: string;
  tools: string[];
}

export interface BusinessIdea {
  id: string;
  businessName: string;
  category: string;
  subcategory: string;
  problemStatement: string;
  uniqueValueProposition: string;
  targetCustomers: string;
  revenueModel: string;
  estimatedStartupCost: string;
  profitPotential: string;
  scalabilityLevel: string;
  aiAutomationUsage: string;
  competitiveAdvantage: string;
  whyWorkIn2025: string;
  
  marketDemandScore?: number;
  competitionLevel?: 'Low' | 'Medium' | 'High';
  executionDifficulty?: number;
  riskScore?: number;
  
  businessModelCanvas?: BusinessModelCanvas;
  gtmStrategy?: string;
  pricingStrategy?: string;
  roadmap?: Roadmap;
  toolStack?: ToolStackItem[];
  mentorInsight?: {
    mistakeToAvoid: string;
    growthLever: string;
    unfairAdvantage: string;
  };
}

export type UserStatus = 'guest' | 'logged_in_free' | 'pro';
export type UserPlan = 'Free' | 'Pro';

export interface CategoryItem {
  name: string;
  iconName: string;
}

export interface CategoryGroup {
  label: string;
  categories: CategoryItem[];
}
