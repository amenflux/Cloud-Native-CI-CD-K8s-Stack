
import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Scale, 
  Terminal,
  GitPullRequest,
  Zap,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export const QuickActions = () => {
  const { toast } = useToast();
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');
  const [showScaleDialog, setShowScaleDialog] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);

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
    const baseClasses = "w-full flex items-center gap-2 p-3 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed";
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

  const simulateDeployment = async () => {
    setDeploymentStatus('deploying');
    toast({
      title: "Deployment Started",
      description: "Deploying WordPress stack with MySQL and MongoDB...",
    });

    // Simulate deployment steps
    const steps = [
      "Creating Kubernetes namespace...",
      "Deploying MySQL database...",
      "Deploying MongoDB...",
      "Setting up Redis cache...",
      "Deploying WordPress...",
      "Configuring Nginx gateway...",
      "Setting up load balancer...",
      "Applying network policies...",
      "Running health checks..."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: `Step ${i + 1}/${steps.length}`,
        description: steps[i],
      });
    }

    setDeploymentStatus('success');
    toast({
      title: "Deployment Complete!",
      description: "WordPress is now accessible at https://your-wordpress.com",
    });

    setTimeout(() => setDeploymentStatus('idle'), 3000);
  };

  const handleAction = async (action: string) => {
    console.log(`Executing action: ${action}`);
    
    switch (action) {
      case 'deploy':
        await simulateDeployment();
        break;
        
      case 'scale':
        setShowScaleDialog(true);
        break;
        
      case 'rollback':
        toast({
          title: "Rollback Initiated",
          description: "Rolling back to previous stable version...",
        });
        setTimeout(() => {
          toast({
            title: "Rollback Complete",
            description: "Successfully rolled back to version 1.2.3",
          });
        }, 3000);
        break;
        
      case 'pipeline':
        toast({
          title: "CI/CD Pipeline Started",
          description: "Building and deploying latest changes from Git...",
        });
        break;
        
      case 'terminal':
        setShowTerminal(true);
        break;
        
      case 'stop':
        toast({
          title: "Emergency Stop",
          description: "Stopping all non-critical services...",
          variant: "destructive"
        });
        break;
        
      case 'autoscale':
        toast({
          title: "Auto-scaling Enabled",
          description: "Services will scale based on CPU and memory usage",
        });
        break;
        
      case 'settings':
        toast({
          title: "Settings",
          description: "Opening system configuration panel...",
        });
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
              const isDeploying = deploymentStatus === 'deploying' && item.action === 'deploy';
              
              return (
                <button
                  key={item.name}
                  onClick={() => handleAction(item.action)}
                  disabled={deploymentStatus === 'deploying'}
                  className={getButtonClasses(item.color)}
                >
                  {isDeploying ? (
                    <Clock className="w-4 h-4 animate-spin" />
                  ) : deploymentStatus === 'success' && item.action === 'deploy' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {isDeploying ? 'Deploying...' : item.name}
                  </span>
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
            <span className="text-slate-300 text-sm">WordPress Status</span>
            <span className="text-green-400 text-sm flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Running
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-sm">Database Health</span>
            <span className="text-green-400 text-sm">MySQL + MongoDB OK</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-sm">Cache Performance</span>
            <span className="text-green-400 text-sm">Redis 98% hit rate</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-sm">External Access</span>
            <span className="text-blue-400 text-sm">https://your-wordpress.com</span>
          </div>
        </div>
      </div>

      {/* Scale Dialog */}
      {showScaleDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-white font-bold mb-4">Scale Services</h3>
            <div className="space-y-4">
              <div>
                <label className="text-slate-300 text-sm">WordPress Replicas</label>
                <input type="number" defaultValue="2" min="1" max="10" 
                       className="w-full mt-1 p-2 bg-slate-700 border border-slate-600 rounded text-white" />
              </div>
              <div>
                <label className="text-slate-300 text-sm">API Replicas</label>
                <input type="number" defaultValue="3" min="1" max="10" 
                       className="w-full mt-1 p-2 bg-slate-700 border border-slate-600 rounded text-white" />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setShowScaleDialog(false);
                    toast({
                      title: "Scaling Applied",
                      description: "Services are being scaled to new replica counts",
                    });
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                >
                  Apply
                </button>
                <button 
                  onClick={() => setShowScaleDialog(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terminal Dialog */}
      {showTerminal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-600 rounded-xl p-6 max-w-4xl w-full h-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">Kubectl Terminal</h3>
              <button 
                onClick={() => setShowTerminal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="bg-black rounded p-4 font-mono text-sm text-green-400 h-full overflow-y-auto">
              <div>$ kubectl get pods</div>
              <div>NAME                          READY   STATUS    RESTARTS   AGE</div>
              <div>wordpress-7d4b8c8f4-abc12     1/1     Running   0          2h</div>
              <div>wordpress-7d4b8c8f4-def34     1/1     Running   0          2h</div>
              <div>mysql-56c8bb9d4-ghi56         1/1     Running   0          2h</div>
              <div>mongodb-84c5b7f8d-jkl78       1/1     Running   0          2h</div>
              <div>redis-5f9d8c6b4-mno90         1/1     Running   0          2h</div>
              <div>nginx-gateway-abc123          1/1     Running   0          2h</div>
              <div className="mt-2">$ <span className="animate-pulse">|</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
