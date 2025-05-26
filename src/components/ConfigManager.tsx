import React, { useState } from 'react';
import { 
  Folder, 
  File, 
  Edit, 
  Save, 
  GitCommit,
  ChevronRight,
  ChevronDown,
  Github,
  ExternalLink
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ConfigFile {
  name: string;
  path: string;
  content: string;
  type: string;
}

interface ConfigCategory {
  name: string;
  icon: string;
  files: ConfigFile[];
  expanded: boolean;
}

export const ConfigManager = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<ConfigFile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [showGithubDialog, setShowGithubDialog] = useState(false);
  const [isGithubConnected, setIsGithubConnected] = useState(false);
  
  const [categories, setCategories] = useState<ConfigCategory[]>([
    {
      name: 'WordPress',
      icon: '🌐',
      expanded: true,
      files: [
        {
          name: 'wordpress-deployment.yaml',
          path: '/kubernetes/wordpress-deployment.yaml',
          type: 'yaml',
          content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: wordpress
  namespace: default
  labels:
    app: wordpress
spec:
  replicas: 2
  selector:
    matchLabels:
      app: wordpress
  template:
    metadata:
      labels:
        app: wordpress
    spec:
      containers:
      - name: wordpress
        image: wordpress:6.3-apache
        ports:
        - containerPort: 80
        env:
        - name: WORDPRESS_DB_HOST
          value: mysql-service
        - name: WORDPRESS_DB_USER
          valueFrom:
            secretKeyRef:
              name: mysql-secret
              key: username
        - name: WORDPRESS_DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-secret
              key: password
        - name: WORDPRESS_DB_NAME
          value: wordpress
        - name: WORDPRESS_CONFIG_EXTRA
          value: |
            define('WP_REDIS_HOST', 'redis-service');
            define('WP_REDIS_PORT', 6379);
        volumeMounts:
        - name: wordpress-storage
          mountPath: /var/www/html
        resources:
          limits:
            memory: "512Mi"
            cpu: "500m"
          requests:
            memory: "256Mi"
            cpu: "250m"
      volumes:
      - name: wordpress-storage
        persistentVolumeClaim:
          claimName: wordpress-pvc`
        },
        {
          name: 'wordpress-service.yaml',
          path: '/kubernetes/wordpress-service.yaml',
          type: 'yaml',
          content: `apiVersion: v1
kind: Service
metadata:
  name: wordpress-service
  labels:
    app: wordpress
spec:
  selector:
    app: wordpress
  ports:
  - port: 80
    targetPort: 80
    protocol: TCP
  type: ClusterIP`
        }
      ]
    },
    {
      name: 'Database',
      icon: '🗄️',
      expanded: false,
      files: [
        {
          name: 'mysql-deployment.yaml',
          path: '/kubernetes/mysql-deployment.yaml',
          type: 'yaml',
          content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql
  labels:
    app: mysql
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:8.0
        ports:
        - containerPort: 3306
        env:
        - name: MYSQL_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-secret
              key: root-password
        - name: MYSQL_DATABASE
          value: wordpress
        - name: MYSQL_USER
          valueFrom:
            secretKeyRef:
              name: mysql-secret
              key: username
        - name: MYSQL_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-secret
              key: password
        volumeMounts:
        - name: mysql-storage
          mountPath: /var/lib/mysql
        resources:
          limits:
            memory: "1Gi"
            cpu: "500m"
          requests:
            memory: "512Mi"
            cpu: "250m"
      volumes:
      - name: mysql-storage
        persistentVolumeClaim:
          claimName: mysql-pvc`
        },
        {
          name: 'mongodb-deployment.yaml',
          path: '/kubernetes/mongodb-deployment.yaml',
          type: 'yaml',
          content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongodb
  labels:
    app: mongodb
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
      - name: mongodb
        image: mongo:6.0
        ports:
        - containerPort: 27017
        env:
        - name: MONGO_INITDB_ROOT_USERNAME
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: username
        - name: MONGO_INITDB_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: password
        volumeMounts:
        - name: mongodb-storage
          mountPath: /data/db
        resources:
          limits:
            memory: "768Mi"
            cpu: "300m"
          requests:
            memory: "384Mi"
            cpu: "150m"
      volumes:
      - name: mongodb-storage
        persistentVolumeClaim:
          claimName: mongodb-pvc`
        }
      ]
    },
    {
      name: 'Terraform',
      icon: '🏗️',
      expanded: false,
      files: [
        {
          name: 'main.tf',
          path: '/terraform/main.tf',
          type: 'terraform',
          content: `# WordPress Infrastructure on AWS EKS
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# EKS Cluster for WordPress
module "eks" {
  source = "terraform-aws-modules/eks/aws"
  
  cluster_name    = var.cluster_name
  cluster_version = "1.28"
  
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets
  
  node_groups = {
    wordpress_nodes = {
      desired_capacity = 3
      max_capacity     = 6
      min_capacity     = 2
      
      instance_types = ["t3.medium"]
      
      k8s_labels = {
        Environment = "production"
        Application = "wordpress"
      }
    }
  }
}

# RDS for WordPress MySQL
resource "aws_db_instance" "wordpress_mysql" {
  identifier = "wordpress-mysql"
  
  engine         = "mysql"
  engine_version = "8.0"
  instance_class = "db.t3.micro"
  
  allocated_storage     = 50
  max_allocated_storage = 100
  
  db_name  = "wordpress"
  username = var.db_username
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.wordpress.name
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  skip_final_snapshot = true
  
  tags = {
    Name = "WordPress MySQL Database"
  }
}`
        }
      ]
    }
  ]);

  const toggleCategory = (categoryIndex: number) => {
    setCategories(prev => 
      prev.map((cat, idx) => 
        idx === categoryIndex ? { ...cat, expanded: !cat.expanded } : cat
      )
    );
  };

  const selectFile = (file: ConfigFile) => {
    setSelectedFile(file);
    setEditContent(file.content);
    setEditMode(false);
  };

  const saveFile = () => {
    if (selectedFile) {
      setSelectedFile({ ...selectedFile, content: editContent });
      setEditMode(false);
      toast({
        title: "File Saved",
        description: `${selectedFile.name} has been saved successfully`,
      });
    }
  };

  const handleCommit = () => {
    if (!isGithubConnected) {
      setShowGithubDialog(true);
    } else {
      toast({
        title: "Committing Changes",
        description: "Pushing configuration changes to GitHub repository...",
      });
      // Simulate commit process
      setTimeout(() => {
        toast({
          title: "Changes Committed",
          description: "Successfully pushed to main branch",
        });
      }, 2000);
    }
  };

  const connectGithub = () => {
    toast({
      title: "Connecting to GitHub",
      description: "Redirecting to GitHub for authorization...",
    });
    
    setTimeout(() => {
      setIsGithubConnected(true);
      setShowGithubDialog(false);
      toast({
        title: "GitHub Connected",
        description: "Successfully connected to your GitHub account",
      });
    }, 3000);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
      <div className="flex h-[600px]">
        {/* File tree */}
        <div className="w-1/3 border-r border-slate-700 bg-slate-900/50 flex flex-col">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-white font-semibold">Configuration Files</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {categories.map((category, categoryIndex) => (
              <div key={category.name}>
                <button
                  onClick={() => toggleCategory(categoryIndex)}
                  className="w-full flex items-center gap-2 p-3 hover:bg-slate-700/50 text-left"
                >
                  {category.expanded ? 
                    <ChevronDown className="w-4 h-4 text-slate-400" /> : 
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  }
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-slate-300">{category.name}</span>
                </button>
                
                {category.expanded && (
                  <div className="ml-6">
                    {category.files.map((file) => (
                      <button
                        key={file.path}
                        onClick={() => selectFile(file)}
                        className={`w-full flex items-center gap-2 p-2 hover:bg-slate-700/50 text-left ${
                          selectedFile?.path === file.path ? 'bg-blue-600/30' : ''
                        }`}
                      >
                        <File className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300 text-sm">{file.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* File editor */}
        <div className="flex-1 flex flex-col">
          {selectedFile ? (
            <>
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-semibold">{selectedFile.name}</h4>
                  <p className="text-slate-400 text-sm">{selectedFile.path}</p>
                </div>
                <div className="flex gap-2">
                  {editMode ? (
                    <button
                      onClick={saveFile}
                      className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                  <button 
                    onClick={handleCommit}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                  >
                    <GitCommit className="w-4 h-4" />
                    Commit
                  </button>
                </div>
              </div>
              
              <div className="flex-1 p-4 overflow-hidden">
                {editMode ? (
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-full bg-slate-900 text-slate-300 font-mono text-sm p-4 rounded-lg border border-slate-600 resize-none focus:outline-none focus:border-blue-500 overflow-auto"
                    placeholder="Edit your configuration..."
                  />
                ) : (
                  <div className="w-full h-full overflow-auto">
                    <pre className="bg-slate-900 text-slate-300 font-mono text-sm p-4 rounded-lg border border-slate-600 whitespace-pre-wrap break-words">
                      {selectedFile.content}
                    </pre>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <File className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Select a file to view or edit</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* GitHub Connection Dialog */}
      {showGithubDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <Github className="w-8 h-8 text-white" />
              <h3 className="text-white font-bold">Connect to GitHub</h3>
            </div>
            <p className="text-slate-300 mb-6">
              To commit your configuration changes, you need to connect your GitHub account and create a repository.
            </p>
            <div className="space-y-3">
              <button
                onClick={connectGithub}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-lg border border-gray-600"
              >
                <Github className="w-5 h-5" />
                Connect with GitHub
                <ExternalLink className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowGithubDialog(false)}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white py-2 rounded-lg"
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
