import React, { useState } from 'react';
import { 
  Folder, 
  File, 
  Edit, 
  Save, 
  GitCommit,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

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
  const [selectedFile, setSelectedFile] = useState<ConfigFile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState('');
  
  const [categories, setCategories] = useState<ConfigCategory[]>([
    {
      name: 'Terraform',
      icon: '🏗️',
      expanded: true,
      files: [
        {
          name: 'main.tf',
          path: '/terraform/main.tf',
          type: 'terraform',
          content: `# Terraform configuration for AWS EKS cluster
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC Configuration
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  
  name = "devops-vpc"
  cidr = "10.0.0.0/16"
  
  azs             = ["us-west-2a", "us-west-2b", "us-west-2c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  
  enable_nat_gateway = true
  enable_vpn_gateway = true
  
  tags = {
    Environment = "development"
    Project     = "cloudnative-securestack"
  }
}`
        },
        {
          name: 'variables.tf',
          path: '/terraform/variables.tf',
          type: 'terraform',
          content: `variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

variable "cluster_name" {
  description = "EKS cluster name"
  type        = string
  default     = "devops-cluster"
}

variable "node_instance_type" {
  description = "EC2 instance type for worker nodes"
  type        = string
  default     = "t3.medium"
}`
        }
      ]
    },
    {
      name: 'Ansible',
      icon: '🤖',
      expanded: false,
      files: [
        {
          name: 'playbook.yml',
          path: '/ansible/playbook.yml',
          type: 'yaml',
          content: `---
- name: Configure Kubernetes Cluster
  hosts: all
  become: yes
  vars:
    kubernetes_version: "1.28"
    docker_version: "24.0"
    
  tasks:
    - name: Update system packages
      apt:
        update_cache: yes
        upgrade: dist
        
    - name: Install Docker
      apt:
        name: 
          - docker.io
          - docker-compose
        state: present
        
    - name: Add Kubernetes apt repository
      apt_repository:
        repo: "deb https://apt.kubernetes.io/ kubernetes-xenial main"
        state: present
        
    - name: Install Kubernetes components
      apt:
        name:
          - kubelet={{ kubernetes_version }}*
          - kubeadm={{ kubernetes_version }}*
          - kubectl={{ kubernetes_version }}*
        state: present
        allow_downgrade: yes`
        }
      ]
    },
    {
      name: 'Kubernetes',
      icon: '☸️',
      expanded: false,
      files: [
        {
          name: 'backend-deployment.yaml',
          path: '/kubernetes/backend-deployment.yaml',
          type: 'yaml',
          content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-api
  namespace: default
  labels:
    app: backend-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend-api
  template:
    metadata:
      labels:
        app: backend-api
    spec:
      containers:
      - name: flask-api
        image: cloudnative/flask-api:latest
        ports:
        - containerPort: 5000
        env:
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: db-secrets
              key: mongodb-uri
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: cache-secrets
              key: redis-url
        resources:
          limits:
            memory: "512Mi"
            cpu: "500m"
          requests:
            memory: "256Mi"
            cpu: "250m"`
        },
        {
          name: 'network-policy.yaml',
          path: '/kubernetes/network-policy.yaml',
          type: 'yaml',
          content: `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-network-policy
  namespace: default
spec:
  podSelector:
    matchLabels:
      app: backend-api
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 5000
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: mongodb
    ports:
    - protocol: TCP
      port: 27017
  - to:
    - podSelector:
        matchLabels:
          app: redis
    ports:
    - protocol: TCP
      port: 6379`
        }
      ]
    },
    {
      name: 'Jenkins',
      icon: '🔄',
      expanded: false,
      files: [
        {
          name: 'Jenkinsfile',
          path: '/jenkins/Jenkinsfile',
          type: 'groovy',
          content: `pipeline {
    agent any
    
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-token')
        KUBECONFIG = credentials('kubeconfig')
        IMAGE_TAG = "\${env.BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                    url: 'https://github.com/your-org/cloudnative-app.git'
            }
        }
        
        stage('Build Backend') {
            steps {
                script {
                    dir('backend') {
                        sh 'docker build -t cloudnative/flask-api:\${IMAGE_TAG} .'
                        sh 'docker tag cloudnative/flask-api:\${IMAGE_TAG} cloudnative/flask-api:latest'
                    }
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                script {
                    dir('frontend') {
                        sh 'docker build -t cloudnative/react-dashboard:\${IMAGE_TAG} .'
                        sh 'docker tag cloudnative/react-dashboard:\${IMAGE_TAG} cloudnative/react-dashboard:latest'
                    }
                }
            }
        }
        
        stage('Push to DockerHub') {
            steps {
                script {
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                    sh 'docker push cloudnative/flask-api:\${IMAGE_TAG}'
                    sh 'docker push cloudnative/flask-api:latest'
                    sh 'docker push cloudnative/react-dashboard:\${IMAGE_TAG}'
                    sh 'docker push cloudnative/react-dashboard:latest'
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh 'kubectl apply -f kubernetes/'
                    sh 'kubectl set image deployment/backend-api flask-api=cloudnative/flask-api:\${IMAGE_TAG}'
                    sh 'kubectl set image deployment/frontend-dashboard react-app=cloudnative/react-dashboard:\${IMAGE_TAG}'
                    sh 'kubectl rollout status deployment/backend-api'
                    sh 'kubectl rollout status deployment/frontend-dashboard'
                }
            }
        }
    }
    
    post {
        always {
            sh 'docker logout'
            cleanWs()
        }
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
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
      // In a real app, this would save to the backend
      setSelectedFile({ ...selectedFile, content: editContent });
      setEditMode(false);
      // Simulate saving
      console.log(`Saving file: ${selectedFile.path}`);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
      <div className="flex h-96">
        {/* File tree */}
        <div className="w-1/3 border-r border-slate-700 bg-slate-900/50">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-white font-semibold">Configuration Files</h3>
          </div>
          <div className="overflow-y-auto h-full">
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
                  <button className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
                    <GitCommit className="w-4 h-4" />
                    Commit
                  </button>
                </div>
              </div>
              
              <div className="flex-1 p-4">
                {editMode ? (
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-full bg-slate-900 text-slate-300 font-mono text-sm p-4 rounded-lg border border-slate-600 resize-none focus:outline-none focus:border-blue-500"
                    placeholder="Edit your configuration..."
                  />
                ) : (
                  <pre className="w-full h-full bg-slate-900 text-slate-300 font-mono text-sm p-4 rounded-lg border border-slate-600 overflow-auto">
                    {selectedFile.content}
                  </pre>
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
    </div>
  );
};
