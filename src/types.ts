export interface UserData {
  userId: string;
  user: string;
  email: string;
  firstSeen: string;
  lastSeen: string;
  name: string;
  primaryAccess: string;
  signedUp: string;
  userAccessLevel: string;
  userflowUserId: string;
  companyFirstSeen: string;
  companyLastSeen: string;
  companyName: string;
  companySignedUp: string;
  entityType: string;
  paidCustomer: string;
  firmUsers: string;
  companyId: string;
  // New fields
  roleCategory: string; // Admin, Standard, Read-only
  featureUsage: {
    leaseAccounting: number;
    fixedAssets: number;
    journalEntries: number;
  };
  sessionDuration: number; // Average time spent per session
  supportTicketsOpened: number;
  supportTicketsClosed: number;
  trainingCompleted: boolean;
}

export interface CompanyData {
  domain: string;
  users: UserData[];
  userCount: number;
  activeUsers: number;
  inactiveUsers: number;
  lastActiveDate: string;
  avgDaysSinceLastActive: number;
  churnRiskScore: number;
  userType: 'Client Users' | 'Firm Users';
  // New fields
  quarterlyPatternScore: number; // How well they follow expected quarterly patterns
  featureAdoptionScore: number; // How many features they regularly use
  userTrend: 'growing' | 'stable' | 'declining';
  supportHealthScore: number;
  compositeHealthScore: number;
}

export interface ChurnRiskMetrics {
  totalCompanies: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  inactiveCompanies: number;
  averageChurnScore: number;
}

export interface RiskSettings {
  // Thresholds
  activeThreshold: number;
  highRiskThreshold: number;
  mediumRiskThreshold: number;
  
  // Weights for risk calculation
  inactiveRatioWeight: number;
  daysSinceActiveWeight: number;
  userCountWeight: number;
  
  // Caps
  daysSinceActiveCap: number;
  userCountCap: number;
}

export interface SettingsContextType {
  settings: RiskSettings;
  updateSettings: (newSettings: RiskSettings) => void;
  resetSettings: () => void;
}
