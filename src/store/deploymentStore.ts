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
      { name: 'nginx-gateway', replicas: 2, image: 'nginx/nginx-ingress:latest', status: 'running', lastUpdate: '1 minute ago' },
      { name: 'jenkins', replicas: 1, image: 'jenkins/jenkins:lts', status: 'running', lastUpdate: '5 minutes ago' }
    ],
    nodes: 3,
    totalPods: 11,
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
    return `# Terraform Configuration for WordPress Stack with Jenkins CI/CD
# Generated on: ${new Date().toISOString()}
# Current Replicas: WordPress(${this.state.services.find(s => s.name === 'wordpress')?.replicas || 2}), MySQL(${this.state.services.find(s => s.name === 'mysql')?.replicas || 1}), Jenkins(${this.state.services.find(s => s.name === 'jenkins')?.replicas || 1})

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
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.11"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC Configuration
resource "aws_vpc" "wordpress_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "wordpress-vpc"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "wordpress_igw" {
  vpc_id = aws_vpc.wordpress_vpc.id

  tags = {
    Name = "wordpress-igw"
  }
}

# Subnets
resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.wordpress_vpc.id
  cidr_block        = "10.0.\${count.index + 1}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "wordpress-private-\${count.index + 1}"
    "kubernetes.io/role/internal-elb" = "1"
  }
}

resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.wordpress_vpc.id
  cidr_block              = "10.0.\${count.index + 10}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "wordpress-public-\${count.index + 1}"
    "kubernetes.io/role/elb" = "1"
  }
}

# EKS Cluster
resource "aws_eks_cluster" "wordpress_cluster" {
  name     = "wordpress-cluster"
  role_arn = aws_iam_role.cluster_role.arn
  version  = "1.28"

  vpc_config {
    subnet_ids              = concat(aws_subnet.private[*].id, aws_subnet.public[*].id)
    endpoint_private_access = true
    endpoint_public_access  = true
  }

  depends_on = [
    aws_iam_role_policy_attachment.cluster_AmazonEKSClusterPolicy,
  ]
}

# EKS Node Group
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

  update_config {
    max_unavailable = 1
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
  vpc_security_group_ids = [aws_security_group.docdb.id]
  db_subnet_group_name   = aws_docdb_subnet_group.main.name
}

# Gateway API Installation
resource "helm_release" "gateway_api" {
  name             = "gateway-api"
  repository       = "https://gateway-api.github.io/gateway-api"
  chart            = "gateway-api"
  namespace        = "gateway-system"
  create_namespace = true
}

# Install Istio for Gateway API
resource "helm_release" "istio_base" {
  name             = "istio-base"
  repository       = "https://istio-release.storage.googleapis.com/charts"
  chart            = "base"
  namespace        = "istio-system"
  create_namespace = true
}

resource "helm_release" "istiod" {
  name       = "istiod"
  repository = "https://istio-release.storage.googleapis.com/charts"
  chart      = "istiod"
  namespace  = "istio-system"
  
  depends_on = [helm_release.istio_base]
}

# Jenkins Installation
resource "helm_release" "jenkins" {
  name             = "jenkins"
  repository       = "https://charts.jenkins.io"
  chart            = "jenkins"
  namespace        = "jenkins"
  create_namespace = true

  values = [
    yamlencode({
      controller = {
        adminPassword = var.jenkins_password
        ingress = {
          enabled = true
          className = "istio"
        }
      }
      persistence = {
        enabled = true
        size = "20Gi"
      }
    })
  ]
}

# Variables
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

variable "jenkins_password" {
  description = "Jenkins admin password"
  type        = string
  sensitive   = true
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

# Outputs
output "cluster_endpoint" {
  value = aws_eks_cluster.wordpress_cluster.endpoint
}

output "mysql_endpoint" {
  value = aws_db_instance.wordpress_mysql.endpoint
}

output "mongodb_endpoint" {
  value = aws_docdb_cluster.wordpress_mongodb.endpoint
}

output "cluster_name" {
  value = aws_eks_cluster.wordpress_cluster.name
}`;
  }

  generateAnsiblePlaybook(): string {
    return `---
# Ansible Playbook for WordPress Stack with Jenkins CI/CD
# Generated on: ${new Date().toISOString()}
# Current Configuration: ${this.state.services.reduce((acc, s) => acc + s.replicas, 0)} total pods

- name: Configure WordPress Infrastructure with Jenkins
  hosts: kubernetes_nodes
  become: yes
  vars:
    kubernetes_version: "1.28.0"
    docker_version: "24.0"
    wordpress_replicas: ${this.state.services.find(s => s.name === 'wordpress')?.replicas || 2}
    mysql_replicas: ${this.state.services.find(s => s.name === 'mysql')?.replicas || 1}
    jenkins_replicas: ${this.state.services.find(s => s.name === 'jenkins')?.replicas || 1}
    
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
    
    - name: Install Helm
      shell: |
        curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
    
    - name: Install AWS CLI
      pip:
        name: awscli
        state: present

- name: Deploy WordPress Stack with Jenkins
  hosts: localhost
  vars:
    namespace: wordpress
    jenkins_namespace: jenkins
    
  tasks:
    - name: Create WordPress namespace
      kubernetes.core.k8s:
        name: "{{ namespace }}"
        api_version: v1
        kind: Namespace
        state: present
    
    - name: Create Jenkins namespace
      kubernetes.core.k8s:
        name: "{{ jenkins_namespace }}"
        api_version: v1
        kind: Namespace
        state: present
    
    - name: Install Gateway API CRDs
      kubernetes.core.k8s:
        state: present
        definition:
          apiVersion: v1
          kind: Namespace
          metadata:
            name: gateway-system
    
    - name: Deploy Jenkins
      kubernetes.core.k8s:
        definition:
          apiVersion: apps/v1
          kind: Deployment
          metadata:
            name: jenkins
            namespace: "{{ jenkins_namespace }}"
          spec:
            replicas: "{{ jenkins_replicas }}"
            selector:
              matchLabels:
                app: jenkins
            template:
              metadata:
                labels:
                  app: jenkins
              spec:
                containers:
                - name: jenkins
                  image: jenkins/jenkins:lts
                  ports:
                  - containerPort: 8080
                  - containerPort: 50000
                  env:
                  - name: JENKINS_OPTS
                    value: "--httpPort=8080"
                  volumeMounts:
                  - name: jenkins-home
                    mountPath: /var/jenkins_home
                volumes:
                - name: jenkins-home
                  persistentVolumeClaim:
                    claimName: jenkins-pvc
    
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
                  volumeMounts:
                  - name: mysql-storage
                    mountPath: /var/lib/mysql
                volumes:
                - name: mysql-storage
                  persistentVolumeClaim:
                    claimName: mysql-pvc
    
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
                  - containerPort: 80
                  volumeMounts:
                  - name: wordpress-storage
                    mountPath: /var/www/html
                volumes:
                - name: wordpress-storage
                  persistentVolumeClaim:
                    claimName: wordpress-pvc`;
  }

  generateKubernetesManifests(): string {
    const services = this.state.services;
    return `# Kubernetes Manifests for WordPress Stack with Jenkins CI/CD and Gateway API
# Generated on: ${new Date().toISOString()}
# Current Configuration: ${services.reduce((acc, s) => acc + s.replicas, 0)} total pods across ${services.length} services

apiVersion: v1
kind: Namespace
metadata:
  name: wordpress
  labels:
    istio-injection: enabled
---
apiVersion: v1
kind: Namespace
metadata:
  name: jenkins
  labels:
    istio-injection: enabled
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
kind: Secret
metadata:
  name: jenkins-secret
  namespace: jenkins
type: Opaque
data:
  admin-password: amVua2lucw== # base64 encoded 'jenkins'
---
apiVersion: v1
kind: Secret
metadata:
  name: wordpress-tls
  namespace: wordpress
type: kubernetes.io/tls
data:
  tls.crt: LS0tLS1CRUdJTi... # Your TLS certificate
  tls.key: LS0tLS1CRUdJTi... # Your TLS private key
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
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: wordpress-pvc
  namespace: wordpress
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: jenkins-pvc
  namespace: jenkins
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jenkins
  namespace: jenkins
spec:
  replicas: ${services.find(s => s.name === 'jenkins')?.replicas || 1}
  selector:
    matchLabels:
      app: jenkins
  template:
    metadata:
      labels:
        app: jenkins
    spec:
      containers:
      - name: jenkins
        image: jenkins/jenkins:lts
        ports:
        - containerPort: 8080
        - containerPort: 50000
        env:
        - name: JENKINS_OPTS
          value: "--httpPort=8080"
        - name: JENKINS_ADMIN_PASSWORD
          valueFrom:
            secretKeyRef:
              name: jenkins-secret
              key: admin-password
        volumeMounts:
        - name: jenkins-home
          mountPath: /var/jenkins_home
      volumes:
      - name: jenkins-home
        persistentVolumeClaim:
          claimName: jenkins-pvc
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
  name: jenkins
  namespace: jenkins
spec:
  selector:
    app: jenkins
  ports:
  - name: web
    port: 8080
    targetPort: 8080
  - name: agent
    port: 50000
    targetPort: 50000
  type: ClusterIP
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
  type: ClusterIP
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
apiVersion: gateway.networking.k8s.io/v1beta1
kind: Gateway
metadata:
  name: wordpress-gateway
  namespace: wordpress
spec:
  gatewayClassName: istio
  listeners:
  - name: http
    hostname: "wordpress.local"
    port: 80
    protocol: HTTP
    allowedRoutes:
      namespaces:
        from: Same
  - name: https
    hostname: "wordpress.local"
    port: 443
    protocol: HTTPS
    tls:
      mode: Terminate
      certificateRefs:
      - name: wordpress-tls
    allowedRoutes:
      namespaces:
        from: Same
---
apiVersion: gateway.networking.k8s.io/v1beta1
kind: HTTPRoute
metadata:
  name: wordpress-route
  namespace: wordpress
spec:
  parentRefs:
  - name: wordpress-gateway
  hostnames:
  - "wordpress.local"
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /
    backendRefs:
    - name: wordpress
      port: 80
---
apiVersion: gateway.networking.k8s.io/v1beta1
kind: Gateway
metadata:
  name: jenkins-gateway
  namespace: jenkins
spec:
  gatewayClassName: istio
  listeners:
  - name: http
    hostname: "jenkins.local"
    port: 80
    protocol: HTTP
    allowedRoutes:
      namespaces:
        from: Same
  - name: https
    hostname: "jenkins.local"
    port: 443
    protocol: HTTPS
    tls:
      mode: Terminate
      certificateRefs:
      - name: jenkins-tls
    allowedRoutes:
      namespaces:
        from: Same
---
apiVersion: gateway.networking.k8s.io/v1beta1
kind: HTTPRoute
metadata:
  name: jenkins-route
  namespace: jenkins
spec:
  parentRefs:
  - name: jenkins-gateway
  hostnames:
  - "jenkins.local"
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /
    backendRefs:
    - name: jenkins
      port: 8080`;
  }
}

export const deploymentStore = new DeploymentStore();
