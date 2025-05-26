
import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { ArchitectureDiagram } from '../components/ArchitectureDiagram';
import { ConfigManager } from '../components/ConfigManager';
import { DeploymentStatus } from '../components/DeploymentStatus';
import { SecurityOverview } from '../components/SecurityOverview';
import { QuickActions } from '../components/QuickActions';
import { WordPressDeploymentGuide } from '../components/WordPressDeploymentGuide';

const Index = () => {
  const [activeView, setActiveView] = useState('architecture');

  const renderMainContent = () => {
    switch (activeView) {
      case 'architecture':
        return <ArchitectureDiagram />;
      case 'configs':
        return <ConfigManager />;
      case 'deployments':
        return <DeploymentStatus />;
      case 'deployment-guide':
        return <WordPressDeploymentGuide />;
      case 'security':
        return <SecurityOverview />;
      default:
        return <ArchitectureDiagram />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="flex">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 p-6">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              WordPress CloudNative Stack
            </h1>
            <p className="text-blue-200">
              Production-Ready WordPress with MySQL, MongoDB & Advanced DevOps Automation
            </p>
          </header>
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3">
              {renderMainContent()}
            </div>
            <div className="xl:col-span-1">
              <QuickActions />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
