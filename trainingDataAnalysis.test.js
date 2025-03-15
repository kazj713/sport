/**
 * 训练数据分析单元测试
 */

const { expect } = require('chai');
const { 
  analyzeTrainingData, 
  calculateStatistics, 
  identifyTrends,
  detectAnomalies,
  predictFutureTrends
} = require('../src/ai/analysis/trainingDataAnalysis');

describe('训练数据分析测试', () => {
  describe('analyzeTrainingData', () => {
    it('应该对训练数据进行全面分析', () => {
      // 准备测试数据
      const trainingData = [
        {
          id: "1",
          studentId: "student1",
          courseId: "course1",
          trainingDate: "2025-02-01",
          durationMinutes: 60,
          metrics: JSON.stringify({
            pushups: 10,
            weight: 70,
            runningDistance: 2
          }),
          categoryId: 6
        },
        {
          id: "2",
          studentId: "student1",
          courseId: "course1",
          trainingDate: "2025-02-08",
          durationMinutes: 65,
          metrics: JSON.stringify({
            pushups: 12,
            weight: 69.5,
            runningDistance: 2.2
          }),
          categoryId: 6
        },
        {
          id: "3",
          studentId: "student1",
          courseId: "course2",
          trainingDate: "2025-02-15",
          durationMinutes: 70,
          metrics: JSON.stringify({
            pushups: 15,
            weight: 69,
            runningDistance: 2.5
          }),
          categoryId: 6
        }
      ];
      
      // 执行测试
      const analysis = analyzeTrainingData(trainingData);
      
      // 验证结果
      expect(analysis).to.be.an('object');
      expect(analysis.totalSessions).to.equal(3);
      expect(analysis.totalDuration).to.equal(195); // 60 + 65 + 70
      expect(analysis.averageDuration).to.equal(65);
      expect(analysis.firstSession).to.be.an('object');
      expect(analysis.lastSession).to.be.an('object');
      expect(analysis.categories).to.be.an('object');
      expect(analysis.trends).to.be.an('object');
      expect(analysis.progress).to.be.an('object');
      expect(analysis.progress.metrics).to.be.an('object');
    });
    
    it('应该处理空数据集', () => {
      // 准备测试数据
      const trainingData = [];
      
      // 执行测试
      const analysis = analyzeTrainingData(trainingData);
      
      // 验证结果
      expect(analysis).to.be.an('object');
      expect(analysis.totalSessions).to.equal(0);
      expect(analysis.totalDuration).to.equal(0);
      expect(analysis.averageDuration).to.equal(0);
      expect(analysis.firstSession).to.be.null;
      expect(analysis.lastSession).to.be.null;
      expect(analysis.categories).to.be.an('object');
      expect(Object.keys(analysis.categories).length).to.equal(0);
    });
    
    it('应该处理不完整的训练数据', () => {
      // 准备测试数据
      const trainingData = [
        {
          id: "1",
          studentId: "student1",
          // 缺少courseId
          trainingDate: "2025-02-01",
          // 缺少durationMinutes
          // 缺少metrics
          categoryId: 6
        },
        {
          id: "2",
          studentId: "student1",
          courseId: "course1",
          // 缺少trainingDate
          durationMinutes: 65,
          metrics: JSON.stringify({
            pushups: 12
            // 缺少其他指标
          }),
          // 缺少categoryId
        }
      ];
      
      // 执行测试
      const analysis = analyzeTrainingData(trainingData);
      
      // 验证结果
      expect(analysis).to.be.an('object');
      expect(analysis.totalSessions).to.equal(2);
      // 应该能够处理缺失的durationMinutes
      expect(analysis.totalDuration).to.be.a('number');
      expect(analysis.averageDuration).to.be.a('number');
    });
  });
  
  describe('calculateStatistics', () => {
    it('应该计算正确的统计数据', () => {
      // 准备测试数据
      const trainingData = [
        {
          durationMinutes: 60,
          trainingDate: "2025-02-01"
        },
        {
          durationMinutes: 70,
          trainingDate: "2025-02-08"
        },
        {
          durationMinutes: 80,
          trainingDate: "2025-02-15"
        }
      ];
      
      // 执行测试
      const stats = calculateStatistics(trainingData);
      
      // 验证结果
      expect(stats).to.be.an('object');
      expect(stats.totalSessions).to.equal(3);
      expect(stats.totalDuration).to.equal(210);
      expect(stats.averageDuration).to.equal(70);
      expect(stats.minDuration).to.equal(60);
      expect(stats.maxDuration).to.equal(80);
      expect(stats.frequencyPerWeek).to.be.a('number');
    });
    
    it('应该处理空数据集', () => {
      // 准备测试数据
      const trainingData = [];
      
      // 执行测试
      const stats = calculateStatistics(trainingData);
      
      // 验证结果
      expect(stats).to.be.an('object');
      expect(stats.totalSessions).to.equal(0);
      expect(stats.totalDuration).to.equal(0);
      expect(stats.averageDuration).to.equal(0);
      expect(stats.minDuration).to.equal(0);
      expect(stats.maxDuration).to.equal(0);
      expect(stats.frequencyPerWeek).to.equal(0);
    });
  });
  
  describe('identifyTrends', () => {
    it('应该识别上升趋势', () => {
      // 准备测试数据
      const trainingData = [
        {
          durationMinutes: 60,
          trainingDate: "2025-02-01",
          metrics: JSON.stringify({ pushups: 10 })
        },
        {
          durationMinutes: 65,
          trainingDate: "2025-02-08",
          metrics: JSON.stringify({ pushups: 12 })
        },
        {
          durationMinutes: 70,
          trainingDate: "2025-02-15",
          metrics: JSON.stringify({ pushups: 15 })
        }
      ];
      
      // 执行测试
      const trends = identifyTrends(trainingData);
      
      // 验证结果
      expect(trends).to.be.an('object');
      expect(trends.durationTrend).to.be.an('object');
      expect(trends.durationTrend.direction).to.equal('increasing');
      expect(trends.metricsTrends).to.be.an('object');
      expect(trends.metricsTrends.pushups).to.be.an('object');
      expect(trends.metricsTrends.pushups.direction).to.equal('increasing');
    });
    
    it('应该识别下降趋势', () => {
      // 准备测试数据
      const trainingData = [
        {
          durationMinutes: 80,
          trainingDate: "2025-02-01",
          metrics: JSON.stringify({ weight: 75 })
        },
        {
          durationMinutes: 75,
          trainingDate: "2025-02-08",
          metrics: JSON.stringify({ weight: 73 })
        },
        {
          durationMinutes: 70,
          trainingDate: "2025-02-15",
          metrics: JSON.stringify({ weight: 71 })
        }
      ];
      
      // 执行测试
      const trends = identifyTrends(trainingData);
      
      // 验证结果
      expect(trends).to.be.an('object');
      expect(trends.durationTrend).to.be.an('object');
      expect(trends.durationTrend.direction).to.equal('decreasing');
      expect(trends.metricsTrends).to.be.an('object');
      expect(trends.metricsTrends.weight).to.be.an('object');
      expect(trends.metricsTrends.weight.direction).to.equal('decreasing');
    });
    
    it('应该识别稳定趋势', () => {
      // 准备测试数据
      const trainingData = [
        {
          durationMinutes: 60,
          trainingDate: "2025-02-01",
          metrics: JSON.stringify({ heartRate: 140 })
        },
        {
          durationMinutes: 60,
          trainingDate: "2025-02-08",
          metrics: JSON.stringify({ heartRate: 142 })
        },
        {
          durationMinutes: 60,
          trainingDate: "2025-02-15",
          metrics: JSON.stringify({ heartRate: 141 })
        }
      ];
      
      // 执行测试
      const trends = identifyTrends(trainingData);
      
      // 验证结果
      expect(trends).to.be.an('object');
      expect(trends.durationTrend).to.be.an('object');
      expect(trends.durationTrend.direction).to.equal('stable');
      expect(trends.metricsTrends).to.be.an('object');
      expect(trends.metricsTrends.heartRate).to.be.an('object');
      expect(trends.metricsTrends.heartRate.direction).to.equal('stable');
    });
    
    it('应该处理数据不足的情况', () => {
      // 准备测试数据
      const trainingData = [
        {
          durationMinutes: 60,
          trainingDate: "2025-02-01",
          metrics: JSON.stringify({ pushups: 10 })
        }
      ];
      
      // 执行测试
      const trends = identifyTrends(trainingData);
      
      // 验证结果
      expect(trends).to.be.an('object');
      expect(trends.durationTrend).to.be.null;
      expect(trends.metricsTrends).to.be.an('object');
      expect(trends.metricsTrends.pushups).to.be.null;
    });
  });
  
  describe('detectAnomalies', () => {
    it('应该检测异常值', () => {
      // 准备测试数据
      const trainingData = [
        {
          durationMinutes: 60,
          trainingDate: "2025-02-01",
          metrics: JSON.stringify({ pushups: 10 })
        },
        {
          durationMinutes: 65,
          trainingDate: "2025-02-08",
          metrics: JSON.stringify({ pushups: 12 })
        },
        {
          durationMinutes: 120, // 异常值
          trainingDate: "2025-02-15",
          metrics: JSON.stringify({ pushups: 30 }) // 异常值
        },
        {
          durationMinutes: 70,
          trainingDate: "2025-02-22",
          metrics: JSON.stringify({ pushups: 14 })
        }
      ];
      
      // 执行测试
      const anomalies = detectAnomalies(trainingData);
      
      // 验证结果
      expect(anomalies).to.be.an('object');
      expect(anomalies.durationAnomalies).to.be.an('array');
      expect(anomalies.durationAnomalies.length).to.be.above(0);
      expect(anomalies.metricsAnomalies).to.be.an('object');
      expect(anomalies.metricsAnomalies.pushups).to.be.an('array');
      expect(anomalies.metricsAnomalies.pushups.length).to.be.above(0);
    });
    
    it('应该处理数据不足的情况', () => {
      // 准备测试数据
      const trainingData = [
        {
          durationMinutes: 60,
          trainingDate: "2025-02-01",
          metrics: JSON.stringify({ pushups: 10 })
        },
        {
          durationMinutes: 65,
          trainingDate: "2025-02-08",
          metrics: JSON.stringify({ pushups: 12 })
        }
      ];
      
      // 执行测试
      const anomalies = detectAnomalies(trainingData);
      
      // 验证结果
      expect(anomalies).to.be.an('object');
      expect(anomalies.durationAnomalies).to.be.an('array');
      expect(anomalies.durationAnomalies.length).to.equal(0);
      expect(anomalies.metricsAnomalies).to.be.an('object');
      expect(anomalies.metricsAnomalies.pushups).to.be.an('array');
      expect(anomalies.metricsAnomalies.pushups.length).to.equal(0);
    });
  });
  
  describe('predictFutureTrends', () => {
    it('应该预测未来趋势', () => {
      // 准备测试数据
      const trainingData = [
        {
          durationMinutes: 60,
          trainingDate: "2025-02-01",
          metrics: JSON.stringify({ pushups: 10, weight: 70 })
        },
        {
          durationMinutes: 65,
          trainingDate: "2025-02-08",
          metrics: JSON.stringify({ pushups: 12, weight: 69 })
        },
        {
          durationMinutes: 70,
          trainingDate: "2025-02-15",
          metrics: JSON.stringify({ pushups: 14, weight: 68 })
        },
        {
          durationMinutes: 75,
          trainingDate: "2025-02-22",
          metrics: JSON.stringify({ pushups: 16, weight: 67 })
        }
      ];
      
      // 执行测试
      const predictions = predictFutureTrends(trainingData);
      
      // 验证结果
      expect(predictions).to.be.an('object');
      expect(predictions.nextSession).to.be.an('object');
      expect(predictions.nextSession.expectedDuration).to.be.a('number');
      expect(predictions.nextSession.expectedMetrics).to.be.an('object');
      expect(predictions.nextSession.expectedMetrics.pushups).to.be.a('number');
      expect(predictions.nextSession.expectedMetrics.weight).to.be.a('number');
      expect(predictions.longTerm).to.be.an('object');
      expect(predictions.longTerm.trends).to.be.an('object');
    });
    
    it('应该处理数据不足的情况', () => {
      // 准备测试数据
      const trainingData = [
        {
          durationMinutes: 60,
          trainingDate: "2025-02-01",
          metrics: JSON.stringify({ pushups: 10 })
        }
      ];
      
      // 执行测试
      const predictions = predictFutureTrends(trainingData);
      
      // 验证结果
      expect(predictions).to.be.an('object');
      expect(predictions.nextSession).to.be.null;
      expect(predictions.longTerm).to.be.null;
    });
  });
});
