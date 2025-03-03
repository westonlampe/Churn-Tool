import React, { createContext, useState, useContext, ReactNode } from 'react';
import { RiskSettings } from '../types';

// Default settings for accounting software with monthly/quarterly usage
export const defaultSettings: RiskSettings = {
  // Thresholds
  activeThreshold: 90, // Consider inactive if not seen in 90 days (quarterly)
  highRiskThreshold: 75, // High risk threshold
  mediumRiskThreshold: 45, // Medium risk threshold
  
  // Weights for risk calculation (must sum to 100)
  inactiveRatioWeight: 30, // Weight for inactive users ratio
  daysSinceActiveWeight: 60, // Weight for days since last active
  userCountWeight: 10, // Weight for user count factor
  
  // Caps
  daysSinceActiveCap: 180, // Cap days since active at 180 days (6 months)
  userCountCap: 20 // User count factor denominator
};

const SettingsContext = createContext<{
  settings: RiskSettings;
  updateSettings: (newSettings: RiskSettings) => void;
  resetSettings: () => void;
}>({
  settings: defaultSettings,
  updateSettings: () => {},
  resetSettings: () => {}
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<RiskSettings>(defaultSettings);

  const updateSettings = (newSettings: RiskSettings) => {
    setSettings(newSettings);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};