
interface ServiceConfig {
  name: string;
  replicas: number;
  image: string;
  status: 'running' | 'pending' | 'error';
  lastUpdate: string;
}

interface DeploymentState {
  services: ServiceConfig[];
  nodes: number;
  totalPods: number;
  databases: string;
  lastDeployment: string | null;
  currentConfigs: {
    terraform: string;
    ansible: string;
    kubernetes: string;
  };
}

class DeploymentStore {
  private state: DeploymentState = {
    services: [
      { name: 'wordpress', replicas: 2, image: 'wordpress:6.3-apache', status: 'running', lastUpdate: '2 minutes ago' },
      { name: 'mysql', replicas: 1, image: 'mysql:8.0', status: 'running', lastUpdate: '5 minutes ago' },
      { name: 'mongodb', replicas: 1, image: 'mongo:6.0', status: 'running', lastUpdate: '5 minutes ago' },
      { name: 'redis-cache', replicas: 1, image: 'redis:7-alpine', status: 'running', lastUpdate: '10 minutes ago' },
      { name: 'flask-api', replicas: 3, image: 'cloudnative/flask-api:latest', status: 'running', lastUpdate: '3 minutes ago' },
      { name: 'nginx-gateway', replicas: 2, image: 'nginx/nginx-ingress:latest', status: 'running', lastUpdate: '1 minute ago' }
    ],
    nodes: 3,
    totalPods: 10,
    databases: 'MySQL + MongoDB',
    lastDeployment: null,
    currentConfigs: {
      terraform: '',
      ansible: '',
      kubernetes: ''
    }
  };

  private listeners: (() => void)[] = [];

  constructor() {
    this.updateConfigs();
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  private updateConfigs() {
    this.state.currentConfigs = {
      terraform: this.generateTerraformConfig(),
      ansible: this.generateAnsiblePlaybook(),
      kubernetes: this.generateKubernetesManifests()
    };
  }

  getState() {
    return { ...this.state };
  }

  updateServiceReplicas(serviceName: string, replicas: number) {
    const service = this.state.services.find(s => s.name === serviceName);
    if (service) {
      service.replicas = replicas;
      service.lastUpdate = 'Just now';
      service.status = 'pending';
      
      // Update configs immediately
      this.updateConfigs();
      
      // Simulate deployment completion after 2 seconds
      setTimeout(() => {
        service.status = 'running';
        service.lastUpdate = 'Just deployed';
        this.updatePodCount();
        this.updateConfigs();
        this.notify();
      }, 2000);
      
      this.updatePodCount();
      this.notify();
    }
  }

  private updatePodCount() {
    this.state.totalPods = this.state.services.reduce((total, service) => total + service.replicas, 0);
  }

  deployAll() {
    this.state.services.forEach(service => {
      service.status = 'pending';
      service.lastUpdate = 'Deploying...';
    });
    this.state.lastDeployment = new Date().toISOString();
    this.updateConfigs();
    this.notify();

    // Simulate deployment completion
    setTimeout(() => {
      this.state.services.forEach(service => {
        service.status = 'running';
        service.lastUpdate = 'Just deployed';
      });
      this.updateConfigs();
      this.notify();
    }, 5000);
  }

  rollback() {
    this.state.services.forEach(service => {
      service.status = 'pending';
      service.lastUpdate = 'Rolling back...';
      // Reset to default replicas
      if (service.name === 'wordpress') service.replicas = 2;
      else if (service.name === 'flask-api') service.replicas = 3;
      else if (service.name === 'nginx-gateway') service.replicas = 2;
      else service.replicas = 1;
    });
    this.updatePodCount();
    this.updateConfigs();
    this.notify();

    setTimeout(() => {
      this.state.services.forEach(service => {
        service.status = 'running';
        service.lastUpdate = 'Rolled back';
      });
      this.updateConfigs();
      this.notify();
    }, 3000);
  }

  generateTerraformConfig(): string {
    return `# Terraform Configuration for WordPress Stack
# Generated on: ${new Date().toISOString()}
# Current Replicas: WordPress(${this.state.services.find(s => s.name === 'wordpress')?.replicas || 2}), MySQL(${this.state.services.find(s => s.name === 'mysql')?.replicas || 1})

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# EKS Cluster
resource "aws_eks_cluster" "wordpress_cluster" {
  name     = "wordpress-cluster"
  role_arn = aws_iam_role.cluster_role.arn
  version  = "1.28"

  vpc_config {
    subnet_ids = aws_subnet.private[*].id
  }

  depends_on = [
    aws_iam_role_policy_attachment.cluster_AmazonEKSClusterPolicy,
  ]
}

# Node Group
resource "aws_eks_node_group" "wordpress_nodes" {
  cluster_name    = aws_eks_cluster.wordpress_cluster.name
  node_group_name = "wordpress-nodes"
  node_role_arn   = aws_iam_role.node_role.arn
  subnet_ids      = aws_subnet.private[*].id

  scaling_config {
    desired_size = ${this.state.nodes}
    max_size     = 10
    min_size     = 1
  }

  instance_types = ["t3.medium"]

  depends_on = [
    aws_iam_role_policy_attachment.node_AmazonEKSWorkerNodePolicy,
    aws_iam_role_policy_attachment.node_AmazonEKS_CNI_Policy,
    aws_iam_role_policy_attachment.node_AmazonEC2ContainerRegistryReadOnly,
  ]
}

# RDS MySQL Instance
resource "aws_db_instance" "wordpress_mysql" {
  identifier = "wordpress-mysql"
  
  engine         = "mysql"
  engine_version = "8.0"
  instance_class = "db.t3.micro"
  
  allocated_storage     = 20
  max_allocated_storage = 100
  
  db_name  = "wordpress"
  username = "admin"
  password = var.mysql_password
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  skip_final_snapshot = true
}

# DocumentDB for MongoDB
resource "aws_docdb_cluster" "wordpress_mongodb" {
  cluster_identifier      = "wordpress-mongodb"
  engine                 = "docdb"
  master_username        = "admin"
  master_password        = var.mongodb_password
  backup_retention_period = 7
  preferred_backup_window = "07:00-09:00"
  skip_final_snapshot    = true
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

variable "mysql_password" {
  description = "MySQL admin password"
  type        = string
  sensitive   = true
}

variable "mongodb_password" {
  description = "MongoDB admin password"
  type        = string
  sensitive   = true
}

output "cluster_endpoint" {
  value = aws_eks_cluster.wordpress_cluster.endpoint
}

output "mysql_endpoint" {
  value = aws_db_instance.wordpress_mysql.endpoint
}

output "mongodb_endpoint" {
  value = aws_docdb_cluster.wordpress_mongodb.endpoint
}`;
  }

  generateAnsiblePlaybook(): string {
    return `---
# Ansible Playbook for WordPress Stack Configuration
# Generated on: ${new Date().toISOString()}
# Current Configuration: ${this.state.services.reduce((acc, s) => acc + s.replicas, 0)} total pods

- name: Configure WordPress Infrastructure
  hosts: kubernetes_nodes
  become: yes
  vars:
    kubernetes_version: "1.28.0"
    docker_version: "24.0"
    wordpress_replicas: ${this.state.services.find(s => s.name === 'wordpress')?.replicas || 2}
    mysql_replicas: ${this.state.services.find(s => s.name === 'mysql')?.replicas || 1}
    
  tasks:
    - name: Update system packages
      apt:
        update_cache: yes
        upgrade: dist
      when: ansible_os_family == "Debian"
    
    - name: Install Docker
      apt:
        name: 
          - docker.io
          - docker-compose-plugin
        state: present
      when: ansible_os_family == "Debian"
    
    - name: Start Docker service
      systemd:
        name: docker
        state: started
        enabled: yes
    
    - name: Install kubectl
      get_url:
        url: "https://dl.k8s.io/release/v{{ kubernetes_version }}/bin/linux/amd64/kubectl"
        dest: /usr/local/bin/kubectl
        mode: '0755'
    
    - name: Install AWS CLI
      pip:
        name: awscli
        state: present

- name: Deploy WordPress Stack
  hosts: localhost
  vars:
    namespace: wordpress
    
  tasks:
    - name: Create WordPress namespace
      kubernetes.core.k8s:
        name: "{{ namespace }}"
        api_version: v1
        kind: Namespace
        state: present
    
    - name: Deploy MySQL
      kubernetes.core.k8s:
        definition:
          apiVersion: apps/v1
          kind: Deployment
          metadata:
            name: mysql
            namespace: "{{ namespace }}"
          spec:
            replicas: "{{ mysql_replicas }}"
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
                  env:
                  - name: MYSQL_ROOT_PASSWORD
                    value: "wordpress"
                  - name: MYSQL_DATABASE
                    value: "wordpress"
                  ports:
                  - containerPort: 3306
    
    - name: Deploy WordPress
      kubernetes.core.k8s:
        definition:
          apiVersion: apps/v1
          kind: Deployment
          metadata:
            name: wordpress
            namespace: "{{ namespace }}"
          spec:
            replicas: "{{ wordpress_replicas }}"
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
                  env:
                  - name: WORDPRESS_DB_HOST
                    value: "mysql"
                  - name: WORDPRESS_DB_NAME
                    value: "wordpress"
                  - name: WORDPRESS_DB_USER
                    value: "root"
                  - name: WORDPRESS_DB_PASSWORD
                    value: "wordpress"
                  ports:
                  - containerPort: 80`;
  }

  generateKubernetesManifests(): string {
    const services = this.state.services;
    return `# Kubernetes Manifests for WordPress Stack
# Generated on: ${new Date().toISOString()}
# Current Configuration: ${services.reduce((acc, s) => acc + s.replicas, 0)} total pods across ${services.length} services

apiVersion: v1
kind: Namespace
metadata:
  name: wordpress
---
apiVersion: v1
kind: Secret
metadata:
  name: mysql-secret
  namespace: wordpress
type: Opaque
data:
  root-password: d29yZHByZXNz # base64 encoded 'wordpress'
  password: d29yZHByZXNz # base64 encoded 'wordpress'
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-pvc
  namespace: wordpress
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wordpress
  namespace: wordpress
spec:
  replicas: ${services.find(s => s.name === 'wordpress')?.replicas || 2}
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
          value: mysql
        - name: WORDPRESS_DB_NAME
          value: wordpress
        - name: WORDPRESS_DB_USER
          value: root
        - name: WORDPRESS_DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-secret
              key: password
        volumeMounts:
        - name: wordpress-storage
          mountPath: /var/www/html
      volumes:
      - name: wordpress-storage
        persistentVolumeClaim:
          claimName: wordpress-pvc
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql
  namespace: wordpress
spec:
  replicas: ${services.find(s => s.name === 'mysql')?.replicas || 1}
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
        volumeMounts:
        - name: mysql-storage
          mountPath: /var/lib/mysql
      volumes:
      - name: mysql-storage
        persistentVolumeClaim:
          claimName: mysql-pvc
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongodb
  namespace: wordpress
spec:
  replicas: ${services.find(s => s.name === 'mongodb')?.replicas || 1}
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
          value: admin
        - name: MONGO_INITDB_ROOT_PASSWORD
          value: mongodb123
---
apiVersion: v1
kind: Service
metadata:
  name: wordpress
  namespace: wordpress
spec:
  selector:
    app: wordpress
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30080
  type: NodePort
---
apiVersion: v1
kind: Service
metadata:
  name: mysql
  namespace: wordpress
spec:
  selector:
    app: mysql
  ports:
  - port: 3306
    targetPort: 3306
---
apiVersion: v1
kind: Service
metadata:
  name: mongodb
  namespace: wordpress
spec:
  selector:
    app: mongodb
  ports:
  - port: 27017
    targetPort: 27017
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: wordpress-ingress
  namespace: wordpress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  tls:
  - hosts:
    - your-wordpress.com
    secretName: wordpress-tls
  rules:
  - host: your-wordpress.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: wordpress
            port:
              number: 80`;
  }
}

export const deploymentStore = new DeploymentStore();
