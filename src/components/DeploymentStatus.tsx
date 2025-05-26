
import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle,
  Activity,
  Cpu,
  MemoryStick,
  HardDrive,
  ExternalLink,
  Database,
  Globe
} from 'lucide-react';

interface DeploymentStatusProps {
  deploymentState: any;
}

export const DeploymentStatus = ({ deploymentState }: DeploymentStatusProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'running':
        return `${baseClasses} bg-green-400/20 text-green-400`;
      case 'pending':
        return `${baseClasses} bg-yellow-400/20 text-yellow-400`;
      case 'error':
        return `${baseClasses} bg-red-400/20 text-red-400`;
      default:
        return `${baseClasses} bg-slate-400/20 text-slate-400`;
    }
  };

  const openUrl = (url: string) => {
    if (url.startsWith('http')) {
      window.open(url, '_blank');
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  const getServiceUrl = (serviceName: string) => {
    const urlMap: {[key: string]: string} = {
      'wordpress': 'https://your-wordpress.com',
      'mysql': 'mysql://mysql-service:3306',
      'mongodb': 'mongodb://mongodb-service:27017',
      'redis-cache': 'redis://redis-service:6379',
      'flask-api': 'https://api.your-wordpress.com',
      'nginx-gateway': 'https://your-wordpress.com'
    };
    return urlMap[serviceName] || '#';
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">WordPress Stack Status</h2>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-400" />
          <span className="text-sm text-slate-300">Live Updates</span>
        </div>
      </div>

      {/* Cluster Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            <span className="text-white font-semibold">Active Nodes</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{deploymentState.nodes}</div>
          <div className="text-sm text-slate-400">Kubernetes nodes</div>
        </div>
        
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <MemoryStick className="w-5 h-5 text-purple-400" />
            <span className="text-white font-semibold">Total Pods</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">{deploymentState.totalPods}</div>
          <div className="text-sm text-slate-400">Running containers</div>
        </div>
        
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive className="w-5 h-5 text-green-400" />
            <span className="text-white font-semibold">Services</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{deploymentState.services.length}</div>
          <div className="text-sm text-slate-400">Active services</div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-orange-400" />
            <span className="text-white font-semibold">Databases</span>
          </div>
          <div className="text-2xl font-bold text-orange-400">2</div>
          <div className="text-sm text-slate-400">{deploymentState.databases}</div>
        </div>
      </div>

      {/* Quick Access Links */}
      <div className="mb-6 p-4 bg-slate-700/30 rounded-lg">
        <h3 className="text-white font-semibold mb-3">Quick Access</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button 
            onClick={() => openUrl('https://your-wordpress.com')}
            className="flex items-center gap-2 p-2 bg-blue-600/20 border border-blue-600/30 rounded text-blue-400 hover:bg-blue-600/30 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm">WordPress Site</span>
            <ExternalLink className="w-3 h-3" />
          </button>
          <button 
            onClick={() => openUrl('https://your-wordpress.com/wp-admin')}
            className="flex items-center gap-2 p-2 bg-purple-600/20 border border-purple-600/30 rounded text-purple-400 hover:bg-purple-600/30 transition-colors"
          >
            <Database className="w-4 h-4" />
            <span className="text-sm">WP Admin</span>
            <ExternalLink className="w-3 h-3" />
          </button>
          <button 
            onClick={() => openUrl('https://api.your-wordpress.com')}
            className="flex items-center gap-2 p-2 bg-green-600/20 border border-green-600/30 rounded text-green-400 hover:bg-green-600/30 transition-colors"
          >
            <Database className="w-4 h-4" />
            <span className="text-sm">API Docs</span>
            <ExternalLink className="w-3 h-3" />
          </button>
          <button 
            onClick={() => openUrl('https://grafana.your-wordpress.com')}
            className="flex items-center gap-2 p-2 bg-orange-600/20 border border-orange-600/30 rounded text-orange-400 hover:bg-orange-600/30 transition-colors"
          >
            <Activity className="w-4 h-4" />
            <span className="text-sm">Monitoring</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Deployments Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-slate-300 font-medium">Service</th>
              <th className="text-left py-3 px-4 text-slate-300 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-slate-300 font-medium">Replicas</th>
              <th className="text-left py-3 px-4 text-slate-300 font-medium">Image</th>
              <th className="text-left py-3 px-4 text-slate-300 font-medium">Access</th>
              <th className="text-left py-3 px-4 text-slate-300 font-medium">Last Update</th>
            </tr>
          </thead>
          <tbody>
            {deploymentState.services.map((service: any) => (
              <tr key={service.name} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <span className="text-white font-medium">{service.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={getStatusBadge(service.status)}>
                    {service.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-slate-300">
                    {service.replicas}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-slate-400 font-mono text-sm">
                    {service.image}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => openUrl(getServiceUrl(service.name))}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
                  >
                    {getServiceUrl(service.name).startsWith('http') ? (
                      <>
                        <ExternalLink className="w-3 h-3" />
                        Open
                      </>
                    ) : (
                      <>
                        <Database className="w-3 h-3" />
                        Connect
                      </>
                    )}
                  </button>
                </td>
                <td className="py-4 px-4">
                  <span className="text-slate-400 text-sm">
                    {service.lastUpdate}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
