
import React, { useState } from 'react';
import { 
  Terminal, 
  Copy, 
  CheckCircle, 
  ExternalLink,
  Database,
  Globe,
  Settings,
  Shield
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export const WordPressDeploymentGuide = () => {
  const { toast } = useToast();
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const deploymentSteps = [
    {
      title: "1. Deploy MySQL Database",
      description: "Set up the primary database for WordPress",
      commands: [
        "kubectl create secret generic mysql-secret --from-literal=root-password=your-root-password --from-literal=username=wordpress --from-literal=password=your-wp-password",
        "kubectl apply -f kubernetes/mysql-deployment.yaml",
        "kubectl apply -f kubernetes/mysql-service.yaml"
      ]
    },
    {
      title: "2. Deploy MongoDB for Analytics",
      description: "Secondary database for custom analytics and API data",
      commands: [
        "kubectl create secret generic mongodb-secret --from-literal=username=admin --from-literal=password=your-mongo-password",
        "kubectl apply -f kubernetes/mongodb-deployment.yaml",
        "kubectl apply -f kubernetes/mongodb-service.yaml"
      ]
    },
    {
      title: "3. Deploy Redis Cache",
      description: "High-performance caching layer for WordPress",
      commands: [
        "kubectl apply -f kubernetes/redis-deployment.yaml",
        "kubectl apply -f kubernetes/redis-service.yaml"
      ]
    },
    {
      title: "4. Deploy WordPress Application",
      description: "Main WordPress application with persistent storage",
      commands: [
        "kubectl apply -f kubernetes/wordpress-pvc.yaml",
        "kubectl apply -f kubernetes/wordpress-deployment.yaml",
        "kubectl apply -f kubernetes/wordpress-service.yaml"
      ]
    },
    {
      title: "5. Configure Ingress & Load Balancer",
      description: "External access and SSL termination",
      commands: [
        "kubectl apply -f kubernetes/nginx-gateway.yaml",
        "kubectl apply -f kubernetes/wordpress-ingress.yaml"
      ]
    }
  ];

  const accessInfo = [
    {
      service: "WordPress Site",
      url: "https://your-wordpress.com",
      description: "Main WordPress website",
      icon: Globe
    },
    {
      service: "WordPress Admin",
      url: "https://your-wordpress.com/wp-admin",
      description: "WordPress dashboard (user: admin, password from deployment)",
      icon: Settings
    },
    {
      service: "API Endpoint",
      url: "https://api.your-wordpress.com",
      description: "Custom Flask API for analytics and integrations",
      icon: Database
    },
    {
      service: "Monitoring",
      url: "http://localhost:3000",
      description: "Grafana dashboard for system monitoring",
      icon: Shield
    }
  ];

  const copyCommand = async (command: string) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedCommand(command);
      toast({
        title: "Command Copied",
        description: "Command copied to clipboard",
      });
      setTimeout(() => setCopiedCommand(null), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Could not copy command to clipboard",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Terminal className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">WordPress Stack Deployment</h2>
          <p className="text-slate-300">Complete deployment guide for production-ready WordPress with MySQL + MongoDB</p>
        </div>
      </div>

      {/* Prerequisites */}
      <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
        <h3 className="text-blue-400 font-semibold mb-2">Prerequisites</h3>
        <ul className="text-slate-300 text-sm space-y-1">
          <li>• Kubernetes cluster (EKS, GKE, or local)</li>
          <li>• kubectl configured and connected</li>
          <li>• Persistent Volume provisioner</li>
          <li>• Load balancer controller (for cloud deployments)</li>
        </ul>
      </div>

      {/* Deployment Steps */}
      <div className="space-y-4">
        {deploymentSteps.map((step, index) => (
          <div key={index} className="border border-slate-600 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">{step.title}</h3>
            <p className="text-slate-400 text-sm mb-3">{step.description}</p>
            <div className="space-y-2">
              {step.commands.map((command, cmdIndex) => (
                <div key={cmdIndex} className="bg-slate-900 rounded p-3 flex items-center justify-between">
                  <code className="text-green-400 font-mono text-sm flex-1 break-all">
                    {command}
                  </code>
                  <button
                    onClick={() => copyCommand(command)}
                    className="ml-3 p-1 text-slate-400 hover:text-white transition-colors"
                  >
                    {copiedCommand === command ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Verification Commands */}
      <div className="border border-green-600/30 bg-green-900/20 rounded-lg p-4">
        <h3 className="text-green-400 font-semibold mb-2">Verify Deployment</h3>
        <div className="space-y-2">
          <div className="bg-slate-900 rounded p-3 flex items-center justify-between">
            <code className="text-green-400 font-mono text-sm">
              kubectl get pods -l app=wordpress
            </code>
            <button
              onClick={() => copyCommand("kubectl get pods -l app=wordpress")}
              className="ml-3 p-1 text-slate-400 hover:text-white transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-slate-900 rounded p-3 flex items-center justify-between">
            <code className="text-green-400 font-mono text-sm">
              kubectl get services
            </code>
            <button
              onClick={() => copyCommand("kubectl get services")}
              className="ml-3 p-1 text-slate-400 hover:text-white transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Access Information */}
      <div className="border border-slate-600 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-4">Application Access</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {accessInfo.map((access, index) => {
            const Icon = access.icon;
            return (
              <div key={index} className="bg-slate-700/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">{access.service}</span>
                </div>
                <div className="text-blue-400 font-mono text-sm mb-1">{access.url}</div>
                <div className="text-slate-400 text-xs">{access.description}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Environment Configuration */}
      <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
        <h3 className="text-yellow-400 font-semibold mb-2">Environment Configuration</h3>
        <p className="text-slate-300 text-sm mb-3">
          Update these values in your deployment files before applying:
        </p>
        <ul className="text-slate-300 text-sm space-y-1">
          <li>• <code className="text-yellow-400">your-wordpress.com</code> → Your actual domain</li>
          <li>• <code className="text-yellow-400">your-root-password</code> → Strong MySQL root password</li>
          <li>• <code className="text-yellow-400">your-wp-password</code> → WordPress database password</li>
          <li>• <code className="text-yellow-400">your-mongo-password</code> → MongoDB admin password</li>
        </ul>
      </div>
    </div>
  );
};
