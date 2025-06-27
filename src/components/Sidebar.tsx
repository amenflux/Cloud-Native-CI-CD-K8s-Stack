
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
    <aside className="w-80 min-h-screen bg-slate-900/50 backdrop-blur-sm border-r border-slate-700 p-6 flex flex-col">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-xl font-bold text-white">CloudNative Stack</h2>
          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full font-medium">v1.1</span>
        </div>
        <p className="text-slate-400 text-sm">Production WordPress with DevOps</p>
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
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          System Status
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Active Nodes</span>
            <span className="text-green-400 font-mono">{systemStats.nodes}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Running Pods</span>
            <span className="text-green-400 font-mono">{systemStats.pods}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Databases</span>
            <span className="text-blue-400 font-mono text-xs">{systemStats.databases}</span>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <div className="bg-gradient-to-r from-slate-800/40 to-blue-800/20 rounded-lg p-4 text-center border border-slate-700/50 backdrop-blur-sm">
          <div className="animate-pulse">
            <p className="text-slate-400 text-xs mb-1">Built by</p>
            <p className="text-slate-200 text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-fade-in">
              Amen Bouteraa
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
