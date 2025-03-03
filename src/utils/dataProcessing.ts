import { UserData, CompanyData, ChurnRiskMetrics } from '../types';
import { defaultSettings } from '../context/SettingsContext';

// Parse CSV data into structured format
export const parseCSVData = (csvContent: string): UserData[] => {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).filter(line => line.trim() !== '').map(line => {
    const values = line.split(',');
    const user: UserData = {
      userId: values[0] || '',
      user: values[1] || '',
      email: values[2] || '',
      firstSeen: values[3] || '',
      lastSeen: values[4] || '',
      name: values[5] || '',
      primaryAccess: values[6] || '',
      signedUp: values[7] || '',
      userAccessLevel: values[8] || '',
      userflowUserId: values[9] || '',
      companyFirstSeen: values[10] || '',
      companyLastSeen: values[11] || '',
      companyName: values[12] || '',
      companySignedUp: values[13] || '',
      entityType: values[14] || '',
      paidCustomer: values[15] || '',
      firmUsers: values[16] || '',
      companyId: values[17] || ''
    };
    return user;
  });
};

// Extract domain from email
export const extractDomain = (email: string): string => {
  const parts = email.split('@');
  return parts.length > 1 ? parts[1] : 'unknown';
};

// Calculate days since a given date
export const daysSince = (dateString: string): number => {
  if (!dateString) return 365; // Default to a year if no date
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Group users by company domain
export const groupByCompany = (users: UserData[], settings = defaultSettings): CompanyData[] => {
  const companyMap = new Map<string, UserData[]>();
  
  // Group users by email domain
  users.forEach(user => {
    const domain = extractDomain(user.email);
    if (!companyMap.has(domain)) {
      companyMap.set(domain, []);
    }
    companyMap.get(domain)?.push(user);
  });
  
  // Create company data objects
  const companies: CompanyData[] = [];
  companyMap.forEach((users, domain) => {
    // Determine if this is a client or firm user group
    // Use the first user's company name to determine the type
    const userType = users[0]?.companyName === 'Client Users' 
      ? 'Client Users' 
      : 'Firm Users';
    // Initialize new fields with default values
    quarterlyPatternScore: 0,
    featureAdoptionScore: 0,
    userTrend: 'stable',
    supportHealthScore: 0,
    compositeHealthScore: 0,
      ;
    
    // Calculate metrics
    const now = new Date();
    
    // Use settings for active threshold
    const activeThreshold = settings.activeThreshold;
    
    const activeUsers = users.filter(u => daysSince(u.lastSeen) <= activeThreshold).length;
    const inactiveUsers = users.length - activeUsers;
    
    // Find the most recent activity date
    const lastActiveDateObj = users.reduce((latest, user) => {
      const userDate = new Date(user.lastSeen);
      return userDate > latest ? userDate : latest;
    }, new Date(0));
    
    const lastActiveDate = lastActiveDateObj.toISOString().split('T')[0];
    
    // Calculate average days since last active
    const totalDaysSinceActive = users.reduce((sum, user) => sum + daysSince(user.lastSeen), 0);
    const avgDaysSinceLastActive = Math.round(totalDaysSinceActive / users.length);
    
    // Calculate churn risk score (0-100, higher means higher risk)
    // Using settings for weights and caps
    
    // 1. Inactive ratio
    const inactiveRatio = users.length > 0 ? inactiveUsers / users.length : 0;
    
    // 2. Days since activity - using settings for cap
    const daysSinceLastActiveScore = Math.min(avgDaysSinceLastActive / settings.daysSinceActiveCap, 1);
    
    // 3. User count factor - using settings for cap
    const userCountFactor = Math.max(0, 1 - (users.length / settings.userCountCap));
    
    // 4. Apply weights from settings
    let churnRiskScore = Math.round(
      (inactiveRatio * settings.inactiveRatioWeight) +  
      (daysSinceLastActiveScore * settings.daysSinceActiveWeight) + 
      (userCountFactor * settings.userCountWeight)
    );
    
    // Cap the score at 100
    churnRiskScore = Math.min(churnRiskScore, 100);
    
    companies.push({
      domain,
      users,
      userCount: users.length,
      activeUsers,
      inactiveUsers,
      lastActiveDate,
      avgDaysSinceLastActive,
      churnRiskScore,
      userType
    });
  });
  
  // Sort by churn risk score (highest first)
  return companies.sort((a, b) => b.churnRiskScore - a.churnRiskScore);
};

// Calculate overall metrics for a set of companies
export const calculateChurnMetrics = (companies: CompanyData[], settings = defaultSettings): ChurnRiskMetrics => {
  // Use thresholds from settings
  const highRiskThreshold = settings.highRiskThreshold;
  const mediumRiskThreshold = settings.mediumRiskThreshold;
  
  const highRiskCount = companies.filter(c => c.churnRiskScore >= highRiskThreshold).length;
  const mediumRiskCount = companies.filter(c => c.churnRiskScore >= mediumRiskThreshold && c.churnRiskScore < highRiskThreshold).length;
  const lowRiskCount = companies.filter(c => c.churnRiskScore < mediumRiskThreshold).length;
  
  const inactiveCompanies = companies.filter(c => c.activeUsers === 0).length;
  const totalChurnScore = companies.reduce((sum, company) => sum + company.churnRiskScore, 0);
  const averageChurnScore = companies.length > 0 ? Math.round(totalChurnScore / companies.length) : 0;
  
  return {
    totalCompanies: companies.length,
    highRiskCount,
    mediumRiskCount,
    lowRiskCount,
    inactiveCompanies,
    averageChurnScore
  };
};
// Analyze seasonal patterns in user activity
export const analyzeSeasonalPatterns = (company: CompanyData): number => {
  const userActivity = company.users.map(user => ({
    date: new Date(user.lastSeen),
    userId: user.userId
  }));
  
  // Group by quarter
  const quarterActivity = groupByQuarter(userActivity);
  
  // Calculate expected patterns based on company type and industry
  // Return a score representing how well they match expected patterns
  // Higher score = matches expected seasonal patterns
  
  // Implementation details would depend on your specific business rules
  return scoreBasedOnQuarterlyPatterns(quarterActivity);
};

