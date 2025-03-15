/**
 * 智能匹配算法 - 根据学生需求和教练专长进行最优匹配
 * 
 * 该算法使用基于内容的推荐系统和协同过滤相结合的方法，
 * 计算学生与教练之间的相似度，并提供最佳匹配建议。
 */

// 导入TensorFlow.js用于向量计算和模型处理
const tf = require('@tensorflow/tfjs');
// 导入自然语言处理库用于文本相似度计算
const natural = require('natural');
const { TfIdf } = natural;

/**
 * 计算两个向量之间的余弦相似度
 * @param {Array} vectorA - 第一个特征向量
 * @param {Array} vectorB - 第二个特征向量
 * @returns {number} 相似度分数 (0-1)
 */
function calculateCosineSimilarity(vectorA, vectorB) {
  const dotProduct = tf.tensor1d(vectorA).dot(tf.tensor1d(vectorB)).arraySync();
  const normA = Math.sqrt(vectorA.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(vectorB.reduce((sum, val) => sum + val * val, 0));
  
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (normA * normB);
}

/**
 * 从文本描述中提取关键特征
 * @param {string} text - 文本描述
 * @returns {Object} 提取的特征向量
 */
function extractFeaturesFromText(text) {
  const tfidf = new TfIdf();
  tfidf.addDocument(text);
  
  // 提取关键词和权重
  const features = {};
  tfidf.listTerms(0).forEach(item => {
    features[item.term] = item.tfidf;
  });
  
  return features;
}

/**
 * 将分类特征转换为数值向量
 * @param {Object} profile - 用户资料对象
 * @param {Array} categories - 可能的类别列表
 * @returns {Array} 数值特征向量
 */
function encodeCategoricalFeatures(profile, categories) {
  const vector = [];
  
  // 编码健身水平
  const fitnessLevels = ['beginner', 'intermediate', 'advanced'];
  fitnessLevels.forEach(level => {
    vector.push(profile.fitnessLevel === level ? 1 : 0);
  });
  
  // 编码运动类别偏好
  categories.forEach(category => {
    vector.push(profile.preferredCategories.includes(category.id) ? 1 : 0);
  });
  
  return vector;
}

/**
 * 计算学生与教练之间的匹配分数
 * @param {Object} student - 学生资料
 * @param {Object} coach - 教练资料
 * @param {Array} sportCategories - 运动类别列表
 * @returns {number} 匹配分数 (0-100)
 */
function calculateMatchScore(student, coach, sportCategories) {
  // 1. 类别匹配度 (30%)
  const studentCategories = new Set(student.preferredCategories || []);
  const coachCategories = new Set(coach.specialties.map(s => s.categoryId));
  const commonCategories = [...studentCategories].filter(cat => coachCategories.has(cat));
  const categoryScore = studentCategories.size > 0 ? 
    (commonCategories.length / studentCategories.size) * 30 : 15;
  
  // 2. 经验匹配度 (20%)
  // 根据学生水平匹配适当经验的教练
  let experienceScore = 0;
  if (student.fitnessLevel === 'beginner') {
    // 初学者可能更适合有耐心的教练，但不需要太多年经验
    experienceScore = Math.min(coach.yearsOfExperience, 5) * 4;
  } else if (student.fitnessLevel === 'intermediate') {
    // 中级学生需要有一定经验的教练
    experienceScore = Math.min(Math.max(coach.yearsOfExperience - 2, 0), 10) * 2;
  } else if (student.fitnessLevel === 'advanced') {
    // 高级学生需要非常有经验的教练
    experienceScore = Math.min(Math.max(coach.yearsOfExperience - 5, 0), 10) * 2;
  }
  
  // 3. 目标匹配度 (25%)
  // 分析学生训练目标与教练专长的文本相似度
  const studentGoalsFeatures = extractFeaturesFromText(student.trainingGoals || '');
  const coachBioFeatures = extractFeaturesFromText(coach.bio || '');
  
  // 合并所有特征词汇
  const allTerms = new Set([
    ...Object.keys(studentGoalsFeatures),
    ...Object.keys(coachBioFeatures)
  ]);
  
  // 构建特征向量
  const studentVector = [];
  const coachVector = [];
  
  allTerms.forEach(term => {
    studentVector.push(studentGoalsFeatures[term] || 0);
    coachVector.push(coachBioFeatures[term] || 0);
  });
  
  const textSimilarity = calculateCosineSimilarity(studentVector, coachVector);
  const goalScore = textSimilarity * 25;
  
  // 4. 评价匹配度 (25%)
  // 使用教练的评分
  const ratingScore = (coach.rating || 3) * 5; // 转换为0-25分
  
  // 计算总分
  const totalScore = categoryScore + experienceScore + goalScore + ratingScore;
  
  return Math.min(Math.round(totalScore), 100);
}

/**
 * 为学生推荐最匹配的教练
 * @param {Object} student - 学生资料
 * @param {Array} coaches - 教练列表
 * @param {Array} sportCategories - 运动类别列表
 * @param {number} limit - 返回结果数量限制
 * @returns {Array} 推荐的教练列表，按匹配度排序
 */
function recommendCoaches(student, coaches, sportCategories, limit = 5) {
  // 计算每个教练的匹配分数
  const matchScores = coaches.map(coach => {
    const score = calculateMatchScore(student, coach, sportCategories);
    return {
      coachId: coach.id,
      coachName: coach.fullName,
      matchScore: score,
      specialties: coach.specialties,
      rating: coach.rating,
      hourlyRate: coach.hourlyRate
    };
  });
  
  // 按匹配分数降序排序
  matchScores.sort((a, b) => b.matchScore - a.matchScore);
  
  // 返回前N个结果
  return matchScores.slice(0, limit);
}

/**
 * 为教练推荐最匹配的学生
 * @param {Object} coach - 教练资料
 * @param {Array} students - 学生列表
 * @param {Array} sportCategories - 运动类别列表
 * @param {number} limit - 返回结果数量限制
 * @returns {Array} 推荐的学生列表，按匹配度排序
 */
function recommendStudents(coach, students, sportCategories, limit = 5) {
  // 计算每个学生的匹配分数
  const matchScores = students.map(student => {
    const score = calculateMatchScore(student, coach, sportCategories);
    return {
      studentId: student.id,
      studentName: student.fullName,
      matchScore: score,
      fitnessLevel: student.fitnessLevel,
      trainingGoals: student.trainingGoals
    };
  });
  
  // 按匹配分数降序排序
  matchScores.sort((a, b) => b.matchScore - a.matchScore);
  
  // 返回前N个结果
  return matchScores.slice(0, limit);
}

/**
 * 为特定课程推荐最匹配的学生
 * @param {Object} course - 课程信息
 * @param {Object} coach - 教练资料
 * @param {Array} students - 学生列表
 * @param {Array} sportCategories - 运动类别列表
 * @param {number} limit - 返回结果数量限制
 * @returns {Array} 推荐的学生列表，按匹配度排序
 */
function recommendStudentsForCourse(course, coach, students, sportCategories, limit = 10) {
  // 获取课程类别
  const courseCategory = course.categoryId;
  
  // 筛选对该类别感兴趣的学生
  const interestedStudents = students.filter(student => 
    (student.preferredCategories || []).includes(courseCategory)
  );
  
  // 计算匹配分数
  const matchScores = interestedStudents.map(student => {
    const baseScore = calculateMatchScore(student, coach, sportCategories);
    
    // 额外考虑课程难度与学生水平的匹配度
    let difficultyMatch = 0;
    if (course.difficultyLevel === 'all' || course.difficultyLevel === student.fitnessLevel) {
      difficultyMatch = 20;
    } else if (
      (course.difficultyLevel === 'intermediate' && student.fitnessLevel === 'advanced') ||
      (course.difficultyLevel === 'beginner' && student.fitnessLevel === 'intermediate')
    ) {
      difficultyMatch = 10;
    }
    
    // 调整最终分数
    const adjustedScore = Math.min(baseScore + difficultyMatch, 100);
    
    return {
      studentId: student.id,
      studentName: student.fullName,
      matchScore: adjustedScore,
      fitnessLevel: student.fitnessLevel,
      trainingGoals: student.trainingGoals
    };
  });
  
  // 按匹配分数降序排序
  matchScores.sort((a, b) => b.matchScore - a.matchScore);
  
  // 返回前N个结果
  return matchScores.slice(0, limit);
}

module.exports = {
  calculateMatchScore,
  recommendCoaches,
  recommendStudents,
  recommendStudentsForCourse,
  // 导出辅助函数以便测试
  calculateCosineSimilarity,
  extractFeaturesFromText,
  encodeCategoricalFeatures
};
