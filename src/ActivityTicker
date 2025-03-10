import React from 'react';
import { CompanyData } from '../types';
import { daysSince } from '../utils/dataProcessing';

interface ActivityTickerProps {
  companies: CompanyData[];
}

const ActivityTicker: React.FC<ActivityTickerProps> = ({ companies }) => {
  // Calculate active users and companies in the last week and month
  const getRecentActivity = (days: number) => {
    const activeCompanies = new Set<string>();
    let activeUsers = 0;

    companies.forEach(company => {
      let hasRecentActivity = false;
      company.users.forEach(user => {
        if (daysSince(user.lastSeen) <= days) {
          activeUsers++;
          hasRecentActivity = true;
        }
      });
      if (hasRecentActivity) {
        activeCompanies.add(company.domain);
      }
    });

    return {
      users: activeUsers,
      companies: activeCompanies.size
    };
  };

  const weeklyActivity = getRecentActivity(7);
  const monthlyActivity = getRecentActivity(30);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border-r border-gray-200 pr-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Last 7 Days</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{weeklyActivity.users}</p>
              <p className="text-sm text-gray-600">Active Users</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{weeklyActivity.companies}</p>
              <p className="text-sm text-gray-600">Active Companies</p>
            </div>
          </div>
        </div>
        
        <div className="pl-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Last 30 Days</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{monthlyActivity.users}</p>
              <p className="text-sm text-gray-600">Active Users</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{monthlyActivity.companies}</p>
              <p className="text-sm text-gray-600">Active Companies</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityTicker;
