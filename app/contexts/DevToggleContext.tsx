import React, { createContext, useContext, useState } from 'react';

type DevToggleContextType = {
  isRealTimeNotificationsEnabled: boolean;
  toggleRealTimeNotifications: () => void;
};

const DevToggleContext = createContext<DevToggleContextType | undefined>(undefined);

export function DevToggleProvider({ children }: { children: React.ReactNode }) {
  const [isRealTimeNotificationsEnabled, setIsRealTimeNotificationsEnabled] = useState(false);

  const toggleRealTimeNotifications = () => {
    setIsRealTimeNotificationsEnabled(prev => !prev);
  };

  return (
    <DevToggleContext.Provider value={{
      isRealTimeNotificationsEnabled,
      toggleRealTimeNotifications,
    }}>
      {children}
    </DevToggleContext.Provider>
  );
}

export function useDevToggle() {
  const context = useContext(DevToggleContext);
  if (context === undefined) {
    throw new Error('useDevToggle must be used within a DevToggleProvider');
  }
  return context;
} 