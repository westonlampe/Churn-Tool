import React from 'react';
import ChurnRiskDashboard from './components/ChurnRiskDashboard';
import { FileText } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">User Churn Risk Analyzer</h1>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <ChurnRiskDashboard />
      </main>
      
      <footer className="bg-white mt-12 py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Upload your UserFlow CSV export to analyze user churn risk by company domain.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;