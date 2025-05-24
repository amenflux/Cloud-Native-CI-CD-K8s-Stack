
import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle,
  Activity,
  Cpu,
  MemoryStick,
  HardDrive
} from 'lucide-react';

export const DeploymentStatus = () => {
  const deployments = [
    {
      name: 'frontend-dashboard',
      status: 'running',
      replicas: { desired: 2, ready: 2, available: 2 },
      image: 'cloudnative/react-dashboard:latest',
      lastUpdate: '2 minutes ago'
    },
    {
      name: 'backend-api',
      status: 'running',
      replicas: { desired: 3, ready: 3, available: 3 },
      image: 'cloudnative/flask-api:latest',
      lastUpdate: '5 minutes ago'
    },
    {
      name: 'mongodb',
      status: 'running',
      replicas: { desired: 1, ready: 1, available: 1 },
      image: 'mongo:6.0',
      lastUpdate: '1 hour ago'
    },
    {
      name: 'redis',
      status: 'running',
      replicas: { desired: 1, ready: 1, available: 1 },
      image: 'redis:7-alpine',
      lastUpdate: '1 hour ago'
    },
    {
      name: 'nginx-ingress',
      status: 'pending',
      replicas: { desired: 2, ready: 1, available: 1 },
      image: 'nginx/nginx-ingress:latest',
      lastUpdate: '30 seconds ago'
    }
  ];

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

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Deployment Status</h2>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-400" />
          <span className="text-sm text-slate-300">Live Updates</span>
        </div>
      </div>

      {/* Cluster Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            <span className="text-white font-semibold">CPU Usage</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">47%</div>
          <div className="text-sm text-slate-400">3.2/6.8 cores</div>
        </div>
        
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <MemoryStick className="w-5 h-5 text-purple-400" />
            <span className="text-white font-semibold">Memory</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">62%</div>
          <div className="text-sm text-slate-400">5.1/8.2 GB</div>
        </div>
        
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive className="w-5 h-5 text-green-400" />
            <span className="text-white font-semibold">Storage</span>
          </div>
          <div className="text-2xl font-bold text-green-400">23%</div>
          <div className="text-sm text-slate-400">45/200 GB</div>
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
              <th className="text-left py-3 px-4 text-slate-300 font-medium">Last Update</th>
            </tr>
          </thead>
          <tbody>
            {deployments.map((deployment) => (
              <tr key={deployment.name} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(deployment.status)}
                    <span className="text-white font-medium">{deployment.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={getStatusBadge(deployment.status)}>
                    {deployment.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-slate-300">
                    {deployment.replicas.ready}/{deployment.replicas.desired}
                  </span>
                  {deployment.replicas.ready !== deployment.replicas.desired && (
                    <span className="ml-2 text-yellow-400 text-sm">
                      (scaling)
                    </span>
                  )}
                </td>
                <td className="py-4 px-4">
                  <span className="text-slate-400 font-mono text-sm">
                    {deployment.image}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-slate-400 text-sm">
                    {deployment.lastUpdate}
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
