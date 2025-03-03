import React, { useState } from 'react';
import { RiskSettings } from '../types';
import { useSettings, defaultSettings } from '../context/SettingsContext';
import { Settings } from 'lucide-react';

const SettingsPanel: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<RiskSettings>(settings);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = () => {
    setLocalSettings(settings);
    setIsOpen(true);
    setError(null);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Convert to number and check if it's a valid number
    const numValue = parseInt(value, 10);
    
    // Only update if it's a valid number or empty string (for user typing)
    if (!isNaN(numValue) || value === '') {
      setLocalSettings(prev => ({
        ...prev,
        [name]: value === '' ? '' : numValue
      }));
    }
  };

  const validateSettings = (settings: RiskSettings): boolean => {
    // Check if any values are empty strings and convert them to defaults
    const validatedSettings = { ...settings };
    Object.keys(validatedSettings).forEach(key => {
      if (validatedSettings[key as keyof RiskSettings] === '') {
        validatedSettings[key as keyof RiskSettings] = defaultSettings[key as keyof RiskSettings];
      }
    });
    
    // Update local settings with validated values
    setLocalSettings(validatedSettings);
    
    // Check if weights sum to 100
    const weightSum = validatedSettings.inactiveRatioWeight + validatedSettings.daysSinceActiveWeight + validatedSettings.userCountWeight;
    if (weightSum !== 100) {
      setError(`Weights must sum to 100. Current sum: ${weightSum}`);
      return false;
    }

    // Check thresholds
    if (validatedSettings.highRiskThreshold <= validatedSettings.mediumRiskThreshold) {
      setError('High risk threshold must be greater than medium risk threshold');
      return false;
    }

    if (validatedSettings.mediumRiskThreshold <= 0 || validatedSettings.highRiskThreshold <= 0) {
      setError('Risk thresholds must be greater than 0');
      return false;
    }

    if (validatedSettings.highRiskThreshold > 100) {
      setError('Risk thresholds cannot exceed 100');
      return false;
    }

    // Check caps and thresholds
    if (validatedSettings.activeThreshold <= 0 || validatedSettings.daysSinceActiveCap <= 0 || validatedSettings.userCountCap <= 0) {
      setError('Thresholds and caps must be greater than 0');
      return false;
    }

    if (validatedSettings.daysSinceActiveCap < validatedSettings.activeThreshold) {
      setError('Days since active cap should be greater than or equal to active threshold');
      return false;
    }

    setError(null);
    return true;
  };

  const handleSave = () => {
    if (validateSettings(localSettings)) {
      updateSettings(localSettings);
      setIsOpen(false);
    }
  };

  const handleReset = () => {
    setLocalSettings(defaultSettings);
    setError(null);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium"
      >
        <Settings className="h-4 w-4 mr-2" />
        Risk Settings
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Risk Calculation Settings</h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4">
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Activity Thresholds</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Active Threshold (days)
                      <span className="ml-1 text-xs text-gray-500">
                        Users inactive for longer than this are considered at risk
                      </span>
                    </label>
                    <input
                      type="number"
                      name="activeThreshold"
                      value={localSettings.activeThreshold.toString()}
                      onChange={handleChange}
                      min="1"
                      max="365"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Days Since Active Cap
                      <span className="ml-1 text-xs text-gray-500">
                        Maximum days to consider for risk calculation
                      </span>
                    </label>
                    <input
                      type="number"
                      name="daysSinceActiveCap"
                      value={localSettings.daysSinceActiveCap.toString()}
                      onChange={handleChange}
                      min="1"
                      max="365"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Risk Thresholds</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      High Risk Threshold
                      <span className="ml-1 text-xs text-gray-500">
                        Score above this is considered high risk
                      </span>
                    </label>
                    <input
                      type="number"
                      name="highRiskThreshold"
                      value={localSettings.highRiskThreshold.toString()}
                      onChange={handleChange}
                      min="1"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Medium Risk Threshold
                      <span className="ml-1 text-xs text-gray-500">
                        Score above this is considered medium risk
                      </span>
                    </label>
                    <input
                      type="number"
                      name="mediumRiskThreshold"
                      value={localSettings.mediumRiskThreshold.toString()}
                      onChange={handleChange}
                      min="1"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Risk Calculation Weights (must sum to 100)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Inactive Ratio Weight
                      <span className="ml-1 text-xs text-gray-500">
                        Importance of inactive user percentage
                      </span>
                    </label>
                    <input
                      type="number"
                      name="inactiveRatioWeight"
                      value={localSettings.inactiveRatioWeight.toString()}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Days Since Active Weight
                      <span className="ml-1 text-xs text-gray-500">
                        Importance of time since last activity
                      </span>
                    </label>
                    <input
                      type="number"
                      name="daysSinceActiveWeight"
                      value={localSettings.daysSinceActiveWeight.toString()}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User Count Weight
                      <span className="ml-1 text-xs text-gray-500">
                        Importance of total user count
                      </span>
                    </label>
                    <input
                      type="number"
                      name="userCountWeight"
                      value={localSettings.userCountWeight.toString()}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User Count Cap
                    <span className="ml-1 text-xs text-gray-500">
                      Number of users at which the user count factor is minimized
                    </span>
                  </label>
                  <input
                    type="number"
                    name="userCountCap"
                    value={localSettings.userCountCap.toString()}
                    onChange={handleChange}
                    min="1"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                <h4 className="font-medium mb-1">How Risk Score is Calculated:</h4>
                <p className="mb-2">The risk score (0-100) is calculated using the following formula:</p>
                <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
                  Risk Score = (Inactive Ratio × {localSettings.inactiveRatioWeight}) + 
                  (Days Since Active Score × {localSettings.daysSinceActiveWeight}) + 
                  (User Count Factor × {localSettings.userCountWeight})
                </pre>
                <ul className="list-disc pl-5 mt-2">
                  <li>Inactive Ratio: Percentage of users who haven't logged in for {localSettings.activeThreshold} days</li>
                  <li>Days Since Active Score: Average days since last activity, capped at {localSettings.daysSinceActiveCap} days</li>
                  <li>User Count Factor: Decreases risk as user count increases, minimized at {localSettings.userCountCap} users</li>
                </ul>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 flex justify-between">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium"
              >
                Reset to Defaults
              </button>
              <div>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsPanel;