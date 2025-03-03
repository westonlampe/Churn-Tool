import React, { useState } from 'react';
import { CompanyData } from '../types';
import CompanyDetail from './CompanyDetail';
import { useSettings } from '../context/SettingsContext';

interface CompanyListProps {
  companies: CompanyData[];
  userType: 'Client Users' | 'Firm Users';
}

const CompanyList: React.FC<CompanyListProps> = ({ companies, userType }) => {
  const { settings } = useSettings();
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.domain.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesRisk = true;
    if (riskFilter === 'high') {
      matchesRisk = company.churnRiskScore >= settings.highRiskThreshold;
    } else if (riskFilter === 'medium') {
      matchesRisk = company.churnRiskScore >= settings.mediumRiskThreshold && company.churnRiskScore < settings.highRiskThreshold;
    } else if (riskFilter === 'low') {
      matchesRisk = company.churnRiskScore < settings.mediumRiskThreshold;
    }
    
    return matchesSearch && matchesRisk;
  });

  const getRiskClass = (score: number) => {
    if (score >= settings.highRiskThreshold) return 'bg-red-100 text-red-800';
    if (score >= settings.mediumRiskThreshold) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by domain..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as any)}
          >
            <option value="all">All Risk Levels</option>
            <option value="high">High Risk ({settings.highRiskThreshold}-100)</option>
            <option value="medium">Medium Risk ({settings.mediumRiskThreshold}-{settings.highRiskThreshold - 1})</option>
            <option value="low">Low Risk (0-{settings.mediumRiskThreshold - 1})</option>
          </select>
        </div>
      </div>

      {selectedCompany ? (
        <div>
          <button
            onClick={() => setSelectedCompany(null)}
            className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to list
          </button>
          <CompanyDetail company={selectedCompany} />
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-semibold mb-4">{userType} Companies ({filteredCompanies.length})</h3>
          
          {filteredCompanies.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No companies match your search criteria.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Domain
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Users
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Active / Inactive
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Days Inactive
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Churn Risk
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCompanies.map((company, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{company.domain}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{company.userCount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {company.activeUsers} / {company.inactiveUsers}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{company.lastActiveDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{company.avgDaysSinceLastActive}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskClass(company.churnRiskScore)}`}>
                          {company.churnRiskScore}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => setSelectedCompany(company)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyList;