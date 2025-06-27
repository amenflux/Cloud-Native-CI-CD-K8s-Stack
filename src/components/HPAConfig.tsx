
import React, { useState } from 'react';
import { Zap, TrendingUp, Clock, Cpu, MemoryStick, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface HPAConfigProps {
  onApply: (config: any) => void;
  onCancel: () => void;
}

export const HPAConfig = ({ onApply, onCancel }: HPAConfigProps) => {
  const { toast } = useToast();
  
  const [config, setConfig] = useState({
    enabled: true,
    minReplicas: 2,
    maxReplicas: 10,
    targetCPUUtilization: 70,
    targetMemoryUtilization: 80,
    scaleUpPolicy: {
      stabilizationWindow: 180, // seconds
      policies: [
        { type: 'percent', value: 100, periodSeconds: 60 },
        { type: 'pods', value: 2, periodSeconds: 60 }
      ]
    },
    scaleDownPolicy: {
      stabilizationWindow: 300, // seconds
      policies: [
        { type: 'percent', value: 50, periodSeconds: 60 },
        { type: 'pods', value: 1, periodSeconds: 60 }
      ]
    },
    behavior: {
      scaleUp: {
        selectPolicy: 'max',
        stabilizationWindowSeconds: 180
      },
      scaleDown: {
        selectPolicy: 'min',
        stabilizationWindowSeconds: 300
      }
    }
  });

  const handleApply = () => {
    onApply(config);
    toast({
      title: "HPA Configuration Applied",
      description: `Auto-scaling configured with ${config.minReplicas}-${config.maxReplicas} replicas range`,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-600 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-bold text-xl flex items-center gap-2">
            <Zap className="w-6 h-6 text-orange-400" />
            Horizontal Pod Autoscaler Configuration
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Settings */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Scaling Limits
            </h4>
            <div className="space-y-4">
              <div>
                <label className="text-slate-300 text-sm font-medium">Minimum Replicas</label>
                <input 
                  type="number" 
                  value={config.minReplicas}
                  onChange={(e) => setConfig(prev => ({ ...prev, minReplicas: parseInt(e.target.value) || 1 }))}
                  min="1" 
                  max="50" 
                  className="w-full mt-1 p-2 bg-slate-800 border border-slate-600 rounded text-white" 
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm font-medium">Maximum Replicas</label>
                <input 
                  type="number" 
                  value={config.maxReplicas}
                  onChange={(e) => setConfig(prev => ({ ...prev, maxReplicas: parseInt(e.target.value) || 1 }))}
                  min="1" 
                  max="100" 
                  className="w-full mt-1 p-2 bg-slate-800 border border-slate-600 rounded text-white" 
                />
              </div>
            </div>
          </div>

          {/* Resource Targets */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-green-400" />
              Resource Targets
            </h4>
            <div className="space-y-4">
              <div>
                <label className="text-slate-300 text-sm font-medium">
                  Target CPU Utilization ({config.targetCPUUtilization}%)
                </label>
                <input 
                  type="range" 
                  value={config.targetCPUUtilization}
                  onChange={(e) => setConfig(prev => ({ ...prev, targetCPUUtilization: parseInt(e.target.value) }))}
                  min="10" 
                  max="100" 
                  className="w-full mt-2 accent-blue-500" 
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm font-medium">
                  Target Memory Utilization ({config.targetMemoryUtilization}%)
                </label>
                <input 
                  type="range" 
                  value={config.targetMemoryUtilization}
                  onChange={(e) => setConfig(prev => ({ ...prev, targetMemoryUtilization: parseInt(e.target.value) }))}
                  min="10" 
                  max="100" 
                  className="w-full mt-2 accent-purple-500" 
                />
              </div>
            </div>
          </div>

          {/* Scale Up Policy */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Scale Up Policy
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-slate-300 text-sm font-medium">Stabilization Window (seconds)</label>
                <input 
                  type="number" 
                  value={config.scaleUpPolicy.stabilizationWindow}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    scaleUpPolicy: { 
                      ...prev.scaleUpPolicy, 
                      stabilizationWindow: parseInt(e.target.value) || 60 
                    } 
                  }))}
                  min="60" 
                  max="3600" 
                  className="w-full mt-1 p-2 bg-slate-800 border border-slate-600 rounded text-white" 
                />
              </div>
              <div className="text-xs text-slate-400">
                How long to wait before scaling up again after a scaling event
              </div>
            </div>
          </div>

          {/* Scale Down Policy */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-400 rotate-180" />
              Scale Down Policy
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-slate-300 text-sm font-medium">Stabilization Window (seconds)</label>
                <input 
                  type="number" 
                  value={config.scaleDownPolicy.stabilizationWindow}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    scaleDownPolicy: { 
                      ...prev.scaleDownPolicy, 
                      stabilizationWindow: parseInt(e.target.value) || 60 
                    } 
                  }))}
                  min="60" 
                  max="3600" 
                  className="w-full mt-1 p-2 bg-slate-800 border border-slate-600 rounded text-white" 
                />
              </div>
              <div className="text-xs text-slate-400">
                How long to wait before scaling down again after a scaling event
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Preview */}
        <div className="mt-6 bg-slate-700/50 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            Configuration Summary
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-slate-400">Min Replicas</div>
              <div className="text-white font-mono text-lg">{config.minReplicas}</div>
            </div>
            <div className="text-center">
              <div className="text-slate-400">Max Replicas</div>
              <div className="text-white font-mono text-lg">{config.maxReplicas}</div>
            </div>
            <div className="text-center">
              <div className="text-slate-400">CPU Target</div>
              <div className="text-white font-mono text-lg">{config.targetCPUUtilization}%</div>
            </div>
            <div className="text-center">
              <div className="text-slate-400">Memory Target</div>
              <div className="text-white font-mono text-lg">{config.targetMemoryUtilization}%</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button 
            onClick={handleApply}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Apply HPA Configuration
          </button>
          <button 
            onClick={onCancel}
            className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-3 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
