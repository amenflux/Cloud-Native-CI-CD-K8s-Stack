
import React, { useState } from 'react';
import { 
  Terminal, 
  Copy, 
  CheckCircle, 
  ExternalLink,
  Database,
  Globe,
  Settings,
  Shield,
  Download,
  Play,
  AlertTriangle,
  Cloud
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { deploymentStore } from '../store/deploymentStore';

export const WordPressDeploymentGuide = () => {
  const { toast } = useToast();
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('steps');

  const realDeploymentSteps = [
    {
      title: "1. Prerequisites Setup",
      description: "Ensure your infrastructure is ready",
      commands: [
        "# Install kubectl",
        "curl -LO https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl",
        "sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl",
        "",
        "# Verify cluster connection",
        "kubectl cluster-info",
        "kubectl get nodes"
      ]
    },
    {
      title: "2. Create Namespace & Secrets",
      description: "Set up WordPress namespace and database credentials",
      commands: [
        "kubectl create namespace wordpress",
        "",
        "# Create MySQL secret",
        "kubectl create secret generic mysql-secret \\",
        "  --from-literal=root-password=your-secure-password \\",
        "  --from-literal=password=your-wp-password \\",
        "  -n wordpress",
        "",
        "# Create MongoDB secret",
        "kubectl create secret generic mongodb-secret \\",
        "  --from-literal=username=admin \\",
        "  --from-literal=password=your-mongo-password \\",
        "  -n wordpress"
      ]
    },
    {
      title: "3. Deploy Storage",
      description: "Set up persistent volumes for data persistence",
      commands: [
        "# Apply storage configurations",
        "kubectl apply -f - <<EOF",
        "apiVersion: v1",
        "kind: PersistentVolumeClaim",
        "metadata:",
        "  name: mysql-pvc",
        "  namespace: wordpress",
        "spec:",
        "  accessModes:",
        "    - ReadWriteOnce",
        "  resources:",
        "    requests:",
        "      storage: 10Gi",
        "EOF"
      ]
    },
    {
      title: "4. Deploy Database Layer",
      description: "Deploy MySQL and MongoDB instances",
      commands: [
        "# Deploy MySQL",
        "kubectl apply -f kubernetes/mysql-deployment.yaml",
        "kubectl apply -f kubernetes/mysql-service.yaml",
        "",
        "# Deploy MongoDB",
        "kubectl apply -f kubernetes/mongodb-deployment.yaml",
        "kubectl apply -f kubernetes/mongodb-service.yaml",
        "",
        "# Verify databases are running",
        "kubectl get pods -n wordpress -l tier=database"
      ]
    },
    {
      title: "5. Deploy WordPress Application",
      description: "Deploy the main WordPress application",
      commands: [
        "# Deploy WordPress",
        "kubectl apply -f kubernetes/wordpress-deployment.yaml",
        "kubectl apply -f kubernetes/wordpress-service.yaml",
        "",
        "# Check deployment status",
        "kubectl rollout status deployment/wordpress -n wordpress",
        "",
        "# Get external access information",
        "kubectl get svc wordpress -n wordpress"
      ]
    },
    {
      title: "6. Configure External Access",
      description: "Set up ingress and load balancer",
      commands: [
        "# Install NGINX Ingress Controller (if not already installed)",
        "kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml",
        "",
        "# Deploy WordPress Ingress",
        "kubectl apply -f kubernetes/wordpress-ingress.yaml",
        "",
        "# Get external IP",
        "kubectl get ingress wordpress-ingress -n wordpress"
      ]
    }
  ];

  const downloadOptions = [
    {
      name: 'Complete Kubernetes Manifests',
      description: 'All YAML files needed for WordPress deployment',
      action: () => downloadFile(deploymentStore.generateKubernetesManifests(), 'wordpress-k8s-complete.yaml'),
      icon: Settings
    },
    {
      name: 'Terraform Infrastructure',
      description: 'AWS EKS cluster with RDS and DocumentDB',
      action: () => downloadFile(deploymentStore.generateTerraformConfig(), 'wordpress-terraform.tf'),
      icon: Cloud
    },
    {
      name: 'Ansible Playbook',
      description: 'Automated deployment and configuration',
      action: () => downloadFile(deploymentStore.generateAnsiblePlaybook(), 'wordpress-ansible.yml'),
      icon: Terminal
    }
  ];

  const tabs = [
    { id: 'steps', label: 'Deployment Steps', icon: Play },
    { id: 'download', label: 'Download Configs', icon: Download },
    { id: 'verify', label: 'Verification', icon: CheckCircle }
  ];

  const downloadFile = (content: string, filename: string) => {
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
      title: "Download Started",
      description: `${filename} downloaded successfully`,
    });
  };

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

  const renderStepsTab = () => (
    <div className="space-y-6">
      {/* Prerequisites Warning */}
      <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          <h3 className="text-yellow-400 font-semibold">Before You Begin</h3>
        </div>
        <ul className="text-slate-300 text-sm space-y-1">
          <li>• Kubernetes cluster (v1.24+) with sufficient resources</li>
          <li>• kubectl configured and authenticated</li>
          <li>• Persistent Volume provisioner available</li>
          <li>• Load balancer controller (for cloud deployments)</li>
          <li>• SSL certificate manager (cert-manager recommended)</li>
        </ul>
      </div>

      {/* Deployment Steps */}
      {realDeploymentSteps.map((step, index) => (
        <div key={index} className="border border-slate-600 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">{step.title}</h3>
          <p className="text-slate-400 text-sm mb-3">{step.description}</p>
          <div className="bg-slate-900 rounded p-4">
            <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
              {step.commands.join('\n')}
            </pre>
            <button
              onClick={() => copyCommand(step.commands.join('\n'))}
              className="mt-3 flex items-center gap-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors"
            >
              {copiedCommand === step.commands.join('\n') ? (
                <CheckCircle className="w-3 h-3 text-green-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              {copiedCommand === step.commands.join('\n') ? 'Copied!' : 'Copy Commands'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDownloadTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {downloadOptions.map((option, index) => {
          const Icon = option.icon;
          return (
            <div key={index} className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700/70 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <Icon className="w-6 h-6 text-blue-400" />
                <h3 className="text-white font-semibold">{option.name}</h3>
              </div>
              <p className="text-slate-400 text-sm mb-4">{option.description}</p>
              <button
                onClick={option.action}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
        <h3 className="text-blue-400 font-semibold mb-2">Usage Instructions</h3>
        <div className="text-slate-300 text-sm space-y-2">
          <p><strong>Kubernetes Manifests:</strong> Apply directly with kubectl apply -f</p>
          <p><strong>Terraform:</strong> Initialize with terraform init, then terraform plan and apply</p>
          <p><strong>Ansible:</strong> Run with ansible-playbook -i inventory wordpress-ansible.yml</p>
        </div>
      </div>
    </div>
  );

  const renderVerifyTab = () => (
    <div className="space-y-6">
      <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
        <h3 className="text-green-400 font-semibold mb-3">Verification Commands</h3>
        <div className="space-y-3">
          {[
            "kubectl get pods -n wordpress",
            "kubectl get svc -n wordpress",
            "kubectl get ingress -n wordpress",
            "kubectl logs -l app=wordpress -n wordpress --tail=50"
          ].map((cmd, index) => (
            <div key={index} className="bg-slate-900 rounded p-3 flex items-center justify-between">
              <code className="text-green-400 font-mono text-sm">{cmd}</code>
              <button
                onClick={() => copyCommand(cmd)}
                className="ml-3 p-1 text-slate-400 hover:text-white transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-700/50 rounded-lg p-4">
          <h4 className="text-white font-medium mb-2">Expected Services</h4>
          <ul className="text-slate-300 text-sm space-y-1">
            <li>• wordpress (NodePort: 30080)</li>
            <li>• mysql (ClusterIP: 3306)</li>
            <li>• mongodb (ClusterIP: 27017)</li>
            <li>• redis (ClusterIP: 6379)</li>
          </ul>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4">
          <h4 className="text-white font-medium mb-2">Health Checks</h4>
          <ul className="text-slate-300 text-sm space-y-1">
            <li>• All pods should be "Running"</li>
            <li>• Services have endpoints</li>
            <li>• Ingress has external IP</li>
            <li>• WordPress setup accessible</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Terminal className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">WordPress Production Deployment</h2>
          <p className="text-slate-300">Complete guide for deploying WordPress with MySQL + MongoDB on Kubernetes</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-slate-700/50 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'steps' && renderStepsTab()}
      {activeTab === 'download' && renderDownloadTab()}
      {activeTab === 'verify' && renderVerifyTab()}
    </div>
  );
};
