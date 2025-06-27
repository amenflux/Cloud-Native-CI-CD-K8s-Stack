
import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { ArchitectureDiagram } from '../components/ArchitectureDiagram';
import { ConfigManager } from '../components/ConfigManager';
import { DeploymentStatus } from '../components/DeploymentStatus';
import { SecurityOverview } from '../components/SecurityOverview';
import { QuickActions } from '../components/QuickActions';
import { WordPressDeploymentGuide } from '../components/WordPressDeploymentGuide';
import { JenkinsConfig } from '../components/JenkinsConfig';
import { deploymentStore } from '../store/deploymentStore';

const Index = () => {
  const [activeView, setActiveView] = useState('architecture');
  const [deploymentState, setDeploymentState] = useState(deploymentStore.getState());

  useEffect(() => {
    const unsubscribe = deploymentStore.subscribe(() => {
      setDeploymentState(deploymentStore.getState());
    });

    return unsubscribe;
  }, []);

  const systemStats = {
    nodes: deploymentState.nodes,
    pods: deploymentState.totalPods,
    databases: deploymentState.databases
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'architecture':
        return <ArchitectureDiagram />;
      case 'configs':
        return <ConfigManager deploymentState={deploymentState} />;
      case 'deployments':
        return <DeploymentStatus deploymentState={deploymentState} />;
      case 'jenkins':
        return <JenkinsConfig />;
      case 'deployment-guide':
        return <WordPressDeploymentGuide />;
      case 'security':
        return <SecurityOverview />;
      default:
        return <ArchitectureDiagram />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 dark:from-slate-900 dark:via-blue-900 dark:to-slate-800 light:from-slate-100 light:via-blue-100 light:to-slate-200 flex">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView}
        systemStats={systemStats}
      />
      <main className="flex-1 p-8">
        <header className="mb-16">
          <h1 className="text-4xl font-bold text-white dark:text-white light:text-slate-900 mb-4">
            WordPress CloudNative Stack
          </h1>
          <p className="text-blue-200 dark:text-blue-200 light:text-blue-700 text-lg">
            Production-Ready WordPress with MySQL, MongoDB & Advanced DevOps Automation
          </p>
        </header>
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3">
            {renderMainContent()}
          </div>
          <div className="xl:col-span-1">
            <QuickActions deploymentState={deploymentState} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
