/**
 * 训练数据分析模块
 * 
 * 该模块提供了分析学生训练数据的功能，包括数据处理、统计分析和趋势识别
 */

const tf = require('@tensorflow/tfjs');

/**
 * 分析学生的训练数据并生成统计报告
 * @param {Array} trainingData - 学生的训练记录数组
 * @returns {Object} 统计分析结果
 */
function analyzeTrainingData(trainingData) {
  if (!trainingData || trainingData.length === 0) {
    return {
      totalSessions: 0,
      totalDuration: 0,
      averageDuration: 0,
      trends: {},
      categories: {},
      progress: {}
    };
  }

  // 按日期排序
  const sortedData = [...trainingData].sort((a, b) => 
    new Date(a.trainingDate) - new Date(b.trainingDate)
  );

  // 计算基本统计数据
  const totalSessions = sortedData.length;
  const totalDuration = sortedData.reduce((sum, record) => sum + record.durationMinutes, 0);
  const averageDuration = totalDuration / totalSessions;

  // 分析训练类别分布
  const categories = {};
  sortedData.forEach(record => {
    const categoryId = record.categoryId;
    if (!categories[categoryId]) {
      categories[categoryId] = {
        count: 0,
        totalDuration: 0,
        name: record.categoryName || `类别${categoryId}`
      };
    }
    categories[categoryId].count += 1;
    categories[categoryId].totalDuration += record.durationMinutes;
  });

  // 计算每个类别的平均时长
  Object.keys(categories).forEach(categoryId => {
    categories[categoryId].averageDuration = 
      categories[categoryId].totalDuration / categories[categoryId].count;
  });

  // 分析时间趋势
  const trends = analyzeTimeTrends(sortedData);

  // 分析进度
  const progress = analyzeProgress(sortedData);

  return {
    totalSessions,
    totalDuration,
    averageDuration,
    trends,
    categories,
    progress,
    firstSession: sortedData[0],
    lastSession: sortedData[sortedData.length - 1],
    frequencyPerWeek: calculateFrequency(sortedData, 'week'),
    frequencyPerMonth: calculateFrequency(sortedData, 'month')
  };
}

/**
 * 分析训练数据的时间趋势
 * @param {Array} sortedData - 按日期排序的训练记录
 * @returns {Object} 时间趋势分析结果
 */
function analyzeTimeTrends(sortedData) {
  // 按周分组
  const weeklyData = groupByTimeUnit(sortedData, 'week');
  
  // 按月分组
  const monthlyData = groupByTimeUnit(sortedData, 'month');

  // 计算持续时间趋势
  const durationTrend = calculateTrend(
    sortedData.map(record => record.durationMinutes)
  );

  // 计算频率趋势
  const frequencyTrend = {
    weekly: calculateTrend(Object.values(weeklyData).map(week => week.count)),
    monthly: calculateTrend(Object.values(monthlyData).map(month => month.count))
  };

  return {
    durationTrend,
    frequencyTrend,
    weeklyData,
    monthlyData
  };
}

/**
 * 按时间单位分组训练数据
 * @param {Array} data - 训练记录数组
 * @param {string} unit - 时间单位 ('day', 'week', 'month')
 * @returns {Object} 分组后的数据
 */
function groupByTimeUnit(data, unit) {
  const result = {};

  data.forEach(record => {
    const date = new Date(record.trainingDate);
    let key;

    if (unit === 'day') {
      key = date.toISOString().split('T')[0];
    } else if (unit === 'week') {
      // 获取周数 (以年份开始的第几周)
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
      const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
      key = `${date.getFullYear()}-W${weekNumber}`;
    } else if (unit === 'month') {
      key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    }

    if (!result[key]) {
      result[key] = {
        key,
        count: 0,
        totalDuration: 0,
        records: []
      };
    }

    result[key].count += 1;
    result[key].totalDuration += record.durationMinutes;
    result[key].records.push(record);
  });

  return result;
}

/**
 * 计算数据趋势 (上升/下降/稳定)
 * @param {Array} values - 数值数组
 * @returns {Object} 趋势分析结果
 */
function calculateTrend(values) {
  if (values.length < 2) {
    return { direction: 'stable', slope: 0, confidence: 0 };
  }

  // 使用线性回归计算趋势
  const indices = Array.from({ length: values.length }, (_, i) => i);
  
  // 转换为张量
  const xs = tf.tensor1d(indices);
  const ys = tf.tensor1d(values);
  
  // 标准化
  const xMean = xs.mean();
  const yMean = ys.mean();
  const xStd = xs.sub(xMean).pow(2).mean().sqrt();
  const yStd = ys.sub(yMean).pow(2).mean().sqrt();
  
  // 计算相关系数
  const correlation = tf.tidy(() => {
    const xNorm = xs.sub(xMean).div(xStd);
    const yNorm = ys.sub(yMean).div(yStd);
    return xNorm.mul(yNorm).mean();
  });
  
  // 计算斜率
  const slope = correlation.mul(yStd.div(xStd));
  
  // 确定趋势方向
  let direction = 'stable';
  const slopeValue = slope.dataSync()[0];
  const correlationValue = correlation.dataSync()[0];
  
  if (slopeValue > 0.05) {
    direction = 'increasing';
  } else if (slopeValue < -0.05) {
    direction = 'decreasing';
  }
  
  // 计算置信度 (相关系数的绝对值)
  const confidence = Math.abs(correlationValue);
  
  // 释放张量
  xs.dispose();
  ys.dispose();
  xMean.dispose();
  yMean.dispose();
  xStd.dispose();
  yStd.dispose();
  correlation.dispose();
  slope.dispose();
  
  return {
    direction,
    slope: slopeValue,
    confidence
  };
}

/**
 * 分析训练进度
 * @param {Array} sortedData - 按日期排序的训练记录
 * @returns {Object} 进度分析结果
 */
function analyzeProgress(sortedData) {
  // 提取指标数据
  const metricsData = {};
  
  sortedData.forEach(record => {
    if (record.metrics) {
      let metrics;
      
      // 解析指标数据 (可能是JSON字符串)
      try {
        metrics = typeof record.metrics === 'string' ? 
          JSON.parse(record.metrics) : record.metrics;
      } catch (e) {
        console.error('解析指标数据失败:', e);
        return;
      }
      
      // 处理每个指标
      Object.keys(metrics).forEach(metricName => {
        if (!metricsData[metricName]) {
          metricsData[metricName] = {
            values: [],
            dates: []
          };
        }
        
        metricsData[metricName].values.push(parseFloat(metrics[metricName]));
        metricsData[metricName].dates.push(record.trainingDate);
      });
    }
  });
  
  // 计算每个指标的进步情况
  const progressByMetric = {};
  
  Object.keys(metricsData).forEach(metricName => {
    const { values, dates } = metricsData[metricName];
    
    if (values.length >= 2) {
      const firstValue = values[0];
      const lastValue = values[values.length - 1];
      const changeAbsolute = lastValue - firstValue;
      const changePercent = (changeAbsolute / Math.abs(firstValue)) * 100;
      
      // 计算趋势
      const trend = calculateTrend(values);
      
      progressByMetric[metricName] = {
        firstValue,
        lastValue,
        changeAbsolute,
        changePercent,
        trend,
        values,
        dates
      };
    }
  });
  
  // 分析成就
  const achievements = analyzeAchievements(sortedData);
  
  return {
    metrics: progressByMetric,
    achievements
  };
}

/**
 * 分析训练成就
 * @param {Array} sortedData - 按日期排序的训练记录
 * @returns {Array} 成就列表
 */
function analyzeAchievements(sortedData) {
  const achievements = [];
  
  // 提取所有记录的成就
  sortedData.forEach(record => {
    if (record.achievements) {
      let achievementList;
      
      // 解析成就数据 (可能是JSON字符串或逗号分隔的列表)
      try {
        if (typeof record.achievements === 'string') {
          // 尝试解析JSON
          try {
            achievementList = JSON.parse(record.achievements);
          } catch (e) {
            // 如果不是JSON，假设是逗号分隔的列表
            achievementList = record.achievements.split(',').map(a => a.trim());
          }
        } else if (Array.isArray(record.achievements)) {
          achievementList = record.achievements;
        }
        
        // 添加到成就列表
        if (achievementList && Array.isArray(achievementList)) {
          achievementList.forEach(achievement => {
            achievements.push({
              date: record.trainingDate,
              description: achievement,
              courseId: record.courseId,
              coachId: record.coachId
            });
          });
        }
      } catch (e) {
        console.error('解析成就数据失败:', e);
      }
    }
  });
  
  // 按日期排序
  achievements.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  return achievements;
}

/**
 * 计算训练频率
 * @param {Array} data - 训练记录数组
 * @param {string} unit - 时间单位 ('week', 'month')
 * @returns {number} 平均频率
 */
function calculateFrequency(data, unit) {
  if (data.length < 2) return data.length;
  
  const firstDate = new Date(data[0].trainingDate);
  const lastDate = new Date(data[data.length - 1].trainingDate);
  const diffTime = Math.abs(lastDate - firstDate);
  
  let unitCount;
  if (unit === 'week') {
    unitCount = Math.ceil(diffTime / (7 * 24 * 60 * 60 * 1000));
    unitCount = Math.max(1, unitCount); // 至少1周
  } else if (unit === 'month') {
    unitCount = (lastDate.getFullYear() - firstDate.getFullYear()) * 12 + 
                lastDate.getMonth() - firstDate.getMonth();
    unitCount = Math.max(1, unitCount); // 至少1个月
  } else {
    return 0;
  }
  
  return data.length / unitCount;
}

/**
 * 检测训练数据中的异常值
 * @param {Array} trainingData - 训练记录数组
 * @returns {Array} 异常值列表
 */
function detectAnomalies(trainingData) {
  const anomalies = [];
  
  if (!trainingData || trainingData.length < 5) {
    return anomalies; // 数据太少，无法可靠地检测异常
  }
  
  // 按指标分组
  const metricGroups = {};
  
  trainingData.forEach(record => {
    if (record.metrics) {
      let metrics;
      
      // 解析指标数据
      try {
        metrics = typeof record.metrics === 'string' ? 
          JSON.parse(record.metrics) : record.metrics;
      } catch (e) {
        return;
      }
      
      // 处理每个指标
      Object.keys(metrics).forEach(metricName => {
        if (!metricGroups[metricName]) {
          metricGroups[metricName] = [];
        }
        
        metricGroups[metricName].push({
          value: parseFloat(metrics[metricName]),
          date: record.trainingDate,
          recordId: record.id
        });
      });
    }
  });
  
  // 对每个指标检测异常
  Object.keys(metricGroups).forEach(metricName => {
    const values = metricGroups[metricName].map(item => item.value);
    
    // 计算均值和标准差
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const stdDev = Math.sqrt(
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
    );
    
    // 检测异常 (超过2个标准差)
    metricGroups[metricName].forEach(item => {
      const zScore = Math.abs(item.value - mean) / stdDev;
      
      if (zScore > 2) {
        anomalies.push({
          metricName,
          value: item.value,
          date: item.date,
          recordId: item.recordId,
          zScore,
          mean,
          stdDev
        });
      }
    });
  });
  
  return anomalies;
}

/**
 * 预测未来训练趋势
 * @param {Array} trainingData - 训练记录数组
 * @param {string} metricName - 要预测的指标名称
 * @param {number} predictionDays - 预测未来多少天
 * @returns {Object} 预测结果
 */
async function predictFutureTrend(trainingData, metricName, predictionDays = 30) {
  if (!trainingData || trainingData.length < 10) {
    return { 
      success: false, 
      error: '训练数据不足，无法进行可靠预测' 
    };
  }
  
  // 提取指定指标的数据
  const metricData = [];
  const dates = [];
  
  trainingData.forEach(record => {
    if (record.metrics) {
      let metrics;
      
      // 解析指标数据
      try {
        metrics = typeof record.metrics === 'string' ? 
          JSON.parse(record.metrics) : record.metrics;
      } catch (e) {
        return;
      }
      
      if (metrics[metricName] !== undefined) {
        metricData.push(parseFloat(metrics[metricName]));
        dates.push(new Date(record.trainingDate));
      }
    }
  });
  
  if (metricData.length < 10) {
    return { 
      success: false, 
      error: `${metricName}指标的数据不足，无法进行可靠预测` 
    };
  }
  
  try {
    // 准备数据
    const xs = Array.from({ length: metricData.length }, (_, i) => i);
    const ys = metricData;
    
    // 创建并训练简单线性回归模型
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    
    model.compile({
      optimizer: tf.train.adam(0.1),
      loss: 'meanSquaredError'
    });
    
    const xsTensor = tf.tensor2d(xs, [xs.length, 1]);
    const ysTensor = tf.tensor2d(ys, [ys.length, 1]);
    
    await model.fit(xsTensor, ysTensor, {
      epochs: 100,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
        }
      }
    });
    
    // 预测未来值
    const lastIndex = xs[xs.length - 1];
    const futureIndices = Array.from(
      { length: predictionDays }, 
      (_, i) => lastIndex + i + 1
    );
    
    const futureTensor = tf.tensor2d(futureIndices, [futureIndices.length, 1]);
    const predictions = model.predict(futureTensor);
    const predictedValues = predictions.dataSync();
    
    // 生成未来日期
    const lastDate = dates[dates.length - 1];
    const futureDates = futureIndices.map((_, i) => {
      const date = new Date(lastDate);
      date.setDate(date.getDate() + i + 1);
      return date.toISOString().split('T')[0];
    });
    
    // 计算预测趋势
    const trend = calculateTrend(Array.from(predictedValues));
    
    // 清理张量
    xsTensor.dispose();
    ysTensor.dispose();
    futureTensor.dispose();
    predictions.dispose();
    model.dispose();
    
    return {
      success: true,
      predictions: futureDates.map((date, i) => ({
        date,
        value: predictedValues[i]
      })),
      trend,
      historicalData: dates.map((date, i) => ({
        date: date.toISOString().split('T')[0],
        value: metricData[i]
      }))
    };
  } catch (error) {
    console.error('预测失败:', error);
    return {
      success: false,
      error: `预测过程中出错: ${error.message}`
    };
  }
}

module.exports = {
  analyzeTrainingData,
  analyzeTimeTrends,
  analyzeProgress,
  detectAnomalies,
  predictFutureTrend,
  // 导出辅助函数以便测试
  calculateTrend,
  groupByTimeUnit,
  calculateFrequency
};
