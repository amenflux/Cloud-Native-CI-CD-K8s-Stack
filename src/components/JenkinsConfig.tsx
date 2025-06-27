
import React, { useState } from 'react';
import { 
  Settings, 
  GitBranch, 
  Play, 
  Clock, 
  Shield, 
  Database,
  Save,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export const JenkinsConfig = () => {
  const { toast } = useToast();
  
  const [config, setConfig] = useState({
    jenkinsUrl: 'http://jenkins.wordpress.local:8080',
    username: 'admin',
    token: '••••••••••••••••',
    gitRepository: 'https://github.com/user/wordpress-app.git',
    branch: 'main',
    buildTrigger: 'webhook',
    buildEnvironment: 'production',
    notifications: {
      slack: true,
      email: true,
      webhook: false
    },
    pipeline: {
      stages: [
        { name: 'Checkout', enabled: true, timeout: 5 },
        { name: 'Build', enabled: true, timeout: 15 },
        { name: 'Test', enabled: true, timeout: 10 },
        { name: 'Security Scan', enabled: true, timeout: 8 },
        { name: 'Deploy to Staging', enabled: true, timeout: 12 },
        { name: 'Integration Tests', enabled: true, timeout: 20 },
        { name: 'Deploy to Production', enabled: false, timeout: 15 }
      ]
    },
    environment: {
      vars: [
        { key: 'WORDPRESS_DB_HOST', value: 'mysql-service', secret: false },
        { key: 'WORDPRESS_DB_NAME', value: 'wordpress', secret: false },
        { key: 'WORDPRESS_DB_USER', value: 'wordpress', secret: true },
        { key: 'WORDPRESS_DB_PASSWORD', value: '••••••••', secret: true },
        { key: 'MONGODB_URI', value: '••••••••', secret: true }
      ]
    }
  });

  const addEnvironmentVar = () => {
    setConfig(prev => ({
      ...prev,
      environment: {
        vars: [...prev.environment.vars, { key: '', value: '', secret: false }]
      }
    }));
  };

  const removeEnvironmentVar = (index: number) => {
    setConfig(prev => ({
      ...prev,
      environment: {
        vars: prev.environment.vars.filter((_, i) => i !== index)
      }
    }));
  };

  const updateEnvironmentVar = (index: number, field: string, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      environment: {
        vars: prev.environment.vars.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const saveConfig = () => {
    toast({
      title: "Jenkins Configuration Saved",
      description: "Pipeline configuration updated successfully",
    });
  };

  const testConnection = () => {
    toast({
      title: "Connection Test",
      description: "Testing Jenkins connection...",
    });
    
    setTimeout(() => {
      toast({
        title: "Connection Successful",
        description: "Jenkins server is reachable and authenticated",
      });
    }, 2000);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-orange-400" />
          Jenkins Configuration
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={testConnection}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
          >
            Test Connection
          </button>
          <button 
            onClick={saveConfig}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Config
          </button>
        </div>
      </div>

      {/* Server Configuration */}
      <div className="bg-slate-700/50 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          Server Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-slate-300 text-sm font-medium">Jenkins URL</label>
            <input 
              type="text" 
              value={config.jenkinsUrl}
              onChange={(e) => setConfig(prev => ({ ...prev, jenkinsUrl: e.target.value }))}
              className="w-full mt-1 p-2 bg-slate-800 border border-slate-600 rounded text-white" 
            />
          </div>
          <div>
            <label className="text-slate-300 text-sm font-medium">Username</label>
            <input 
              type="text" 
              value={config.username}
              onChange={(e) => setConfig(prev => ({ ...prev, username: e.target.value }))}
              className="w-full mt-1 p-2 bg-slate-800 border border-slate-600 rounded text-white" 
            />
          </div>
          <div>
            <label className="text-slate-300 text-sm font-medium">API Token</label>
            <input 
              type="password" 
              value={config.token}
              onChange={(e) => setConfig(prev => ({ ...prev, token: e.target.value }))}
              className="w-full mt-1 p-2 bg-slate-800 border border-slate-600 rounded text-white" 
            />
          </div>
        </div>
      </div>

      {/* Pipeline Configuration */}
      <div className="bg-slate-700/50 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-green-400" />
          Pipeline Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-slate-300 text-sm font-medium">Git Repository</label>
            <input 
              type="text" 
              value={config.gitRepository}
              onChange={(e) => setConfig(prev => ({ ...prev, gitRepository: e.target.value }))}
              className="w-full mt-1 p-2 bg-slate-800 border border-slate-600 rounded text-white" 
            />
          </div>
          <div>
            <label className="text-slate-300 text-sm font-medium">Branch</label>
            <input 
              type="text" 
              value={config.branch}
              onChange={(e) => setConfig(prev => ({ ...prev, branch: e.target.value }))}
              className="w-full mt-1 p-2 bg-slate-800 border border-slate-600 rounded text-white" 
            />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-slate-300 font-medium">Pipeline Stages</h4>
          {config.pipeline.stages.map((stage, index) => (
            <div key={index} className="flex items-center justify-between bg-slate-800/50 p-3 rounded">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${stage.enabled ? 'bg-green-400' : 'bg-slate-500'}`} />
                <span className="text-white">{stage.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400 text-sm">{stage.timeout}min</span>
                <button
                  onClick={() => {
                    const newStages = [...config.pipeline.stages];
                    newStages[index].enabled = !newStages[index].enabled;
                    setConfig(prev => ({ ...prev, pipeline: { stages: newStages } }));
                  }}
                  className={`px-2 py-1 rounded text-xs ${
                    stage.enabled ? 'bg-green-600 text-white' : 'bg-slate-600 text-slate-300'
                  }`}
                >
                  {stage.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Environment Variables */}
      <div className="bg-slate-700/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-400" />
            Environment Variables
          </h3>
          <button 
            onClick={addEnvironmentVar}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Variable
          </button>
        </div>
        <div className="space-y-2">
          {config.environment.vars.map((envVar, index) => (
            <div key={index} className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Variable name"
                value={envVar.key}
                onChange={(e) => updateEnvironmentVar(index, 'key', e.target.value)}
                className="flex-1 p-2 bg-slate-800 border border-slate-600 rounded text-white text-sm" 
              />
              <input 
                type={envVar.secret ? 'password' : 'text'}
                placeholder="Value"
                value={envVar.value}
                onChange={(e) => updateEnvironmentVar(index, 'value', e.target.value)}
                className="flex-1 p-2 bg-slate-800 border border-slate-600 rounded text-white text-sm" 
              />
              <button
                onClick={() => updateEnvironmentVar(index, 'secret', !envVar.secret)}
                className={`px-2 py-1 rounded text-xs ${
                  envVar.secret ? 'bg-red-600 text-white' : 'bg-slate-600 text-slate-300'
                }`}
              >
                {envVar.secret ? 'Secret' : 'Plain'}
              </button>
              <button 
                onClick={() => removeEnvironmentVar(index)}
                className="p-1 text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Build Status */}
      <div className="bg-slate-700/50 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Play className="w-5 h-5 text-green-400" />
          Recent Builds
        </h3>
        <div className="space-y-2">
          {[
            { id: '#142', status: 'success', branch: 'main', duration: '3m 45s', time: '2 hours ago' },
            { id: '#141', status: 'failed', branch: 'feature/auth', duration: '2m 12s', time: '4 hours ago' },
            { id: '#140', status: 'success', branch: 'main', duration: '4m 01s', time: '6 hours ago' }
          ].map((build, index) => (
            <div key={index} className="flex items-center justify-between bg-slate-800/50 p-3 rounded">
              <div className="flex items-center gap-3">
                {build.status === 'success' ? 
                  <CheckCircle className="w-4 h-4 text-green-400" /> :
                  <AlertCircle className="w-4 h-4 text-red-400" />
                }
                <span className="text-white font-mono">{build.id}</span>
                <span className="text-slate-400">{build.branch}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span>{build.duration}</span>
                <span>{build.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
