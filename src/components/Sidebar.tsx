
import React from 'react';
import { 
  BarChart3, 
  Settings, 
  Shield, 
  Layers,
  FileCode2,
  BookOpen,
  Server,
  Users,
  Activity,
  Wrench
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  systemStats: {
    nodes: number;
    pods: number;
    databases: string;
  };
}

export const Sidebar = ({ activeView, setActiveView, systemStats }: SidebarProps) => {
  const menuItems = [
    { id: 'architecture', label: 'Architecture', icon: Layers },
    { id: 'deployments', label: 'Deployments', icon: Server },
    { id: 'configs', label: 'Configurations', icon: FileCode2 },
    { id: 'jenkins', label: 'Jenkins', icon: Wrench },
    { id: 'deployment-guide', label: 'Deploy Guide', icon: BookOpen },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <aside className="w-80 min-h-screen bg-slate-900/50 dark:bg-slate-900/50 light:bg-white/90 backdrop-blur-sm border-r border-slate-700 dark:border-slate-700 light:border-slate-200 p-6 flex flex-col">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-xl font-bold text-white dark:text-white light:text-slate-900">CloudNative Stack</h2>
          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full font-medium">v1.1</span>
        </div>
        <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-sm">Production WordPress with DevOps</p>
      </div>

      <nav className="space-y-2 mb-8 mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeView === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="bg-slate-800/50 dark:bg-slate-800/50 light:bg-slate-100/80 rounded-lg p-4 mb-6">
        <h3 className="text-white dark:text-white light:text-slate-900 font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          System Status
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-sm">Active Nodes</span>
            <span className="text-green-400 font-mono">{systemStats.nodes}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-sm">Running Pods</span>
            <span className="text-green-400 font-mono">{systemStats.pods}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-sm">Databases</span>
            <span className="text-blue-400 font-mono text-xs">{systemStats.databases}</span>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <div className="bg-gradient-to-r from-slate-800/40 to-blue-800/20 dark:from-slate-800/40 dark:to-blue-800/20 light:from-slate-200/60 light:to-blue-200/40 rounded-lg p-4 text-center border border-slate-700/50 dark:border-slate-700/50 light:border-slate-300/50 backdrop-blur-sm">
          <div className="animate-pulse">
            <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-xs mb-1">Built by</p>
            <p className="text-slate-200 dark:text-slate-200 light:text-slate-800 text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-fade-in">
              Amen Bouteraa
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
