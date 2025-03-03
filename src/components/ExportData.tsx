import React from 'react';
import { CompanyData } from '../types';

interface ExportDataProps {
  companies: CompanyData[];
  userType: 'Client Users' | 'Firm Users';
}

const ExportData: React.FC<ExportDataProps> = ({ companies, userType }) => {
  const exportToCSV = () => {
    // Create CSV header
    const headers = [
      'Domain',
      'User Count',
      'Active Users',
      'Inactive Users',
      'Last Active Date',
      'Avg Days Since Last Active',
      'Churn Risk Score',
      'User Type'
    ];

    // Create CSV rows from company data
    const csvRows = companies.map(company => [
      company.domain,
      company.userCount,
      company.activeUsers,
      company.inactiveUsers,
      company.lastActiveDate,
      company.avgDaysSinceLastActive,
      company.churnRiskScore,
      company.userType
    ]);

    // Combine header and rows
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${userType.replace(' ', '_')}_churn_risk_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    // Create a simplified version of the data for export
    const exportData = companies.map(company => ({
      domain: company.domain,
      userCount: company.userCount,
      activeUsers: company.activeUsers,
      inactiveUsers: company.inactiveUsers,
      lastActiveDate: company.lastActiveDate,
      avgDaysSinceLastActive: company.avgDaysSinceLastActive,
      churnRiskScore: company.churnRiskScore,
      userType: company.userType,
      users: company.users.map(user => ({
        name: user.name,
        email: user.email,
        firstSeen: user.firstSeen,
        lastSeen: user.lastSeen,
        primaryAccess: user.primaryAccess
      }))
    }));

    // Create a blob and download link
    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${userType.replace(' ', '_')}_churn_risk_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportDetailedCSV = () => {
    // Create CSV header for detailed export with user data
    const headers = [
      'Company Domain',
      'User Name',
      'User Email',
      'Access Level',
      'First Seen',
      'Last Seen',
      'Days Since Last Active',
      'Company Churn Risk Score',
      'User Type'
    ];

    // Create CSV rows from detailed user data
    const csvRows = [];
    companies.forEach(company => {
      company.users.forEach(user => {
        const daysSinceActive = calculateDaysSince(user.lastSeen);
        csvRows.push([
          company.domain,
          user.name,
          user.email,
          user.primaryAccess,
          user.firstSeen.split('T')[0],
          user.lastSeen.split('T')[0],
          daysSinceActive,
          company.churnRiskScore,
          company.userType
        ]);
      });
    });

    // Combine header and rows
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${userType.replace(' ', '_')}_detailed_churn_risk_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper function to calculate days since a date
  const calculateDaysSince = (dateString: string): number => {
    if (!dateString) return 365;
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Export Data</h3>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Export Summary (CSV)
        </button>
        <button
          onClick={exportDetailedCSV}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Export Detailed User Data (CSV)
        </button>
        <button
          onClick={exportToJSON}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Export Full Data (JSON)
        </button>
      </div>
    </div>
  );
};

export default ExportData;