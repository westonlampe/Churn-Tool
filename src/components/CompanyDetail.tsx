import React from 'react';
import { CompanyData } from '../types';
import { useSettings } from '../context/SettingsContext';

interface CompanyDetailProps {
  company: CompanyData;
}

const CompanyDetail: React.FC<CompanyDetailProps> = ({ company }) => {
  const { settings } = useSettings();
  
  // Sort users by last seen date (most recent first)
  const sortedUsers = [...company.users].sort((a, b) => {
    return new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime();
  });

  const getRiskClass = (score: number) => {
    if (score >= settings.highRiskThreshold) return 'bg-red-100 text-red-800';
    if (score >= settings.mediumRiskThreshold) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const daysSince = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{company.domain}</h2>
          <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getRiskClass(company.churnRiskScore)}`}>
            Risk Score: {company.churnRiskScore}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">User Type: {company.userType}</p>
      </div>
      
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{company.userCount}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Active / Inactive</h3>
            <p className="mt-1 text-3xl font-semibold text-gray-900">
              {company.activeUsers} / {company.inactiveUsers}
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Avg Days Since Activity</h3>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{company.avgDaysSinceLastActive}</p>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">User Activity</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Access Level
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  First Seen
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Seen
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days Inactive
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedUsers.map((user, index) => (
                <tr key={index} className={daysSince(user.lastSeen) > settings.activeThreshold ? 'bg-red-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.primaryAccess}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(user.firstSeen)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(user.lastSeen)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{daysSince(user.lastSeen)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;