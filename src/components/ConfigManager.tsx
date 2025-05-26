
import React, { useState } from 'react';
import { 
  FileCode2, 
  Download, 
  Copy, 
  GitBranch,
  RefreshCw,
  Settings,
  Check,
  Github
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { deploymentStore } from '../store/deploymentStore';

interface ConfigManagerProps {
  deploymentState: any;
}

export const ConfigManager = ({ deploymentState }: ConfigManagerProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('kubernetes');
  const [copied, setCopied] = useState(false);
  const [showGithubConnect, setShowGithubConnect] = useState(false);

  const configTypes = [
    { id: 'kubernetes', name: 'Kubernetes', icon: FileCode2, extension: 'yaml' },
    { id: 'terraform', name: 'Terraform', icon: Settings, extension: 'tf' },
    { id: 'ansible', name: 'Ansible', icon: RefreshCw, extension: 'yml' }
  ];

  const getConfigContent = (type: string) => {
    switch (type) {
      case 'kubernetes':
        return deploymentStore.generateKubernetesManifests();
      case 'terraform':
        return deploymentStore.generateTerraformConfig();
      case 'ansible':
        return deploymentStore.generateAnsiblePlaybook();
      default:
        return '# Configuration not found';
    }
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Configuration copied successfully",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const downloadConfig = (type: string) => {
    const content = getConfigContent(type);
    const extension = configTypes.find(t => t.id === type)?.extension || 'txt';
    const filename = `${type}-wordpress-stack.${extension}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download started",
      description: `${filename} downloaded successfully`,
    });
  };

  const handleCommit = () => {
    setShowGithubConnect(true);
  };

  const connectGithub = () => {
    // Simulate GitHub OAuth flow
    toast({
      title: "GitHub Integration",
      description: "Redirecting to GitHub for authentication...",
    });
    
    setTimeout(() => {
      setShowGithubConnect(false);
      toast({
        title: "GitHub Connected",
        description: "Repository synced successfully",
      });
    }, 2000);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Configuration Manager</h2>
        <div className="flex gap-2">
          <button
            onClick={() => downloadConfig(activeTab)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={handleCommit}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <GitBranch className="w-4 h-4" />
            Commit
          </button>
        </div>
      </div>

      {/* Config Type Tabs */}
      <div className="flex space-x-1 mb-6 bg-slate-700/50 p-1 rounded-lg">
        {configTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => setActiveTab(type.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeTab === type.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              {type.name}
            </button>
          );
        })}
      </div>

      {/* Configuration Content */}
      <div className="relative">
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={() => copyToClipboard(getConfigContent(activeTab))}
            className="flex items-center gap-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-6 overflow-auto max-h-96 border border-slate-600">
          <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
            {getConfigContent(activeTab)}
          </pre>
        </div>
      </div>

      {/* Configuration Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="text-slate-300 text-sm">Total Services</div>
          <div className="text-white text-xl font-bold">{deploymentState.services.length}</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="text-slate-300 text-sm">Total Replicas</div>
          <div className="text-white text-xl font-bold">{deploymentState.totalPods}</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="text-slate-300 text-sm">Active Nodes</div>
          <div className="text-white text-xl font-bold">{deploymentState.nodes}</div>
        </div>
      </div>

      {/* GitHub Connect Dialog */}
      {showGithubConnect && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <Github className="w-6 h-6 text-white" />
              <h3 className="text-white font-bold">Connect to GitHub</h3>
            </div>
            <p className="text-slate-300 mb-6">
              Connect your GitHub account to sync configurations and enable automated deployments.
            </p>
            <div className="flex gap-2">
              <button 
                onClick={connectGithub}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded flex items-center justify-center gap-2"
              >
                <Github className="w-4 h-4" />
                Connect GitHub
              </button>
              <button 
                onClick={() => setShowGithubConnect(false)}
                className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
