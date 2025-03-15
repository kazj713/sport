/**
 * 个性化训练建议模块
 * 
 * 该模块基于学生的训练历史和目标，提供个性化的训练建议和计划
 */

const tf = require('@tensorflow/tfjs');
const natural = require('natural');
const { analyzeTrainingData } = require('../analysis/trainingDataAnalysis');

/**
 * 生成个性化训练建议
 * @param {Object} studentProfile - 学生资料
 * @param {Array} trainingData - 学生的训练记录
 * @param {Array} availableCourses - 可用的课程列表
 * @returns {Object} 个性化训练建议
 */
function generateTrainingRecommendations(studentProfile, trainingData, availableCourses) {
  // 如果没有训练数据，提供基础建议
  if (!trainingData || trainingData.length === 0) {
    return generateBasicRecommendations(studentProfile, availableCourses);
  }
  
  // 分析训练数据
  const analysis = analyzeTrainingData(trainingData);
  
  // 根据分析结果生成建议
  const recommendations = {
    summary: generateSummary(studentProfile, analysis),
    nextSteps: generateNextSteps(studentProfile, analysis, availableCourses),
    suggestedCourses: recommendCourses(studentProfile, analysis, availableCourses),
    improvementAreas: identifyImprovementAreas(analysis),
    weeklyPlan: generateWeeklyPlan(studentProfile, analysis, availableCourses),
    longTermGoals: suggestLongTermGoals(studentProfile, analysis)
  };
  
  return recommendations;
}

/**
 * 为没有训练历史的学生生成基础建议
 * @param {Object} studentProfile - 学生资料
 * @param {Array} availableCourses - 可用的课程列表
 * @returns {Object} 基础训练建议
 */
function generateBasicRecommendations(studentProfile, availableCourses) {
  const fitnessLevel = studentProfile.fitnessLevel || 'beginner';
  const trainingGoals = studentProfile.trainingGoals || '';
  const preferredCategories = studentProfile.preferredCategories || [];
  
  // 根据健身水平筛选课程
  let recommendedDifficulty;
  let sessionsPerWeek;
  
  if (fitnessLevel === 'beginner') {
    recommendedDifficulty = ['beginner', 'all'];
    sessionsPerWeek = 2;
  } else if (fitnessLevel === 'intermediate') {
    recommendedDifficulty = ['beginner', 'intermediate', 'all'];
    sessionsPerWeek = 3;
  } else if (fitnessLevel === 'advanced') {
    recommendedDifficulty = ['intermediate', 'advanced', 'all'];
    sessionsPerWeek = 4;
  } else {
    recommendedDifficulty = ['all', 'beginner'];
    sessionsPerWeek = 2;
  }
  
  // 筛选合适的课程
  const suitableCourses = availableCourses.filter(course => 
    recommendedDifficulty.includes(course.difficultyLevel) &&
    (preferredCategories.length === 0 || preferredCategories.includes(course.categoryId))
  );
  
  // 排序课程（按照与训练目标的相关性）
  const rankedCourses = rankCoursesByRelevance(suitableCourses, trainingGoals);
  
  // 生成每周计划
  const weeklyPlan = [];
  for (let i = 0; i < sessionsPerWeek; i++) {
    if (rankedCourses[i]) {
      weeklyPlan.push({
        dayOfWeek: getRecommendedDay(i, sessionsPerWeek),
        course: rankedCourses[i],
        duration: 60, // 默认60分钟
        intensity: fitnessLevel === 'beginner' ? 'low' : 
                  fitnessLevel === 'intermediate' ? 'medium' : 'high'
      });
    }
  }
  
  return {
    summary: `作为${translateFitnessLevel(fitnessLevel)}水平的学员，建议您每周进行${sessionsPerWeek}次训练，每次约60分钟。初期应该专注于建立基础和正确的动作形式。`,
    nextSteps: [
      "完成个人资料，详细填写您的健康状况和训练目标",
      "预订您的第一节课程，开始您的训练之旅",
      "与教练沟通您的具体需求和任何健康问题"
    ],
    suggestedCourses: rankedCourses.slice(0, 5),
    improvementAreas: [],
    weeklyPlan,
    longTermGoals: suggestBasicLongTermGoals(fitnessLevel, trainingGoals)
  };
}

/**
 * 根据训练数据分析生成总结
 * @param {Object} studentProfile - 学生资料
 * @param {Object} analysis - 训练数据分析结果
 * @returns {string} 总结文本
 */
function generateSummary(studentProfile, analysis) {
  const { totalSessions, totalDuration, averageDuration, trends, firstSession, lastSession } = analysis;
  const fitnessLevel = studentProfile.fitnessLevel || 'beginner';
  const daysSinceLastSession = lastSession ? 
    Math.floor((new Date() - new Date(lastSession.trainingDate)) / (1000 * 60 * 60 * 24)) : null;
  
  let summary = `您已完成${totalSessions}次训练，总计${Math.round(totalDuration / 60)}小时，平均每次${Math.round(averageDuration)}分钟。`;
  
  // 添加频率信息
  if (analysis.frequencyPerWeek) {
    summary += ` 您平均每周训练${analysis.frequencyPerWeek.toFixed(1)}次。`;
  }
  
  // 添加趋势信息
  if (trends && trends.durationTrend) {
    if (trends.durationTrend.direction === 'increasing') {
      summary += ` 您的训练时长呈上升趋势，这是个很好的迹象。`;
    } else if (trends.durationTrend.direction === 'decreasing') {
      summary += ` 您的训练时长呈下降趋势，可能需要调整训练计划。`;
    } else {
      summary += ` 您的训练时长保持稳定。`;
    }
  }
  
  // 添加最近训练信息
  if (daysSinceLastSession !== null) {
    if (daysSinceLastSession <= 7) {
      summary += ` 您最近一次训练是${daysSinceLastSession}天前，保持良好的训练频率！`;
    } else if (daysSinceLastSession <= 14) {
      summary += ` 您已有${daysSinceLastSession}天没有训练了，建议尽快恢复训练节奏。`;
    } else {
      summary += ` 您已有${daysSinceLastSession}天没有训练了，可能需要重新调整训练计划。`;
    }
  }
  
  // 根据健身水平添加建议
  if (fitnessLevel === 'beginner') {
    summary += ` 作为初学者，建议您保持每周2-3次的训练频率，专注于正确的动作形式和基础技能的培养。`;
  } else if (fitnessLevel === 'intermediate') {
    summary += ` 作为中级学员，建议您保持每周3-4次的训练频率，开始增加训练强度和复杂性。`;
  } else if (fitnessLevel === 'advanced') {
    summary += ` 作为高级学员，建议您保持每周4-5次的训练频率，可以尝试更具挑战性的训练方法和技术。`;
  }
  
  return summary;
}

/**
 * 生成下一步行动建议
 * @param {Object} studentProfile - 学生资料
 * @param {Object} analysis - 训练数据分析结果
 * @param {Array} availableCourses - 可用的课程列表
 * @returns {Array} 下一步行动建议列表
 */
function generateNextSteps(studentProfile, analysis, availableCourses) {
  const nextSteps = [];
  const { trends, progress, categories } = analysis;
  
  // 检查训练频率
  if (analysis.frequencyPerWeek < getRecommendedFrequency(studentProfile.fitnessLevel)) {
    nextSteps.push(`增加训练频率至每周${getRecommendedFrequency(studentProfile.fitnessLevel)}次，以获得更好的训练效果`);
  }
  
  // 检查训练多样性
  const categoryCount = Object.keys(categories).length;
  if (categoryCount <= 1) {
    nextSteps.push("尝试更多种类的训练，以全面发展身体素质并避免单调");
  }
  
  // 检查进步情况
  if (progress && progress.metrics) {
    const stagnantMetrics = [];
    
    Object.keys(progress.metrics).forEach(metricName => {
      const metric = progress.metrics[metricName];
      if (metric.trend && metric.trend.direction === 'stable' && metric.values.length > 3) {
        stagnantMetrics.push(metricName);
      }
    });
    
    if (stagnantMetrics.length > 0) {
      nextSteps.push(`在${stagnantMetrics.join('、')}方面调整训练方法，突破当前平台期`);
    }
  }
  
  // 根据最近训练情况添加建议
  const lastSession = analysis.lastSession;
  if (lastSession) {
    const daysSinceLastSession = Math.floor((new Date() - new Date(lastSession.trainingDate)) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastSession > 14) {
      nextSteps.push("重新开始训练，选择适当强度的课程，避免因长时间不训练而受伤");
    }
  }
  
  // 添加课程建议
  const recommendedCourses = recommendCourses(studentProfile, analysis, availableCourses);
  if (recommendedCourses.length > 0) {
    nextSteps.push(`尝试参加"${recommendedCourses[0].title}"课程，这与您的训练目标和当前水平非常匹配`);
  }
  
  // 如果建议不足，添加通用建议
  if (nextSteps.length < 3) {
    const genericSteps = [
      "记录每次训练的感受和表现，帮助跟踪进度",
      "确保充分的休息和恢复，这对训练效果至关重要",
      "注意饮食和水分摄入，为训练提供必要的能量",
      "定期与教练沟通，调整训练计划",
      "设定明确的短期目标，增强训练动力"
    ];
    
    // 添加通用建议直到达到至少3条
    while (nextSteps.length < 3 && genericSteps.length > 0) {
      const randomIndex = Math.floor(Math.random() * genericSteps.length);
      nextSteps.push(genericSteps.splice(randomIndex, 1)[0]);
    }
  }
  
  return nextSteps;
}

/**
 * 推荐适合的课程
 * @param {Object} studentProfile - 学生资料
 * @param {Object} analysis - 训练数据分析结果
 * @param {Array} availableCourses - 可用的课程列表
 * @returns {Array} 推荐的课程列表
 */
function recommendCourses(studentProfile, analysis, availableCourses) {
  const fitnessLevel = studentProfile.fitnessLevel || 'beginner';
  const trainingGoals = studentProfile.trainingGoals || '';
  const preferredCategories = studentProfile.preferredCategories || [];
  
  // 确定推荐的难度级别
  let recommendedDifficulty;
  
  if (fitnessLevel === 'beginner') {
    recommendedDifficulty = ['beginner', 'all'];
  } else if (fitnessLevel === 'intermediate') {
    recommendedDifficulty = ['beginner', 'intermediate', 'all'];
  } else if (fitnessLevel === 'advanced') {
    recommendedDifficulty = ['intermediate', 'advanced', 'all'];
  } else {
    recommendedDifficulty = ['all', 'beginner'];
  }
  
  // 分析已参加的课程类别
  const attendedCategories = new Set();
  const attendedCourseIds = new Set();
  
  if (analysis.categories) {
    Object.keys(analysis.categories).forEach(categoryId => {
      attendedCategories.add(categoryId);
    });
  }
  
  if (analysis.lastSession) {
    // 获取已参加的课程ID
    analysis.lastSession.records?.forEach(record => {
      attendedCourseIds.add(record.courseId);
    });
  }
  
  // 筛选合适的课程
  let suitableCourses = availableCourses.filter(course => 
    recommendedDifficulty.includes(course.difficultyLevel) &&
    !attendedCourseIds.has(course.id) // 排除已参加的课程
  );
  
  // 如果有偏好类别，优先考虑
  if (preferredCategories.length > 0) {
    const preferredCourses = suitableCourses.filter(course => 
      preferredCategories.includes(course.categoryId)
    );
    
    // 如果有足够的偏好类别课程，就只使用这些
    if (preferredCourses.length >= 3) {
      suitableCourses = preferredCourses;
    }
  }
  
  // 如果有训练目标，根据相关性排序
  if (trainingGoals) {
    suitableCourses = rankCoursesByRelevance(suitableCourses, trainingGoals);
  }
  
  // 如果有进步数据，推荐能够改善停滞指标的课程
  if (analysis.progress && analysis.progress.metrics) {
    const stagnantMetrics = [];
    
    Object.keys(analysis.progress.metrics).forEach(metricName => {
      const metric = analysis.progress.metrics[metricName];
      if (metric.trend && metric.trend.direction === 'stable' && metric.values.length > 3) {
        stagnantMetrics.push(metricName);
      }
    });
    
    if (stagnantMetrics.length > 0) {
      // 根据停滞的指标调整课程排序
      suitableCourses.sort((a, b) => {
        const aRelevance = calculateMetricRelevance(a, stagnantMetrics);
        const bRelevance = calculateMetricRelevance(b, stagnantMetrics);
        return bRelevance - aRelevance;
      });
    }
  }
  
  // 返回前5个推荐课程
  return suitableCourses.slice(0, 5);
}

/**
 * 根据相关性对课程进行排序
 * @param {Array} courses - 课程列表
 * @param {string} trainingGoals - 训练目标
 * @returns {Array} 排序后的课程列表
 */
function rankCoursesByRelevance(courses, trainingGoals) {
  // 使用TF-IDF计算相关性
  const tfidf = new natural.TfIdf();
  
  // 添加训练目标作为查询
  tfidf.addDocument(trainingGoals);
  
  // 为每个课程计算相关性分数
  const scoredCourses = courses.map(course => {
    const courseText = `${course.title} ${course.description || ''}`;
    tfidf.addDocument(courseText);
    
    // 计算相似度分数
    let score = 0;
    tfidf.tfidfs(trainingGoals.split(' '), (i, measure) => {
      if (i === 1) { // 第二个文档是当前课程
        score = measure;
      }
    });
    
    return { ...course, relevanceScore: score };
  });
  
  // 按相关性分数降序排序
  scoredCourses.sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  return scoredCourses;
}

/**
 * 计算课程与指标的相关性
 * @param {Object} course - 课程信息
 * @param {Array} metrics - 指标列表
 * @returns {number} 相关性分数
 */
function calculateMetricRelevance(course, metrics) {
  // 这里可以实现更复杂的相关性计算
  // 简化版：检查课程描述中是否包含指标关键词
  const courseText = `${course.title} ${course.description || ''}`.toLowerCase();
  
  let relevance = 0;
  metrics.forEach(metric => {
    const metricKeywords = getMetricKeywords(metric);
    metricKeywords.forEach(keyword => {
      if (courseText.includes(keyword.toLowerCase())) {
        relevance += 1;
      }
    });
  });
  
  return relevance;
}

/**
 * 获取指标相关的关键词
 * @param {string} metric - 指标名称
 * @returns {Array} 关键词列表
 */
function getMetricKeywords(metric) {
  const keywordMap = {
    'pushups': ['俯卧撑', '胸肌', '三头肌', '力量', '上肢'],
    'weight': ['体重', '减脂', '塑形', '有氧', '代谢'],
    'runningDistance': ['跑步', '有氧', '耐力', '心肺', '腿部'],
    'squats': ['深蹲', '腿部', '臀部', '力量', '下肢'],
    'plankTime': ['平板支撑', '核心', '腹肌', '稳定性'],
    'flexibility': ['柔韧性', '拉伸', '瑜伽', '关节活动度'],
    'heartRate': ['心率', '有氧', '心肺', '耐力', '恢复能力']
  };
  
  return keywordMap[metric] || [metric];
}

/**
 * 识别需要改进的领域
 * @param {Object} analysis - 训练数据分析结果
 * @returns {Array} 需要改进的领域列表
 */
function identifyImprovementAreas(analysis) {
  const improvementAreas = [];
  
  // 检查训练频率
  if (analysis.frequencyPerWeek < 2) {
    improvementAreas.push({
      area: "训练频率",
      current: `每周${analysis.frequencyPerWeek.toFixed(1)}次`,
      recommended: "每周至少2-3次",
      reason: "增加训练频率可以提高训练效果和身体适应性"
    });
  }
  
  // 检查训练持续时间
  if (analysis.averageDuration < 45) {
    improvementAreas.push({
      area: "训练时长",
      current: `平均${Math.round(analysis.averageDuration)}分钟`,
      recommended: "每次45-60分钟",
      reason: "适当延长训练时间可以确保充分的训练刺激"
    });
  }
  
  // 检查训练多样性
  const categoryCount = Object.keys(analysis.categories || {}).length;
  if (categoryCount <= 1) {
    improvementAreas.push({
      area: "训练多样性",
      current: `${categoryCount}种训练类型`,
      recommended: "至少2-3种不同类型的训练",
      reason: "多样化的训练可以全面发展身体素质，避免单调和适应性平台期"
    });
  }
  
  // 检查指标进步情况
  if (analysis.progress && analysis.progress.metrics) {
    Object.keys(analysis.progress.metrics).forEach(metricName => {
      const metric = analysis.progress.metrics[metricName];
      
      if (metric.trend && metric.trend.direction === 'decreasing' && metric.values.length > 3) {
        // 对于体重指标，下降可能是好事
        if (metricName === 'weight') {
          // 如果体重下降超过10%，可能需要注意
          const percentChange = Math.abs(metric.changePercent);
          if (percentChange > 10) {
            improvementAreas.push({
              area: "体重管理",
              current: `下降了${percentChange.toFixed(1)}%`,
              recommended: "健康的体重变化速率为每周0.5-1公斤",
              reason: "过快的体重下降可能导致肌肉流失和代谢问题"
            });
          }
        } else {
          improvementAreas.push({
            area: translateMetricName(metricName),
            current: "呈下降趋势",
            recommended: "稳定提升",
            reason: `${translateMetricName(metricName)}下降可能表明训练方法需要调整或恢复不足`
          });
        }
      } else if (metric.trend && metric.trend.direction === 'stable' && metric.values.length > 5) {
        improvementAreas.push({
          area: translateMetricName(metricName),
          current: "停滞不前",
          recommended: "持续进步",
          reason: `${translateMetricName(metricName)}停滞可能表明需要改变训练刺激或增加强度`
        });
      }
    });
  }
  
  return improvementAreas;
}

/**
 * 生成每周训练计划
 * @param {Object} studentProfile - 学生资料
 * @param {Object} analysis - 训练数据分析结果
 * @param {Array} availableCourses - 可用的课程列表
 * @returns {Array} 每周训练计划
 */
function generateWeeklyPlan(studentProfile, analysis, availableCourses) {
  const fitnessLevel = studentProfile.fitnessLevel || 'beginner';
  const recommendedFrequency = getRecommendedFrequency(fitnessLevel);
  
  // 获取推荐课程
  const recommendedCourses = recommendCourses(studentProfile, analysis, availableCourses);
  
  // 生成每周计划
  const weeklyPlan = [];
  
  for (let i = 0; i < recommendedFrequency; i++) {
    // 如果推荐课程不足，循环使用
    const courseIndex = i % recommendedCourses.length;
    const course = recommendedCourses[courseIndex];
    
    if (course) {
      weeklyPlan.push({
        dayOfWeek: getRecommendedDay(i, recommendedFrequency),
        course: course,
        duration: getDurationByFitnessLevel(fitnessLevel),
        intensity: getIntensityByFitnessLevel(fitnessLevel)
      });
    }
  }
  
  return weeklyPlan;
}

/**
 * 建议长期目标
 * @param {Object} studentProfile - 学生资料
 * @param {Object} analysis - 训练数据分析结果
 * @returns {Array} 长期目标列表
 */
function suggestLongTermGoals(studentProfile, analysis) {
  const fitnessLevel = studentProfile.fitnessLevel || 'beginner';
  const trainingGoals = studentProfile.trainingGoals || '';
  
  // 基础长期目标
  const baseGoals = suggestBasicLongTermGoals(fitnessLevel, trainingGoals);
  
  // 如果有训练数据，添加基于进度的目标
  if (analysis.progress && analysis.progress.metrics) {
    const metricGoals = [];
    
    Object.keys(analysis.progress.metrics).forEach(metricName => {
      const metric = analysis.progress.metrics[metricName];
      
      if (metric.values.length > 0) {
        const lastValue = metric.values[metric.<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>