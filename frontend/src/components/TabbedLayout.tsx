import React, { useState } from 'react';

// Define the shape of each tab object
interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabbedLayoutProps {
  tabs: Tab[];
  initialTab?: string;
}

const TabbedLayout: React.FC<TabbedLayoutProps> = ({ tabs, initialTab }) => {
  const [activeTabLabel, setActiveTabLabel] = useState(initialTab || tabs[0]?.label);

  const activeTabContent = tabs.find(tab => tab.label === activeTabLabel)?.content;

  return (
    <div className="tabbed-layout">
      {/* Tab Navigation */}
      <nav className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={tab.label === activeTabLabel ? 'active' : ''}
            onClick={() => setActiveTabLabel(tab.label)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <main className="tab-content">
        {activeTabContent || <div>No content for this tab.</div>}
      </main>
    </div>
  );
};

export default TabbedLayout;