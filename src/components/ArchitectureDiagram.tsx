
import React from 'react';
import { 
  Database, 
  Server, 
  Globe, 
  Shield, 
  GitBranch,
  Container,
  Cloud,
  Cpu,
  Route
} from 'lucide-react';

export const ArchitectureDiagram = () => {
  const components = [
    {
      id: 'frontend',
      name: 'React Dashboard',
      type: 'Frontend',
      icon: Globe,
      status: 'running',
      position: { x: 1, y: 1 }
    },
    {
      id: 'backend',
      name: 'Flask API',
      type: 'Backend',
      icon: Server,
      status: 'running',
      position: { x: 1, y: 2 }
    },
    {
      id: 'mongodb',
      name: 'MongoDB',
      type: 'Database',
      icon: Database,
      status: 'running',
      position: { x: 2, y: 3 }
    },
    {
      id: 'redis',
      name: 'Redis Cache',
      type: 'Cache',
      icon: Cpu,
      status: 'running',
      position: { x: 0, y: 3 }
    },
    {
      id: 'gateway',
      name: 'Nginx Gateway',
      type: 'API Gateway',
      icon: Route,
      status: 'running',
      position: { x: 1, y: 0 }
    },
    {
      id: 'loadbalancer',
      name: 'Load Balancer',
      type: 'Traffic Distribution',
      icon: Shield,
      status: 'running',
      position: { x: 0, y: 0 }
    },
    {
      id: 'proxy',
      name: 'Reverse Proxy',
      type: 'Gateway Component',
      icon: Container,
      status: 'running',
      position: { x: 2, y: 0 }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'error':
        return 'text-red-400 bg-red-400/20 border-red-400/30';
      default:
        return 'text-slate-400 bg-slate-400/20 border-slate-400/30';
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">System Architecture</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-300">All Services Running</span>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <div className="grid grid-cols-3 grid-rows-4 gap-8 min-h-96 mb-16">
          {components.map((component) => {
            const Icon = component.icon;
            return (
              <div
                key={component.id}
                className={`
                  col-start-${component.position.x + 1} 
                  row-start-${component.position.y + 1}
                  ${getStatusColor(component.status)}
                  border-2 rounded-lg p-4 
                  hover:scale-105 transition-all duration-200 cursor-pointer
                  group relative
                `}
              >
                <div className="flex flex-col items-center text-center">
                  <Icon className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold text-sm mb-1">{component.name}</h3>
                  <span className="text-xs opacity-75">{component.type}</span>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 
                               rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        {/* Small arrows pointing to each box */}
        <div className="absolute -top-6 left-0 right-0 flex justify-center md:justify-between px-4">
          <div className="flex-1 flex justify-center">
            <svg width="16" height="16" className="text-blue-400">
              <polygon points="8,2 6,6 10,6" fill="#60a5fa" />
            </svg>
          </div>
          <div className="flex-1 flex justify-center">
            <svg width="16" height="16" className="text-blue-400">
              <polygon points="8,2 6,6 10,6" fill="#60a5fa" />
            </svg>
          </div>
          <div className="flex-1 flex justify-center">
            <svg width="16" height="16" className="text-blue-400">
              <polygon points="8,2 6,6 10,6" fill="#60a5fa" />
            </svg>
          </div>
        </div>
        
        <div className="bg-slate-700/50 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2">Infrastructure</h4>
          <p className="text-sm text-slate-300">Kubernetes cluster with 3 worker nodes</p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2">CI/CD</h4>
          <p className="text-sm text-slate-300">Jenkins pipeline with automated deployment</p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2">Security</h4>
          <p className="text-sm text-slate-300">Network policies and encrypted secrets</p>
        </div>
      </div>
    </div>
  );
};
