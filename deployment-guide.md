# 体育教练平台部署指南

本文档提供体育教练平台的详细部署步骤，包括环境准备、应用部署、AI功能部署和验证步骤。

## 1. 环境准备

### 1.1 服务器准备

#### 生产环境服务器配置

按照部署策略文档中的规格，准备以下服务器：

```bash
# 安装必要的软件包
sudo apt update
sudo apt install -y nginx docker.io docker-compose git nodejs npm

# 启用并启动Docker服务
sudo systemctl enable docker
sudo systemctl start docker

# 安装AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# 安装kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

#### 配置AWS凭证

```bash
aws configure
# 输入AWS访问密钥ID
# 输入AWS秘密访问密钥
# 输入默认区域名称: ap-northeast-1
# 输入默认输出格式: json
```

#### 配置Kubernetes集群访问

```bash
aws eks update-kubeconfig --name sportcoach-cluster --region ap-northeast-1
```

### 1.2 数据库准备

#### 创建数据库

使用AWS RDS控制台或AWS CLI创建PostgreSQL数据库：

```bash
aws rds create-db-instance \
    --db-instance-identifier sportcoach-db \
    --db-instance-class db.m5.large \
    --engine postgres \
    --engine-version 14.5 \
    --master-username admin \
    --master-user-password <secure-password> \
    --allocated-storage 100 \
    --storage-type gp2 \
    --multi-az \
    --db-name sportcoach
```

#### 配置数据库安全组

```bash
# 创建安全组
aws ec2 create-security-group \
    --group-name sportcoach-db-sg \
    --description "Security group for SportCoach DB"

# 添加入站规则，仅允许应用服务器访问
aws ec2 authorize-security-group-ingress \
    --group-id <security-group-id> \
    --protocol tcp \
    --port 5432 \
    --source-group <app-server-security-group-id>
```

### 1.3 存储准备

#### 创建S3存储桶

```bash
# 创建应用资源存储桶
aws s3 mb s3://sportcoach-platform-assets --region ap-northeast-1

# 创建AI模型存储桶
aws s3 mb s3://sportcoach-ai-models --region ap-northeast-1

# 设置存储桶策略
aws s3api put-bucket-policy --bucket sportcoach-platform-assets --policy file://bucket-policy.json
```

bucket-policy.json 内容示例：
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadForGetBucketObjects",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::sportcoach-platform-assets/*"
    }
  ]
}
```

### 1.4 网络准备

#### 配置负载均衡器

```bash
# 创建应用负载均衡器
aws elbv2 create-load-balancer \
    --name sportcoach-alb \
    --subnets <subnet-id-1> <subnet-id-2> \
    --security-groups <security-group-id> \
    --scheme internet-facing \
    --type application

# 创建目标组
aws elbv2 create-target-group \
    --name sportcoach-tg \
    --protocol HTTP \
    --port 80 \
    --vpc-id <vpc-id> \
    --health-check-path /health \
    --health-check-interval-seconds 30 \
    --health-check-timeout-seconds 5 \
    --healthy-threshold-count 2 \
    --unhealthy-threshold-count 2

# 创建监听器
aws elbv2 create-listener \
    --load-balancer-arn <load-balancer-arn> \
    --protocol HTTPS \
    --port 443 \
    --certificates CertificateArn=<certificate-arn> \
    --default-actions Type=forward,TargetGroupArn=<target-group-arn>
```

#### 配置DNS

```bash
# 创建DNS记录
aws route53 change-resource-record-sets \
    --hosted-zone-id <hosted-zone-id> \
    --change-batch '{
        "Changes": [
            {
                "Action": "UPSERT",
                "ResourceRecordSet": {
                    "Name": "sportcoach-platform.com",
                    "Type": "A",
                    "AliasTarget": {
                        "HostedZoneId": "<load-balancer-hosted-zone-id>",
                        "DNSName": "<load-balancer-dns-name>",
                        "EvaluateTargetHealth": true
                    }
                }
            }
        ]
    }'
```

## 2. 应用部署

### 2.1 代码准备

#### 克隆代码仓库

```bash
git clone https://github.com/sportcoach/platform.git
cd platform
```

#### 配置环境变量

创建环境变量文件 `.env.production`：

```
# 应用配置
NODE_ENV=production
PORT=3000
API_URL=https://api.sportcoach-platform.com
FRONTEND_URL=https://sportcoach-platform.com

# 数据库配置
DB_HOST=<rds-endpoint>
DB_PORT=5432
DB_NAME=sportcoach
DB_USER=admin
DB_PASSWORD=<secure-password>

# Redis配置
REDIS_HOST=<redis-endpoint>
REDIS_PORT=6379

# AWS配置
AWS_REGION=ap-northeast-1
S3_BUCKET=sportcoach-platform-assets
AI_MODELS_BUCKET=sportcoach-ai-models

# AI服务配置
AI_SERVICE_URL=http://sportcoach-ai-service:5000
MATCHING_MODEL_VERSION=v1.0.0
ANALYSIS_MODEL_VERSION=v1.0.0
RECOMMENDATION_MODEL_VERSION=v1.0.0
CHATBOT_MODEL_VERSION=v1.0.0
VOICE_MODEL_VERSION=v1.0.0

# 安全配置
JWT_SECRET=<secure-jwt-secret>
JWT_EXPIRATION=86400
```

### 2.2 构建应用

#### 构建前端

```bash
# 安装依赖
npm install

# 构建前端资源
npm run build

# 将构建产物上传到S3
aws s3 sync build/ s3://sportcoach-platform-assets/
```

#### 构建后端

```bash
# 构建后端
npm run build:server

# 构建Docker镜像
docker build -t sportcoach-platform:v1.0.0 .

# 标记镜像
docker tag sportcoach-platform:v1.0.0 <ecr-repository-url>/sportcoach-platform:v1.0.0

# 登录到ECR
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin <ecr-repository-url>

# 推送镜像
docker push <ecr-repository-url>/sportcoach-platform:v1.0.0
```

### 2.3 数据库迁移

```bash
# 运行数据库迁移
npm run migrate:prod

# 验证迁移
npm run migrate:status
```

### 2.4 部署到Kubernetes

创建Kubernetes部署文件 `deployment.yaml`：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sportcoach-platform
  namespace: production
spec:
  replicas: 2
  selector:
    matchLabels:
      app: sportcoach-platform
  template:
    metadata:
      labels:
        app: sportcoach-platform
    spec:
      containers:
      - name: sportcoach-platform
        image: <ecr-repository-url>/sportcoach-platform:v1.0.0
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        envFrom:
        - secretRef:
            name: sportcoach-platform-secrets
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 15
          periodSeconds: 20
---
apiVersion: v1
kind: Service
metadata:
  name: sportcoach-platform
  namespace: production
spec:
  selector:
    app: sportcoach-platform
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP
```

创建Kubernetes Secret：

```bash
kubectl create secret generic sportcoach-platform-secrets \
  --from-file=.env.production \
  --namespace production
```

应用部署：

```bash
kubectl apply -f deployment.yaml
```

验证部署：

```bash
kubectl get pods -n production
kubectl get services -n production
```

## 3. AI功能部署

### 3.1 AI模型准备

#### 上传模型文件

```bash
# 上传匹配算法模型
aws s3 cp models/matching-model.pb s3://sportcoach-ai-models/v1.0.0/

# 上传训练数据分析模型
aws s3 cp models/analysis-model.pb s3://sportcoach-ai-models/v1.0.0/

# 上传训练建议模型
aws s3 cp models/recommendation-model.pb s3://sportcoach-ai-models/v1.0.0/

# 上传智能客服模型
aws s3 cp models/chatbot-model.pb s3://sportcoach-ai-models/v1.0.0/

# 上传语音识别模型
aws s3 cp models/voice-model.pb s3://sportcoach-ai-models/v1.0.0/
```

### 3.2 构建AI服务

```bash
# 进入AI服务目录
cd ai-service

# 构建Docker镜像
docker build -t sportcoach-ai:v1.0.0 .

# 标记镜像
docker tag sportcoach-ai:v1.0.0 <ecr-repository-url>/sportcoach-ai:v1.0.0

# 推送镜像
docker push <ecr-repository-url>/sportcoach-ai:v1.0.0
```

### 3.3 部署AI服务

创建AI服务部署文件 `ai-deployment.yaml`：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sportcoach-ai
  namespace: production
spec:
  replicas: 2
  selector:
    matchLabels:
      app: sportcoach-ai
  template:
    metadata:
      labels:
        app: sportcoach-ai
    spec:
      containers:
      - name: sportcoach-ai
        image: <ecr-repository-url>/sportcoach-ai:v1.0.0
        ports:
        - containerPort: 5000
        env:
        - name: MODEL_PATH
          value: "/models"
        - name: MATCHING_MODEL_VERSION
          value: "v1.0.0"
        - name: ANALYSIS_MODEL_VERSION
          value: "v1.0.0"
        - name: RECOMMENDATION_MODEL_VERSION
          value: "v1.0.0"
        - name: CHATBOT_MODEL_VERSION
          value: "v1.0.0"
        - name: VOICE_MODEL_VERSION
          value: "v1.0.0"
        - name: AWS_REGION
          value: "ap-northeast-1"
        - name: S3_BUCKET
          value: "sportcoach-ai-models"
        envFrom:
        - secretRef:
            name: sportcoach-ai-secrets
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
        readinessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 60
          periodSeconds: 20
        volumeMounts:
        - name: models-volume
          mountPath: /models
      volumes:
      - name: models-volume
        emptyDir: {}
      initContainers:
      - name: model-downloader
        image: amazon/aws-cli
        command: ["/bin/sh", "-c"]
        args:
        - aws s3 sync s3://sportcoach-ai-models/v1.0.0/ /models/
        env:
        - name: AWS_REGION
          value: "ap-northeast-1"
        envFrom:
        - secretRef:
            name: sportcoach-ai-secrets
        volumeMounts:
        - name: models-volume
          mountPath: /models
---
apiVersion: v1
kind: Service
metadata:
  name: sportcoach-ai-service
  namespace: production
spec:
  selector:
    app: sportcoach-ai
  ports:
  - port: 5000
    targetPort: 5000
  type: ClusterIP
```

创建AI服务Secret：

```bash
kubectl create secret generic sportcoach-ai-secrets \
  --from-literal=AWS_ACCESS_KEY_ID=<access-key> \
  --from-literal=AWS_SECRET_ACCESS_KEY=<secret-key> \
  --namespace production
```

应用部署：

```bash
kubectl apply -f ai-deployment.yaml
```

验证部署：

```bash
kubectl get pods -n production
kubectl get services -n production
```

## 4. 部署验证

### 4.1 健康检查

```bash
# 检查应用健康状态
curl https://sportcoach-platform.com/health

# 检查AI服务健康状态
kubectl port-forward service/sportcoach-ai-service 5000:5000 -n production
curl http://localhost:5000/health
```

### 4.2 功能验证

#### 验证基本功能

1. 访问网站首页
2. 测试用户注册和登录
3. 测试课程浏览和搜索
4. 测试预订功能

#### 验证AI功能

1. 测试智能匹配功能
   ```bash
   curl -X POST https://sportcoach-platform.com/api/matching \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <token>" \
     -d '{"userId": "test-user", "preferences": {"goals": ["strength"], "level": "beginner"}}'
   ```

2. 测试训练数据分析功能
   ```bash
   curl -X GET https://sportcoach-platform.com/api/analysis/user/test-user \
     -H "Authorization: Bearer <token>"
   ```

3. 测试个性化训练建议功能
   ```bash
   curl -X GET https://sportcoach-platform.com/api/recommendations/user/test-user \
     -H "Authorization: Bearer <token>"
   ```

4. 测试智能客服功能
   ```bash
   curl -X POST https://sportcoach-platform.com/api/chatbot/query \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <token>" \
     -d '{"query": "如何预订课程？", "sessionId": "test-session"}'
   ```

5. 测试语音识别功能（通过前端界面测试）

### 4.3 性能验证

使用Apache Benchmark进行简单的性能测试：

```bash
# 安装Apache Benchmark
sudo apt install -y apache2-utils

# 测试API端点性能
ab -n 1000 -c 50 https://sportcoach-platform.com/api/courses

# 测试AI服务性能
ab -n 100 -c 10 -p payload.json -T application/json https://sportcoach-platform.com/api/matching
```

## 5. 监控设置

### 5.1 设置CloudWatch监控

```bash
# 创建CloudWatch告警 - CPU使用率
aws cloudwatch put-metric-alarm \
    --alarm-name sportcoach-platform-high-cpu \
    --alarm-description "Alarm when CPU exceeds 80%" \
    --metric-name CPUUtilization \
    --namespace AWS/EC2 \
    --statistic Average \
    --period 300 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold \
    --dimensions Name=AutoScalingGroupName,Value=sportcoach-platform-asg \
    --evaluation-periods 2 \
    --alarm-actions <sns-topic-arn>

# 创建CloudWatch告警 - 内存使用率
aws cloudwatch put-metric-alarm \
    --alarm-name sportcoach-platform-high-memory \
    --alarm-description "Alarm when Memory exceeds 80%" \
    --metric-name MemoryUtilization \
    --namespace AWS/EC2 \
    --statistic Average \
    --period 300 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold \
    --dimensions Name=AutoScalingGroupName,Value=sportcoach-platform-asg \
    --evaluation-periods 2 \
    --alarm-actions <sns-topic-arn>
```

### 5.2 设置Prometheus监控

创建Prometheus ServiceMonitor：

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: sportcoach-platform
  namespace: monitoring
spec:
  selector:
    matchLabels:
      app: sportcoach-platform
  endpoints:
  - port: metrics
    interval: 15s
    path: /metrics

---
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: sportcoach-ai
  namespace: monitoring
spec:
  selector:
    matchLabels:
      app: sportcoach-ai
  endpoints:
  - port: metrics
    interval: 15s
    path: /metrics
```

应用配置：

```bash
kubectl apply -f prometheus-config.yaml
```

### 5.3 设置日志监控

创建Fluent Bit配置：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluent-bit-config
  namespace: logging
data:
  fluent-bit.conf: |
    [SERVICE]
        Flush         1
        Log_Level     info
        Daemon        off
        Parsers_File  parsers.conf

    [INPUT]
        Name              tail
        Tag               kube.*
        Path              /var/log/containers/sportcoach-*.log
        Parser            docker
        DB                /var/log/flb_kube.db
        Mem_Buf_Limit     5MB
        Skip_Long_Lines   On
        Refresh_Interval  10

    [FILTER]
        Name                kubernetes
        Match               kube.*
        Kube_URL            https://kubernetes.default.svc:443
        Kube_CA_File        /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
        Kube_Token_File     /var/run/secrets/kubernetes.io/serviceaccount/token
        Kube_Tag_Prefix     kube.var.log.containers.
        Merge_Log           On
        Merge_Log_Key       log_processed
        K8S-Logging.Parser  On
        K8S-Logging.Exclude Off

    [OUTPUT]
        Name            es
        Match           *
        Host            elasticsearch-master
        Port            9200
        Index           sportcoach
        Type            _doc
        Logstash_Format On
        Logstash_Prefix sportcoach
        Time_Key        @timestamp
        Retry_Limit     False
```

应用配置：

```bash
kubectl apply -f fluent-bit-config.yaml
```

## 6. 回滚流程

### 6.1 应用回滚

如果部署后发现问题，可以使用以下命令回滚：

```bash
# 查看部署历史
kubectl rollout history deployment/sportcoach-platform -n production

# 回滚到上一版本
kubectl rollout undo deployment/sportcoach-platform -n production

# 回滚到特定版本
kubectl rollout undo deployment/sportcoach-platform -n production --to-revision=<revision-number>
```

### 6.2 数据库回滚

如果数据库迁移出现问题，可以使用以下命令回滚：

```bash
# 回滚最近的迁移
npm run migrate:rollback

# 回滚到特定版本
npm run migrate:rollback --to <version>
```

### 6.3 AI模型回滚

如果AI模型出现问题，可以通过更新环境变量回滚到上一版本：

```bash
# 更新AI服务环境变量
kubectl set env deployment/sportcoach-ai \
  MATCHING_MODEL_VERSION=v0.9.0 \
  ANALYSIS_MODEL_VERSION=v0.9.0 \
  RECOMMENDATION_MODEL_VERSION=v0.9.0 \
  CHATBOT_MODEL_VERSION=v0.9.0 \
  VOICE_MODEL_VERSION=v0.9.0 \
  -n production

# 重启AI服务Pod
kubectl rollout restart deployment/sportcoach-ai -n production
```

## 7. 部署后维护

### 7.1 日常维护任务

#### 数据库备份

```bash
# 创建数据库快照
aws rds create-db-snapshot \
    --db-instance-identifier sportcoach-db \
    --db-snapshot-identifier sportcoach-db-snapshot-$(date +%Y%m%d)
```

#### 日志轮转

```bash
# 配置日志轮转
kubectl apply -f logrotate-config.yaml
```

#### 证书更新

```bash
# 更新SSL证书
aws acm import-certificate \
    --certificate-arn <certificate-arn> \
    --certificate file://new-certificate.pem \
    --private-key file://new-private-key.pe<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>