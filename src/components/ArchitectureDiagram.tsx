
import React, { useState } from 'react';
import { 
  Database, 
  Server, 
  Globe, 
  Shield, 
  GitBranch,
  Container,
  Cloud,
  Cpu,
  Route,
  X,
  Code,
  Settings,
  Activity
} from 'lucide-react';

interface ComponentDetails {
  id: string;
  name: string;
  description: string;
  status: string;
  specs: {
    replicas: number;
    memory: string;
    cpu: string;
    storage?: string;
  };
  endpoints?: string[];
  logs?: string[];
}

export const ArchitectureDiagram = () => {
  const [selectedComponent, setSelectedComponent] = useState<ComponentDetails | null>(null);

  const components = [
    {
      id: 'frontend',
      name: 'WordPress Frontend',
      type: 'Application',
      icon: Globe,
      status: 'running',
      position: { x: 1, y: 1 },
      details: {
        id: 'frontend',
        name: 'WordPress Frontend',
        description: 'WordPress 6.3 running with PHP 8.1 and Apache. Handles web requests and serves the WordPress application.',
        status: 'running',
        specs: {
          replicas: 2,
          memory: '512Mi',
          cpu: '250m',
          storage: '10Gi'
        },
        endpoints: ['https://your-wordpress.com', 'http://localhost:8080'],
        logs: [
          '[2024-01-15 10:30:15] WordPress loaded successfully',
          '[2024-01-15 10:30:16] Connected to MySQL database',
          '[2024-01-15 10:30:17] Redis cache initialized',
          '[2024-01-15 10:30:18] Ready to serve requests'
        ]
      }
    },
    {
      id: 'backend',
      name: 'Flask API',
      type: 'Backend Service',
      icon: Server,
      status: 'running',
      position: { x: 1, y: 2 },
      details: {
        id: 'backend',
        name: 'Flask API Service',
        description: 'Flask REST API providing custom endpoints for WordPress integration, user management, and analytics.',
        status: 'running',
        specs: {
          replicas: 3,
          memory: '256Mi',
          cpu: '200m'
        },
        endpoints: ['https://api.your-wordpress.com/v1', 'http://localhost:5000'],
        logs: [
          '[2024-01-15 10:30:20] Flask application started',
          '[2024-01-15 10:30:21] Connected to MongoDB',
          '[2024-01-15 10:30:22] API routes registered',
          '[2024-01-15 10:30:23] Health check endpoint active'
        ]
      }
    },
    {
      id: 'mysql',
      name: 'MySQL Database',
      type: 'Primary Database',
      icon: Database,
      status: 'running',
      position: { x: 2, y: 3 },
      details: {
        id: 'mysql',
        name: 'MySQL 8.0 Database',
        description: 'Primary database for WordPress. Stores posts, pages, users, and all WordPress core data.',
        status: 'running',
        specs: {
          replicas: 1,
          memory: '1Gi',
          cpu: '500m',
          storage: '50Gi'
        },
        endpoints: ['mysql://mysql-service:3306'],
        logs: [
          '[2024-01-15 10:30:10] MySQL server started',
          '[2024-01-15 10:30:11] WordPress database initialized',
          '[2024-01-15 10:30:12] User tables created',
          '[2024-01-15 10:30:13] Ready for connections'
        ]
      }
    },
    {
      id: 'mongodb',
      name: 'MongoDB',
      type: 'Analytics Database',
      icon: Database,
      status: 'running',
      position: { x: 0, y: 3 },
      details: {
        id: 'mongodb',
        name: 'MongoDB Analytics Store',
        description: 'Secondary database for analytics, user behavior tracking, and custom application data.',
        status: 'running',
        specs: {
          replicas: 1,
          memory: '768Mi',
          cpu: '300m',
          storage: '30Gi'
        },
        endpoints: ['mongodb://mongodb-service:27017'],
        logs: [
          '[2024-01-15 10:30:25] MongoDB server started',
          '[2024-01-15 10:30:26] Analytics collections initialized',
          '[2024-01-15 10:30:27] Indexes created',
          '[2024-01-15 10:30:28] Ready for connections'
        ]
      }
    },
    {
      id: 'redis',
      name: 'Redis Cache',
      type: 'Cache Layer',
      icon: Cpu,
      status: 'running',
      position: { x: 1, y: 3 },
      details: {
        id: 'redis',
        name: 'Redis Cache Layer',
        description: 'High-performance caching layer for WordPress. Caches database queries, sessions, and page fragments.',
        status: 'running',
        specs: {
          replicas: 1,
          memory: '256Mi',
          cpu: '100m'
        },
        endpoints: ['redis://redis-service:6379'],
        logs: [
          '[2024-01-15 10:30:30] Redis server started',
          '[2024-01-15 10:30:31] Memory allocated',
          '[2024-01-15 10:30:32] Cache warming initiated',
          '[2024-01-15 10:30:33] Ready for caching'
        ]
      }
    },
    {
      id: 'gateway',
      name: 'Nginx Gateway',
      type: 'API Gateway',
      icon: Route,
      status: 'running',
      position: { x: 1, y: 0 },
      details: {
        id: 'gateway',
        name: 'Nginx API Gateway',
        description: 'Main entry point handling SSL termination, routing, and load balancing for all services.',
        status: 'running',
        specs: {
          replicas: 2,
          memory: '128Mi',
          cpu: '100m'
        },
        endpoints: ['https://your-wordpress.com', 'http://localhost:80'],
        logs: [
          '[2024-01-15 10:30:05] Nginx gateway started',
          '[2024-01-15 10:30:06] SSL certificates loaded',
          '[2024-01-15 10:30:07] Upstream servers configured',
          '[2024-01-15 10:30:08] Ready to route traffic'
        ]
      }
    },
    {
      id: 'loadbalancer',
      name: 'Load Balancer',
      type: 'Traffic Distribution',
      icon: Shield,
      status: 'running',
      position: { x: 0, y: 0 },
      details: {
        id: 'loadbalancer',
        name: 'AWS Application Load Balancer',
        description: 'Distributes incoming traffic across multiple WordPress instances for high availability.',
        status: 'running',
        specs: {
          replicas: 1,
          memory: 'Managed',
          cpu: 'Managed'
        },
        endpoints: ['ALB-wordpress-123456789.us-west-2.elb.amazonaws.com'],
        logs: [
          '[2024-01-15 10:30:01] Load balancer active',
          '[2024-01-15 10:30:02] Health checks configured',
          '[2024-01-15 10:30:03] Target groups registered',
          '[2024-01-15 10:30:04] Traffic routing enabled'
        ]
      }
    },
    {
      id: 'proxy',
      name: 'Reverse Proxy',
      type: 'Gateway Component',
      icon: Container,
      status: 'running',
      position: { x: 2, y: 0 },
      details: {
        id: 'proxy',
        name: 'Nginx Reverse Proxy',
        description: 'Handles request forwarding, compression, and security headers for enhanced performance.',
        status: 'running',
        specs: {
          replicas: 1,
          memory: '64Mi',
          cpu: '50m'
        },
        endpoints: ['Internal proxy service'],
        logs: [
          '[2024-01-15 10:30:35] Reverse proxy started',
          '[2024-01-15 10:30:36] Compression enabled',
          '[2024-01-15 10:30:37] Security headers configured',
          '[2024-01-15 10:30:38] Proxy rules loaded'
        ]
      }
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

  const handleComponentClick = (component: any) => {
    setSelectedComponent(component.details);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">WordPress Infrastructure</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-300">WordPress Stack Running</span>
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
                onClick={() => handleComponentClick(component)}
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
          <p className="text-sm text-slate-300">AWS EKS cluster with persistent volumes</p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2">CI/CD</h4>
          <p className="text-sm text-slate-300">Automated WordPress & API deployment</p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2">Security</h4>
          <p className="text-sm text-slate-300">SSL termination and network policies</p>
        </div>
      </div>

      {/* Component Details Modal */}
      {selectedComponent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-600 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-600">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${selectedComponent.status === 'running' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <h3 className="text-xl font-bold text-white">{selectedComponent.name}</h3>
              </div>
              <button
                onClick={() => setSelectedComponent(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-white font-semibold mb-2">Description</h4>
                <p className="text-slate-300">{selectedComponent.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">Specifications</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Replicas:</span>
                      <span className="text-slate-300">{selectedComponent.specs.replicas}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Memory:</span>
                      <span className="text-slate-300">{selectedComponent.specs.memory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">CPU:</span>
                      <span className="text-slate-300">{selectedComponent.specs.cpu}</span>
                    </div>
                    {selectedComponent.specs.storage && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Storage:</span>
                        <span className="text-slate-300">{selectedComponent.specs.storage}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-semibold mb-2">Endpoints</h4>
                  <div className="space-y-1">
                    {selectedComponent.endpoints?.map((endpoint, index) => (
                      <div key={index} className="text-sm text-blue-400 font-mono break-all">
                        {endpoint}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-2">Recent Logs</h4>
                <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm">
                  {selectedComponent.logs?.map((log, index) => (
                    <div key={index} className="text-green-400 mb-1">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
