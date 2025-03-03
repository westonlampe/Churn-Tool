import React from 'react';
import { ChurnRiskMetrics } from '../types';
import { useSettings } from '../context/SettingsContext';

interface MetricsOverviewProps {
  metrics: ChurnRiskMetrics;
  title: string;
  userType: 'Client Users' | 'Firm Users';
}

const MetricsOverview: React.FC<MetricsOverviewProps> = ({ metrics, title, userType }) => {
  const { settings } = useSettings();
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Companies</p>
                <p className="text-2xl font-semibold">{metrics.totalCompanies}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Average Risk Score</p>
                <p className="text-2xl font-semibold">{metrics.averageChurnScore}</p>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">High Risk Companies</p>
            <p className="text-2xl font-semibold text-red-600">{metrics.highRiskCount}</p>
            <p className="text-xs text-gray-500">
              {metrics.totalCompanies > 0 
                ? `${Math.round((metrics.highRiskCount / metrics.totalCompanies) * 100)}%` 
                : '0%'}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Medium Risk Companies</p>
            <p className="text-2xl font-semibold text-yellow-600">{metrics.mediumRiskCount}</p>
            <p className="text-xs text-gray-500">
              {metrics.totalCompanies > 0 
                ? `${Math.round((metrics.mediumRiskCount / metrics.totalCompanies) * 100)}%` 
                : '0%'}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Low Risk Companies</p>
            <p className="text-2xl font-semibold text-green-600">{metrics.lowRiskCount}</p>
            <p className="text-xs text-gray-500">
              {metrics.totalCompanies > 0 
                ? `${Math.round((metrics.lowRiskCount / metrics.totalCompanies) * 100)}%` 
                : '0%'}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Inactive Companies</p>
            <p className="text-2xl font-semibold text-gray-600">{metrics.inactiveCompanies}</p>
            <p className="text-xs text-gray-500">
              {metrics.totalCompanies > 0 
                ? `${Math.round((metrics.inactiveCompanies / metrics.totalCompanies) * 100)}%` 
                : '0%'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-gray-50">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                High Risk
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-red-600">
                {metrics.highRiskCount}
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <div 
              style={{ width: `${metrics.totalCompanies > 0 ? (metrics.highRiskCount / metrics.totalCompanies) * 100 : 0}%` }} 
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
            ></div>
          </div>
          
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-200">
                Medium Risk
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-yellow-600">
                {metrics.mediumRiskCount}
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <div 
              style={{ width: `${metrics.totalCompanies > 0 ? (metrics.mediumRiskCount / metrics.totalCompanies) * 100 : 0}%` }} 
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"
            ></div>
          </div>
          
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                Low Risk
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-green-600">
                {metrics.lowRiskCount}
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
            <div 
              style={{ width: `${metrics.totalCompanies > 0 ? (metrics.lowRiskCount / metrics.totalCompanies) * 100 : 0}%` }} 
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsOverview;