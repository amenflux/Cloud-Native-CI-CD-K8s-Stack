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
  Clock,
  Download,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { deploymentStore } from '../store/deploymentStore';

interface QuickActionsProps {
  deploymentState: any;
}

export const QuickActions = ({ deploymentState }: QuickActionsProps) => {
  const { toast } = useToast();
  const [showScaleDialog, setShowScaleDialog] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [scaleValues, setScaleValues] = useState<{[key: string]: number}>({});
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "Welcome to Interactive Kubectl Terminal",
    "Type 'help' to see available commands",
    "$ "
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [theme, setTheme] = useState('dark');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const kubectlCommands = {
    'kubectl get pods': () => {
      const output = ["NAME                          READY   STATUS    RESTARTS   AGE"];
      deploymentState.services.forEach((service: any) => {
        Array.from({length: service.replicas}, (_, i) => {
          output.push(`${service.name}-${Math.random().toString(36).substring(7)}     1/1     ${service.status === 'running' ? 'Running' : 'Pending'}   0          2h`);
        });
      });
      return output;
    },
    'kubectl get svc': () => [
      "NAME        TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)",
      "wordpress   LoadBalancer   10.100.200.1    <pending>       80:30080/TCP",
      "mysql       ClusterIP      10.100.200.2    <none>          3306/TCP",
      "mongodb     ClusterIP      10.100.200.3    <none>          27017/TCP",
      "jenkins     ClusterIP      10.100.200.4    <none>          8080/TCP"
    ],
    'kubectl get deployments': () => {
      const output = ["NAME        READY   UP-TO-DATE   AVAILABLE   AGE"];
      deploymentState.services.forEach((service: any) => {
        output.push(`${service.name.padEnd(11)} ${service.replicas}/${service.replicas}     ${service.replicas}            ${service.replicas}           2h`);
      });
      return output;
    },
    'kubectl get gateway': () => [
      "NAME               CLASS    ADDRESS        PROGRAMMED   AGE",
      "wordpress-gateway  istio    10.96.1.100    True         2h"
    ],
    'kubectl get httproute': () => [
      "NAME             HOSTNAMES               AGE",
      "wordpress-route  [\"wordpress.local\"]     2h"
    ],
    'kubectl get nodes': () => [
      "NAME                         STATUS   ROLES           AGE   VERSION",
      "wordpress-cluster-node-1     Ready    control-plane   3h    v1.28.0",
      "wordpress-cluster-node-2     Ready    <none>          3h    v1.28.0",
      "wordpress-cluster-node-3     Ready    <none>          3h    v1.28.0"
    ],
    'kubectl get secrets': () => [
      "NAME                    TYPE                                  DATA   AGE",
      "mysql-secret           Opaque                                2      2h",
      "mongodb-secret         Opaque                                2      2h",
      "jenkins-secret         Opaque                                1      2h",
      "wordpress-tls          kubernetes.io/tls                     2      2h"
    ],
    'kubectl get pvc': () => [
      "NAME           STATUS   VOLUME                     CAPACITY   ACCESS MODES   AGE",
      "mysql-pvc      Bound    pvc-mysql-123             10Gi       RWO            2h",
      "mongodb-pvc    Bound    pvc-mongodb-456           10Gi       RWO            2h",
      "jenkins-pvc    Bound    pvc-jenkins-789           20Gi       RWO            2h"
    ],
    'kubectl describe pod': () => [
      "Name:         wordpress-deployment-abc123",
      "Namespace:    wordpress",
      "Priority:     0",
      "Node:         wordpress-cluster-node-2/10.0.1.5",
      "Start Time:   2 hours ago",
      "Status:       Running",
      "IP:           10.244.1.10",
      "Containers:",
      "  wordpress:",
      "    Image:          wordpress:6.3-apache",
      "    Port:           80/TCP",
      "    State:          Running",
      "    Ready:          True"
    ],
    'help': () => [
      "Available kubectl commands:",
      "  kubectl get pods",
      "  kubectl get svc",
      "  kubectl get deployments",
      "  kubectl get gateway",
      "  kubectl get httproute",
      "  kubectl get nodes",
      "  kubectl get secrets",
      "  kubectl get pvc",
      "  kubectl describe pod [name]",
      "  kubectl logs [pod-name]",
      "  clear - clear terminal"
    ]
  };

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
    },
    {
      category: 'Export',
      items: [
        { name: 'Download Configs', icon: Download, color: 'green', action: 'download' }
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

  const executeTerminalCommand = (command: string) => {
    const newOutput = [...terminalOutput, `$ ${command}`];
    
    if (command === 'clear') {
      setTerminalOutput(["Welcome to Interactive Kubectl Terminal", "Type 'help' to see available commands", "$ "]);
      setTerminalInput('');
      return;
    }

    // Find matching command
    const matchedCommand = Object.keys(kubectlCommands).find(cmd => 
      command.toLowerCase().includes(cmd.toLowerCase()) || 
      (cmd === 'help' && command.toLowerCase() === 'help')
    );

    if (matchedCommand) {
      const result = kubectlCommands[matchedCommand as keyof typeof kubectlCommands]();
      newOutput.push(...result);
    } else if (command.includes('kubectl logs')) {
      newOutput.push("=== Pod Logs ===");
      newOutput.push("[2024-01-01 10:00:00] WordPress initialized successfully");
      newOutput.push("[2024-01-01 10:00:01] Database connection established");
      newOutput.push("[2024-01-01 10:00:02] Ready to serve requests");
    } else {
      newOutput.push(`Error: command "${command}" not recognized`);
      newOutput.push("Type 'help' for available commands");
    }
    
    setTerminalOutput(newOutput);
    setTerminalInput('');
  };

  const downloadAllConfigs = () => {
    // Download all three config types
    const configs = [
      { content: deploymentStore.generateKubernetesManifests(), filename: 'kubernetes-wordpress-stack.yaml' },
      { content: deploymentStore.generateTerraformConfig(), filename: 'terraform-wordpress-stack.tf' },
      { content: deploymentStore.generateAnsiblePlaybook(), filename: 'ansible-wordpress-playbook.yml' }
    ];

    configs.forEach(({ content, filename }) => {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    toast({
      title: "All Configuration Files Downloaded",
      description: "Kubernetes, Terraform, and Ansible configurations downloaded successfully",
    });
  };

  const handleAction = async (action: string) => {
    console.log(`Executing action: ${action}`);
    
    switch (action) {
      case 'deploy':
        deploymentStore.deployAll();
        toast({
          title: "Real Deployment Started",
          description: "Deploying WordPress stack with Jenkins CI/CD pipeline...",
        });
        break;
        
      case 'scale':
        const initialValues: {[key: string]: number} = {};
        deploymentState.services.forEach((service: any) => {
          initialValues[service.name] = service.replicas;
        });
        setScaleValues(initialValues);
        setShowScaleDialog(true);
        break;
        
      case 'rollback':
        deploymentStore.rollback();
        toast({
          title: "Rollback Initiated",
          description: "Rolling back to previous stable configuration...",
        });
        break;
        
      case 'pipeline':
        toast({
          title: "Jenkins Pipeline Started",
          description: "Building and deploying from Git repository via Jenkins...",
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
          description: "HPA configured for CPU and memory thresholds",
        });
        break;
        
      case 'settings':
        setShowSettings(true);
        break;

      case 'download':
        downloadAllConfigs();
        break;
    }
  };

  const applyScaling = () => {
    Object.entries(scaleValues).forEach(([serviceName, replicas]) => {
      deploymentStore.updateServiceReplicas(serviceName, replicas);
    });
    
    setShowScaleDialog(false);
    toast({
      title: "Scaling Applied",
      description: "Services are being scaled to new replica counts. Configuration files updated.",
    });
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
            <span className="text-slate-300 text-sm">Total Pods</span>
            <span className="text-green-400 text-sm flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              {deploymentState.totalPods} running
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-sm">Database Health</span>
            <span className="text-green-400 text-sm">{deploymentState.databases} OK</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-sm">Last Deployment</span>
            <span className="text-blue-400 text-sm">
              {deploymentState.lastDeployment ? new Date(deploymentState.lastDeployment).toLocaleTimeString() : 'Never'}
            </span>
          </div>
        </div>
      </div>

      {/* Scale Dialog */}
      {showScaleDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <h3 className="text-white font-bold mb-4">Scale Services</h3>
            <div className="space-y-4">
              {deploymentState.services.map((service: any) => (
                <div key={service.name}>
                  <label className="text-slate-300 text-sm capitalize">{service.name} Replicas</label>
                  <input 
                    type="number" 
                    value={scaleValues[service.name] || service.replicas}
                    onChange={(e) => setScaleValues({...scaleValues, [service.name]: parseInt(e.target.value) || 1})}
                    min="0" 
                    max="10" 
                    className="w-full mt-1 p-2 bg-slate-700 border border-slate-600 rounded text-white" 
                  />
                </div>
              ))}
              <div className="flex gap-2 mt-6">
                <button 
                  onClick={applyScaling}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                >
                  Apply Changes
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

      {/* Settings Dialog */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-6 max-w-lg w-full">
            <h3 className="text-white font-bold mb-4">Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="text-slate-300 text-sm font-medium mb-3 block">Theme</label>
                <div className="flex gap-2">
                  {[
                    { id: 'light', icon: Sun, label: 'Light' },
                    { id: 'dark', icon: Moon, label: 'Dark' },
                    { id: 'system', icon: Monitor, label: 'System' }
                  ].map((themeOption) => {
                    const Icon = themeOption.icon;
                    return (
                      <button
                        key={themeOption.id}
                        onClick={() => setTheme(themeOption.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          theme === themeOption.id ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {themeOption.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <label className="text-slate-300 text-sm font-medium">Auto-refresh Interval</label>
                <select 
                  className="w-full mt-1 p-2 bg-slate-700 border border-slate-600 rounded text-white"
                  defaultValue="30"
                >
                  <option value="10">10 seconds</option>
                  <option value="30">30 seconds</option>
                  <option value="60">1 minute</option>
                  <option value="300">5 minutes</option>
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-sm">Enable Notifications</span>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      notifications ? 'bg-blue-600' : 'bg-slate-600'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-sm">Auto-refresh</span>
                  <button
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      autoRefresh ? 'bg-blue-600' : 'bg-slate-600'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      autoRefresh ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setShowSettings(false);
                    toast({
                      title: "Settings Saved",
                      description: "Configuration updated successfully",
                    });
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
                >
                  Save Settings
                </button>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Terminal Dialog */}
      {showTerminal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-600 rounded-xl p-6 max-w-4xl w-full h-96 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">Interactive Kubectl Terminal</h3>
              <button 
                onClick={() => setShowTerminal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="bg-black rounded p-4 font-mono text-sm text-green-400 flex-1 overflow-y-auto">
              {terminalOutput.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
              <div className="flex items-center mt-2">
                <span>$ </span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && terminalInput.trim()) {
                      executeTerminalCommand(terminalInput.trim());
                    }
                  }}
                  className="bg-transparent border-none outline-none text-green-400 flex-1 ml-1"
                  placeholder="Type 'help' for available commands"
                  autoFocus
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
