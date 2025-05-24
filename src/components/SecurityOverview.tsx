
import React from 'react';
import { 
  Shield, 
  Key, 
  Lock, 
  Network, 
  AlertTriangle,
  CheckCircle,
  Eye,
  FileText
} from 'lucide-react';

export const SecurityOverview = () => {
  const securityMetrics = [
    {
      category: 'Secrets Management',
      icon: Key,
      status: 'secure',
      items: [
        { name: 'Database Passwords', status: 'encrypted', details: 'Stored in Kubernetes Secrets' },
        { name: 'API Keys', status: 'encrypted', details: 'Managed via Terraform Cloud' },
        { name: 'TLS Certificates', status: 'active', details: 'Auto-renewal enabled' }
      ]
    },
    {
      category: 'Network Security',
      icon: Network,
      status: 'secure',
      items: [
        { name: 'Network Policies', status: 'active', details: '5 policies enforced' },
        { name: 'Ingress TLS', status: 'active', details: 'HTTPS termination' },
        { name: 'Pod Security', status: 'active', details: 'Non-root containers' }
      ]
    },
    {
      category: 'Access Control',
      icon: Lock,
      status: 'warning',
      items: [
        { name: 'RBAC Policies', status: 'active', details: 'Least privilege access' },
        { name: 'Service Accounts', status: 'active', details: 'Dedicated accounts per service' },
        { name: 'Admin Access', status: 'warning', details: 'Review required' }
      ]
    }
  ];

  const vulnerabilities = [
    {
      severity: 'medium',
      title: 'Outdated nginx-ingress image',
      description: 'Consider updating to latest version for security patches',
      affected: 'nginx-ingress-controller'
    },
    {
      severity: 'low',
      title: 'Missing resource limits',
      description: 'Some containers lack CPU/memory limits',
      affected: 'mongodb deployment'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secure':
      case 'active':
      case 'encrypted':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-400/20 text-red-400 border-red-400/30';
      case 'medium':
        return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30';
      case 'low':
        return 'bg-blue-400/20 text-blue-400 border-blue-400/30';
      default:
        return 'bg-slate-400/20 text-slate-400 border-slate-400/30';
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Security Overview</h2>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-400" />
          <span className="text-sm text-slate-300">Security Score: 87/100</span>
        </div>
      </div>

      {/* Security Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {securityMetrics.map((category) => {
          const Icon = category.icon;
          return (
            <div key={category.category} className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-4">
                <Icon className={`w-6 h-6 ${getStatusColor(category.status)}`} />
                <h3 className="text-white font-semibold">{category.category}</h3>
                <CheckCircle className={`w-4 h-4 ml-auto ${getStatusColor(category.status)}`} />
              </div>
              
              <div className="space-y-2">
                {category.items.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-slate-300">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.details}</div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      item.status === 'active' || item.status === 'encrypted' ? 'bg-green-400' :
                      item.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                    }`} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Security Policies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-700/50 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Active Policies
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Network Policies</span>
              <span className="text-green-400">5 active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Pod Security Policies</span>
              <span className="text-green-400">3 active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">RBAC Rules</span>
              <span className="text-green-400">12 active</span>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-700/50 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-400" />
            Monitoring
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Failed Login Attempts</span>
              <span className="text-green-400">0 today</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Suspicious Activity</span>
              <span className="text-green-400">None detected</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Security Scans</span>
              <span className="text-blue-400">Last: 2h ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vulnerabilities */}
      <div>
        <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          Security Issues
        </h4>
        
        {vulnerabilities.length > 0 ? (
          <div className="space-y-3">
            {vulnerabilities.map((vuln, index) => (
              <div key={index} className="bg-slate-700/50 rounded-lg p-4 border-l-4 border-yellow-400">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(vuln.severity)}`}>
                        {vuln.severity.toUpperCase()}
                      </span>
                      <span className="text-white font-medium">{vuln.title}</span>
                    </div>
                    <p className="text-slate-300 text-sm mb-1">{vuln.description}</p>
                    <p className="text-slate-500 text-xs">Affected: {vuln.affected}</p>
                  </div>
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded">
                    Fix
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-700/50 rounded-lg p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-slate-300">No security issues detected</p>
          </div>
        )}
      </div>
    </div>
  );
};
