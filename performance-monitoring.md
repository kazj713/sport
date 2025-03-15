# 体育教练平台性能监控系统

本文档详细描述了体育教练平台的性能监控系统设计和实现，特别关注AI功能的性能指标监控。

## 1. 监控系统概述

### 1.1 监控目标

- 实时监控应用和AI服务的性能和健康状态
- 提前发现潜在问题并预警
- 收集性能数据用于优化和扩展决策
- 特别关注AI功能的性能指标
- 确保用户体验符合预期

### 1.2 监控范围

- **基础设施监控**：服务器、数据库、缓存、网络
- **应用性能监控**：响应时间、吞吐量、错误率
- **AI功能监控**：推理时间、准确率、资源使用
- **用户体验监控**：页面加载时间、交互延迟
- **业务指标监控**：用户活跃度、转化率、满意度

### 1.3 监控工具栈

- **基础设施监控**：Amazon CloudWatch, Prometheus, Grafana
- **应用性能监控**：New Relic, ELK Stack (Elasticsearch, Logstash, Kibana)
- **AI功能监控**：TensorBoard, Custom Metrics
- **用户体验监控**：Google Analytics, Hotjar
- **日志管理**：Fluent Bit, Elasticsearch, Kibana
- **告警系统**：PagerDuty, Slack, Email

## 2. 监控系统架构

### 2.1 整体架构

```
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
|  应用服务器集群   |     |   AI服务器集群    |     |   数据库服务器   |
|                  |     |                  |     |                  |
+--------+---------+     +--------+---------+     +--------+---------+
         |                        |                        |
         |                        |                        |
+--------v---------+     +--------v---------+     +--------v---------+
|                  |     |                  |     |                  |
|  应用指标收集器   |     |   AI指标收集器    |     |  数据库指标收集器 |
|  (Prometheus)    |     |  (Custom Agent)  |     |  (CloudWatch)    |
|                  |     |                  |     |                  |
+--------+---------+     +--------+---------+     +--------+---------+
         |                        |                        |
         |                        |                        |
+--------v---------+     +--------v---------+     +--------v---------+
|                  |     |                  |     |                  |
|   指标聚合服务    |     |    日志聚合服务   |     |   跟踪聚合服务   |
|  (Prometheus)    |     |  (Elasticsearch) |     |   (Jaeger)      |
|                  |     |                  |     |                  |
+--------+---------+     +--------+---------+     +--------+---------+
         |                        |                        |
         |                        |                        |
+--------v---------+     +--------v---------+     +--------v---------+
|                  |     |                  |     |                  |
|   可视化仪表板    |     |    告警管理器    |     |   报告生成器     |
|   (Grafana)      |     |  (AlertManager)  |     |  (Custom Tool)   |
|                  |     |                  |     |                  |
+------------------+     +------------------+     +------------------+
```

### 2.2 数据流

1. **指标收集**：各服务器和应用组件生成性能指标
2. **指标传输**：通过推送或拉取方式将指标发送到监控系统
3. **数据存储**：将指标存储在时序数据库中
4. **数据处理**：聚合、分析和处理指标数据
5. **可视化**：通过仪表板展示指标数据
6. **告警**：根据预设规则触发告警
7. **响应**：运维团队响应告警并解决问题

## 3. 基础设施监控

### 3.1 服务器监控

#### 3.1.1 监控指标

- **CPU使用率**：总体和每个核心
- **内存使用率**：总体、可用、缓存
- **磁盘使用率**：总体、可用、I/O操作
- **网络流量**：入站、出站、延迟
- **系统负载**：1分钟、5分钟、15分钟

#### 3.1.2 实现方式

使用Prometheus Node Exporter收集服务器指标：

```yaml
# prometheus-node-exporter.yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: node-exporter
  namespace: monitoring
spec:
  selector:
    matchLabels:
      app: node-exporter
  template:
    metadata:
      labels:
        app: node-exporter
    spec:
      hostNetwork: true
      hostPID: true
      containers:
      - name: node-exporter
        image: prom/node-exporter:v1.3.1
        args:
        - --path.procfs=/host/proc
        - --path.sysfs=/host/sys
        - --collector.filesystem.ignored-mount-points=^/(dev|proc|sys|var/lib/docker/.+)($|/)
        - --collector.filesystem.ignored-fs-types=^(autofs|binfmt_misc|cgroup|configfs|debugfs|devpts|devtmpfs|fusectl|hugetlbfs|mqueue|overlay|proc|procfs|pstore|rpc_pipefs|securityfs|sysfs|tracefs)$
        ports:
        - containerPort: 9100
          name: metrics
        volumeMounts:
        - name: proc
          mountPath: /host/proc
          readOnly: true
        - name: sys
          mountPath: /host/sys
          readOnly: true
      volumes:
      - name: proc
        hostPath:
          path: /proc
      - name: sys
        hostPath:
          path: /sys
```

### 3.2 数据库监控

#### 3.2.1 监控指标

- **连接数**：活跃连接、最大连接
- **查询性能**：查询执行时间、慢查询数量
- **事务**：事务数、回滚数
- **缓存命中率**：缓存使用情况
- **锁等待**：锁等待时间、锁冲突

#### 3.2.2 实现方式

使用CloudWatch和PostgreSQL Exporter监控数据库：

```yaml
# postgres-exporter.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres-exporter
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres-exporter
  template:
    metadata:
      labels:
        app: postgres-exporter
    spec:
      containers:
      - name: postgres-exporter
        image: wrouesnel/postgres_exporter:v0.10.0
        env:
        - name: DATA_SOURCE_NAME
          valueFrom:
            secretKeyRef:
              name: postgres-exporter-secret
              key: data-source-name
        ports:
        - containerPort: 9187
          name: metrics
---
apiVersion: v1
kind: Secret
metadata:
  name: postgres-exporter-secret
  namespace: monitoring
type: Opaque
stringData:
  data-source-name: "postgresql://exporter:password@sportcoach-db.rds.amazonaws.com:5432/sportcoach?sslmode=require"
```

### 3.3 缓存监控

#### 3.3.1 监控指标

- **命中率**：缓存命中和未命中次数
- **内存使用率**：已用内存、可用内存
- **连接数**：当前连接、拒绝连接
- **操作延迟**：读取和写入操作的延迟
- **过期和驱逐**：过期和被驱逐的键数量

#### 3.3.2 实现方式

使用Redis Exporter监控Redis缓存：

```yaml
# redis-exporter.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis-exporter
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis-exporter
  template:
    metadata:
      labels:
        app: redis-exporter
    spec:
      containers:
      - name: redis-exporter
        image: oliver006/redis_exporter:v1.32.0
        env:
        - name: REDIS_ADDR
          value: "redis://sportcoach-redis.cache.amazonaws.com:6379"
        ports:
        - containerPort: 9121
          name: metrics
```

## 4. 应用性能监控

### 4.1 API性能监控

#### 4.1.1 监控指标

- **响应时间**：平均、P50、P90、P99
- **吞吐量**：每秒请求数
- **错误率**：HTTP状态码分布
- **API调用分布**：各端点调用频率
- **资源使用**：CPU、内存、连接数

#### 4.1.2 实现方式

使用Prometheus客户端库在应用中添加指标收集：

```javascript
// app.js
const express = require('express');
const promClient = require('prom-client');
const app = express();

// 创建指标收集器
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// 创建自定义指标
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500, 1000]
});

// 中间件记录请求持续时间
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.route?.path || req.path, status_code: res.statusCode });
  });
  next();
});

// 暴露指标端点
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// 其他路由...
```

### 4.2 前端性能监控

#### 4.2.1 监控指标

- **页面加载时间**：首次内容绘制、首次有意义绘制
- **交互延迟**：首次输入延迟、交互到下一次绘制
- **资源加载**：JS、CSS、图片加载时间
- **客户端错误**：JavaScript错误、API错误
- **用户交互**：点击、滚动、表单提交

#### 4.2.2 实现方式

使用Web Vitals和自定义指标收集前端性能数据：

```javascript
// performance-monitoring.js
import { getCLS, getFID, getLCP, getFCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
    page: window.location.pathname,
    timestamp: Date.now()
  });
  
  // 使用Beacon API发送数据
  navigator.sendBeacon('/api/metrics', body);
}

// 收集Web Vitals指标
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
getFCP(sendToAnalytics);
getTTFB(sendToAnalytics);

// 监听未捕获的错误
window.addEventListener('error', (event) => {
  sendToAnalytics({
    name: 'js_error',
    value: 1,
    id: Date.now().toString(),
    error: {
      message: event.message,
      stack: event.error?.stack,
      source: event.filename,
      line: event.lineno,
      column: event.colno
    }
  });
});

// 监听API错误
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  try {
    const response = await originalFetch(...args);
    if (!response.ok) {
      sendToAnalytics({
        name: 'api_error',
        value: 1,
        id: Date.now().toString(),
        error: {
          url: args[0],
          status: response.status,
          statusText: response.statusText
        }
      });
    }
    return response;
  } catch (error) {
    sendToAnalytics({
      name: 'api_error',
      value: 1,
      id: Date.now().toString(),
      error: {
        url: args[0],
        message: error.message
      }
    });
    throw error;
  }
};
```

## 5. AI功能监控

### 5.1 智能匹配算法监控

#### 5.1.1 监控指标

- **推理时间**：平均、P50、P90、P99
- **匹配准确率**：基于用户反馈
- **匹配分布**：匹配分数分布
- **资源使用**：CPU、内存、GPU使用率
- **用户满意度**：用户对匹配结果的评分

#### 5.1.2 实现方式

在AI服务中添加自定义指标收集：

```python
# matching_service.py
import time
import prometheus_client
from prometheus_client import Counter, Histogram, Gauge

# 创建指标
MATCHING_REQUESTS = Counter('ai_matching_requests_total', 'Total number of matching requests', ['result'])
MATCHING_LATENCY = Histogram('ai_matching_latency_seconds', 'Matching algorithm latency in seconds', ['complexity'])
MATCHING_ACCURACY = Gauge('ai_matching_accuracy_percent', 'Matching algorithm accuracy based on user feedback')
MATCHING_SCORE = Histogram('ai_matching_score', 'Distribution of matching scores', buckets=[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0])
RESOURCE_USAGE = Gauge('ai_matching_resource_usage_percent', 'Resource usage during matching', ['resource_type'])

# 暴露指标端点
prometheus_client.start_http_server(8000)

def match_user_with_coaches(user_profile, available_coaches):
    # 记录请求
    start_time = time.time()
    complexity = 'high' if len(available_coaches) > 10 else 'low'
    
    try:
        # 执行匹配算法
        matches = perform_matching(user_profile, available_coaches)
        
        # 记录匹配分数分布
        for match in matches:
            MATCHING_SCORE.observe(match['score'])
        
        # 记录资源使用情况
        RESOURCE_USAGE.labels(resource_type='cpu').set(get_cpu_usage())
        RESOURCE_USAGE.labels(resource_type='memory').set(get_memory_usage())
        
        # 记录成功请求
        MATCHING_REQUESTS.labels(result='success').inc()
        
        # 记录延迟
        MATCHING_LATENCY.labels(complexity=complexity).observe(time.time() - start_time)
        
        return matches
    except Exception as e:
        # 记录失败请求
        MATCHING_REQUESTS.labels(result='failure').inc()
        raise e

def update_accuracy_from_feedback(feedback_data):
    # 根据用户反馈更新准确率指标
    positive_feedback = sum(1 for f in feedback_data if f['rating'] >= 4)
    accuracy = (positive_feedback / len(feedback_data)) * 100 if feedback_data else 0
    MATCHING_ACCURACY.set(accuracy)
```

### 5.2 训练数据分析监控

#### 5.2.1 监控指标

- **分析时间**：数据处理和分析耗时
- **分析准确率**：基于专家评估
- **数据处理量**：处理的训练记录数量
- **异常检测**：检测到的异常数据点
- **资源使用**：CPU、内存使用率

#### 5.2.2 实现方式

在分析服务中添加自定义指标收集：

```python
# analysis_service.py
import time
import prometheus_client
from prometheus_client import Counter, Histogram, Gauge, Summary

# 创建指标
ANALYSIS_REQUESTS = Counter('ai_analysis_requests_total', 'Total number of analysis requests', ['result'])
ANALYSIS_LATENCY = Histogram('ai_analysis_latency_seconds', 'Analysis algorithm latency in seconds', ['data_size'])
ANALYSIS_ACCURACY = Gauge('ai_analysis_accuracy_percent', 'Analysis algorithm accuracy based on expert evaluation')
DATA_PROCESSED = Summary('ai_analysis_data_processed', 'Amount of training data processed')
ANOMALIES_DETECTED = Counter('ai_analysis_anomalies_total', 'Number of anomalies detected in training data')
RESOURCE_USAGE = Gauge('ai_analysis_resource_usage_percent', 'Resource usage during analysis', ['resource_type'])

# 暴露指标端点
prometheus_client.start_http_server(8001)

def analyze_training_data(user_id, training_records):
    # 记录请求
    start_time = time.time()
    data_size = 'large' if len(training_records) > 50 else 'small'
    
    try:
        # 记录处理的数据量
        DATA_PROCESSED.observe(len(training_records))
        
        # 执行数据分析
        analysis_result, anomalies = perform_analysis(training_records)
        
        # 记录检测到的异常
        ANOMALIES_DETECTED.inc(len(anomalies))
        
        # 记录资源使用情况
        RESOURCE_USAGE.labels(resource_type='cpu').set(get_cpu_usage())
        RESOURCE_USAGE.labels(resource_type='memory').set(get_memory_usage())
        
        # 记录成功请求
        ANALYSIS_REQUESTS.labels(result='success').inc()
        
        # 记录延迟
        ANALYSIS_LATENCY.labels(data_size=data_size).observe(time.time() - start_time)
        
        return analysis_result
    except Exception as e:
        # 记录失败请求
        ANALYSIS_REQUESTS.labels(result='failure').inc()
        raise e

def update_accuracy_from_evaluation(evaluation_data):
    # 根据专家评估更新准确率指标
    accuracy = sum(e['score'] for e in evaluation_data) / len(evaluation_data) * 100 if evaluation_data else 0
    ANALYSIS_ACCURACY.set(accuracy)
```

### 5.3 个性化训练建议监控

#### 5.3.1 监控指标

- **生成时间**：建议生成耗时
- **建议采纳率**：用户采纳建议的比例
- **建议多样性**：不同类型建议的分布
- **用户满意度**：用户对建议的评分
- **资源使用**：CPU、内存使用率

#### 5.3.2 实现方式

在建议服务中添加自定义指标收集：

```python
# recommendation_service.py
import time
import prometheus_client
from prometheus_client import Counter, Histogram, Gauge

# 创建指标
RECOMMENDATION_REQUESTS = Counter('ai_recommendation_requests_total', 'Total number of recommendation requests', ['result'])
RECOMMENDATION_LATENCY = Histogram('ai_recommendation_latency_seconds', 'Recommendation generation latency in seconds')
RECOMMENDATION_ADOPTION = Gauge('ai_recommendation_adoption_percent', 'Percentage of recommendations adopted by users')
RECOMMENDATION_DIVERSITY = Gauge('ai_recommendation_diversity_index', 'Diversity index of generated recommendations')
RECOMMENDATION_SATISFACTION = Gauge('ai_recommendation_satisfaction_rating', 'Average user satisfaction rating for recommendations')
RESOURCE_USAGE = Gauge('ai_recommendation_resource_usage_percent', 'Resource usage during recommendation generation', ['resource_type'])

# 暴露指标端点
prometheus_client.start_http_server(8002)

def generate_training_recommendations(user_id, user_profile, training_history, analysis_result):
    # 记录请求
    start_time = time.time()
    
    try:
        # 执行建议生成
        recommendations = perform_recommendation_generation(user_profile, training_history, analysis_result)
        
        # 计算建议多样性
        diversity_index = calculate_diversity_index(recommendations)
        RECOMMENDATION_DIVERSITY.set(diversity_index)
        
        # 记录资源使用情况
        RESOURCE_USAGE.labels(resource_type='cpu').set(get_cpu_usage())
        RESOURCE_USAGE.labels(resource_type='memory').set(get_memory_usage())
        
        # 记录成功请求
        RECOMMENDATION_REQUESTS.labels(result='success').inc()
        
        # 记录延迟
        RECOMMENDATION_LATENCY.observe(time.time() - start_time)
        
        return recommendations
    except Exception as e:
        # 记录失败请求
        RECOMMENDATION_REQUESTS.labels(result='failure').inc()
        raise e

def update_metrics_from_user_feedback(feedback_data):
    # 更新采纳率
    adopted = sum(1 for f in feedback_data if f['adopted'])
    adoption_rate = (adopted / len(feedback_data)) * 100 if feedback_data else 0
    RECOMMENDATION_ADOPTION.set(adoption_rate)
    
    # 更新满意度评分
    avg_satisfaction = sum(f['rating'] for f in feedback_data) / len(feedback_data) if feedback_data else 0
    RECOMMENDATION_SATISFACTION.set(avg_satisfaction)
```

### 5.4 智能客服监控

#### 5.4.1 监控指标

- **响应时间**：生成回答的耗时
- **问题解决率**：成功解决用户问题的比例
- **意图识别准确率**：正确识别用户意图的比例
- **会话长度**：平均会话消息数
- **用户满意度**：用户对客服回答的评分

#### 5.4.2 实现方式

在客服服务中添加自定义指标收集：

```python
# chatbot_service.py
import time
import prometheus_client
from prometheus_client import Counter, Histogram, Gauge, Summ<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>