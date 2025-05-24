
import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Scale, 
  Terminal,
  GitPullRequest,
  Zap,
  Settings
} from 'lucide-react';

export const QuickActions = () => {
  const actions = [
    {
      category: 'Deployment',
      items: [
        { name: 'Deploy All', icon: Play, color: 'green', action: 'deploy' },
        { name: 'Scale Services', icon: Scale, color: 'blue', action: 'scale' },
        { name: 'Rollback', icon: RotateCcw, color: 'yellow', action: 'rollback' }
      ]
    },
    {
      category: 'Operations',
      items: [
        { name: 'Run Pipeline', icon: GitPullRequest, color: 'purple', action: 'pipeline' },
        { name: 'Open Terminal', icon: Terminal, color: 'slate', action: 'terminal' },
        { name: 'Emergency Stop', icon: Pause, color: 'red', action: 'stop' }
      ]
    },
    {
      category: 'Management',
      items: [
        { name: 'Auto-Scale', icon: Zap, color: 'orange', action: 'autoscale' },
        { name: 'Settings', icon: Settings, color: 'slate', action: 'settings' }
      ]
    }
  ];

  const getButtonClasses = (color: string) => {
    const baseClasses = "w-full flex items-center gap-2 p-3 rounded-lg transition-all hover:scale-105";
    switch (color) {
      case 'green':
        return `${baseClasses} bg-green-600 hover:bg-green-700 text-white`;
      case 'blue':
        return `${baseClasses} bg-blue-600 hover:bg-blue-700 text-white`;
      case 'yellow':
        return `${baseClasses} bg-yellow-600 hover:bg-yellow-700 text-white`;
      case 'purple':
        return `${baseClasses} bg-purple-600 hover:bg-purple-700 text-white`;
      case 'red':
        return `${baseClasses} bg-red-600 hover:bg-red-700 text-white`;
      case 'orange':
        return `${baseClasses} bg-orange-600 hover:bg-orange-700 text-white`;
      default:
        return `${baseClasses} bg-slate-600 hover:bg-slate-700 text-white`;
    }
  };

  const handleAction = (action: string) => {
    console.log(`Executing action: ${action}`);
    // In a real app, these would trigger actual operations
    switch (action) {
      case 'deploy':
        console.log('Deploying all services...');
        break;
      case 'scale':
        console.log('Opening scale dialog...');
        break;
      case 'rollback':
        console.log('Rolling back to previous version...');
        break;
      case 'pipeline':
        console.log('Triggering CI/CD pipeline...');
        break;
      case 'terminal':
        console.log('Opening kubectl terminal...');
        break;
      case 'stop':
        console.log('Emergency stop initiated...');
        break;
      case 'autoscale':
        console.log('Configuring auto-scaling...');
        break;
      case 'settings':
        console.log('Opening settings...');
        break;
    }
  };

  return (
    <div className="space-y-6">
      {actions.map((category) => (
        <div key={category.category} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
          <h3 className="text-white font-semibold mb-4">{category.category}</h3>
          <div className="space-y-3">
            {category.items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => handleAction(item.action)}
                  className={getButtonClasses(item.color)}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      
      {/* System Status */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
        <h3 className="text-white font-semibold mb-4">System Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-sm">Last Deployment</span>
            <span className="text-green-400 text-sm">5m ago</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-sm">Health Check</span>
            <span className="text-green-400 text-sm">Passing</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-sm">Active Alerts</span>
            <span className="text-yellow-400 text-sm">2 warnings</span>
          </div>
        </div>
      </div>
    </div>
  );
};
