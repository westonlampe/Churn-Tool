import React, { useState, useEffect } from 'react';
import { UserData, CompanyData, ChurnRiskMetrics } from '../types';
import { groupByCompany, calculateChurnMetrics } from '../utils/dataProcessing';
import FileUpload from './FileUpload';
import CompanyList from './CompanyList';
import MetricsOverview from './MetricsOverview';
import ExportData from './ExportData';
import SettingsPanel from './SettingsPanel';
import ActivityTicker from './ActivityTicker';
import { useSettings } from '../context/SettingsContext';

const ChurnRiskDashboard: React.FC = () => {
  const { settings } = useSettings();
  const [userData, setUserData] = useState<UserData[]>([]);
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [clientCompanies, setClientCompanies] = useState<CompanyData[]>([]);
  const [firmCompanies, setFirmCompanies] = useState<CompanyData[]>([]);
  const [clientMetrics, setClientMetrics] = useState<ChurnRiskMetrics | null>(null);
  const [firmMetrics, setFirmMetrics] = useState<ChurnRiskMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'client' | 'firm'>('client');

  // Recalculate metrics when settings change
  useEffect(() => {
    if (userData.length > 0) {
      processData(userData);
    }
  }, [settings]);

  const handleDataLoaded = (data: UserData[]) => {
    setIsLoading(true);
    setUserData(data);
    
    // Process data asynchronously to avoid blocking the UI
    setTimeout(() => {
      processData(data);
      setIsLoading(false);
    }, 100);
  };

  const processData = (data: UserData[]) => {
    const allCompanies = groupByCompany(data, settings);
    setCompanies(allCompanies);
    
    // Split companies by user type
    const clientComps = allCompanies.filter(c => c.userType === 'Client Users');
    const firmComps = allCompanies.filter(c => c.userType === 'Firm Users');
    
    setClientCompanies(clientComps);
    setFirmCompanies(firmComps);
    
    // Calculate metrics
    setClientMetrics(calculateChurnMetrics(clientComps, settings));
    setFirmMetrics(calculateChurnMetrics(firmComps, settings));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">User Churn Risk Analysis</h1>
      
      {userData.length === 0 ? (
        <div className="max-w-2xl mx-auto">
          <FileUpload onDataLoaded={handleDataLoaded} isLoading={isLoading} />
        </div>
      ) : (
        <div>
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Dashboard</h2>
              <div className="flex space-x-3">
                <SettingsPanel />
                <button 
                  onClick={() => {
                    setUserData([]);
                    setCompanies([]);
                    setClientCompanies([]);
                    setFirmCompanies([]);
                    setClientMetrics(null);
                    setFirmMetrics(null);
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium"
                >
                  Upload New File
                </button>
              </div>
            </div>

            <ActivityTicker companies={activeTab === 'client' ? clientCompanies : firmCompanies} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clientMetrics && (
                <MetricsOverview 
                  metrics={clientMetrics} 
                  title="Client Users Overview" 
                  userType="Client Users"
                />
              )}
              
              {firmMetrics && (
                <MetricsOverview 
                  metrics={firmMetrics} 
                  title="Firm Users Overview" 
                  userType="Firm Users"
                />
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setActiveTab('client')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'client'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Client Companies
                </button>
                <button
                  onClick={() => setActiveTab('firm')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'firm'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Firm Companies
                </button>
              </nav>
            </div>
          </div>
          
          {activeTab === 'client' ? (
            <>
              <ExportData companies={clientCompanies} userType="Client Users" />
              <CompanyList companies={clientCompanies} userType="Client Users" />
            </>
          ) : (
            <>
              <ExportData companies={firmCompanies} userType="Firm Users" />
              <CompanyList companies={firmCompanies} userType="Firm Users" />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChurnRiskDashboard;
