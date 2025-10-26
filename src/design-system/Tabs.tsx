import React, { useState, createContext, useContext } from "react";

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}

export interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

export interface TabProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export interface TabPanelsProps {
  children: React.ReactNode;
  className?: string;
}

export interface TabPanelProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ defaultValue, children, className = "" }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabList({ children, className = "" }: TabListProps) {
  return (
    <div className={`flex border-b border-gray-700 ${className}`}>
      {children}
    </div>
  );
}

export function Tab({ value, children, className = "" }: TabProps) {
  const { activeTab, setActiveTab } = useContext(TabsContext)!;
  const isActive = activeTab === value;

  const baseClasses =
    "px-4 py-2 text-sm font-medium cursor-pointer transition-colors focus:outline-none";
  const activeClasses = "border-b-2 border-orange-500 text-orange-500";
  const inactiveClasses =
    "text-gray-400 hover:text-white hover:border-b-2 hover:border-gray-500";

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`${baseClasses} ${
        isActive ? activeClasses : inactiveClasses
      } ${className}`}
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${value}`}
    >
      {children}
    </button>
  );
}

export function TabPanels({ children, className = "" }: TabPanelsProps) {
  return <div className={className}>{children}</div>;
}

export function TabPanel({ value, children, className = "" }: TabPanelProps) {
  const { activeTab } = useContext(TabsContext)!;

  if (activeTab !== value) {
    return null;
  }

  return (
    <div
      id={`panel-${value}`}
      role="tabpanel"
      aria-labelledby={`tab-${value}`}
      className={className}
    >
      {children}
    </div>
  );
}
