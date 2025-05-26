
import React from 'react';
import { 
  Network, 
  FileCode2, 
  Rocket, 
  Shield, 
  Server,
  Database,
  Cloud,
  Terminal
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Sidebar = ({ activeView, setActiveView }: SidebarProps) => {
  const menuItems = [
    { id: 'architecture', label: 'Architecture', icon: Network },
    { id: 'configs', label: 'Config Files', icon: FileCode2 },
    { id: 'deployments', label: 'Deployments', icon: Rocket },
    { id: 'deployment-guide', label: 'Deploy Guide', icon: Terminal },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="w-64 bg-slate-800/90 backdrop-blur-sm border-r border-slate-700 min-h-screen">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold">WordPress Stack</h2>
            <p className="text-slate-400 text-sm">v2.0.0</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeView === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
        
        <div className="mt-12 p-4 bg-slate-700/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Server className="w-4 h-4 text-green-400" />
            <span className="text-sm text-slate-300">WordPress Status</span>
          </div>
          <div className="text-green-400 text-sm font-mono">
            ● 3 nodes active
          </div>
          <div className="text-blue-400 text-sm font-mono">
            ● 8 pods running
          </div>
          <div className="text-purple-400 text-sm font-mono">
            ● MySQL + MongoDB
          </div>
        </div>
      </div>
    </div>
  );
};
