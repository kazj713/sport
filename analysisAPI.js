/**
 * 训练数据分析API接口
 * 
 * 该模块提供了与前端交互的API接口，用于处理训练数据分析请求
 */

const { 
  analyzeTrainingData, 
  detectAnomalies, 
  predictFutureTrend 
} = require('./trainingDataAnalysis');

/**
 * 处理获取学生训练数据分析的API请求
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
async function getTrainingDataAnalysis(req, res) {
  try {
    const { studentId, timeRange } = req.query;
    
    // 从数据库获取学生训练数据
    const trainingData = await fetchStudentTrainingData(studentId, timeRange);
    
    if (!trainingData || trainingData.length === 0) {
      return res.status(200).json({ 
        message: '没有找到训练数据',
        analysis: {
          totalSessions: 0,
          totalDuration: 0
        }
      });
    }
    
    // 分析训练数据
    const analysis = analyzeTrainingData(trainingData);
    
    // 检测异常值
    const anomalies = detectAnomalies(trainingData);
    
    // 返回结果
    return res.status(200).json({
      analysis,
      anomalies,
      dataPoints: trainingData.length
    });
  } catch (error) {
    console.error('分析训练数据时出错:', error);
    return res.status(500).json({ error: '处理请求时出错' });
  }
}

/**
 * 处理获取训练指标预测的API请求
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
async function getPredictedMetrics(req, res) {
  try {
    const { studentId, metricName, days = 30 } = req.query;
    
    if (!metricName) {
      return res.status(400).json({ error: '缺少必要参数: metricName' });
    }
    
    // 从数据库获取学生训练数据
    const trainingData = await fetchStudentTrainingData(studentId);
    
    if (!trainingData || trainingData.length < 10) {
      return res.status(200).json({ 
        success: false,
        message: '训练数据不足，无法进行可靠预测',
        dataPoints: trainingData ? trainingData.length : 0
      });
    }
    
    // 预测未来趋势
    const prediction = await predictFutureTrend(trainingData, metricName, parseInt(days));
    
    // 返回结果
    return res.status(200).json(prediction);
  } catch (error) {
    console.error('预测训练指标时出错:', error);
    return res.status(500).json({ 
      success: false,
      error: '处理请求时出错' 
    });
  }
}

/**
 * 处理获取训练类别分析的API请求
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
async function getCategoryAnalysis(req, res) {
  try {
    const { studentId } = req.query;
    
    // 从数据库获取学生训练数据
    const trainingData = await fetchStudentTrainingData(studentId);
    
    if (!trainingData || trainingData.length === 0) {
      return res.status(200).json({ 
        categories: {},
        message: '没有找到训练数据'
      });
    }
    
    // 分析训练数据
    const { categories } = analyzeTrainingData(trainingData);
    
    // 获取类别详情
    const categoryDetails = await fetchCategoryDetails(Object.keys(categories));
    
    // 合并类别信息
    const enrichedCategories = {};
    Object.keys(categories).forEach(categoryId => {
      enrichedCategories[categoryId] = {
        ...categories[categoryId],
        ...categoryDetails[categoryId]
      };
    });
    
    // 返回结果
    return res.status(200).json({
      categories: enrichedCategories,
      dataPoints: trainingData.length
    });
  } catch (error) {
    console.error('分析训练类别时出错:', error);
    return res.status(500).json({ error: '处理请求时出错' });
  }
}

/**
 * 处理获取成就列表的API请求
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
async function getAchievements(req, res) {
  try {
    const { studentId } = req.query;
    
    // 从数据库获取学生训练数据
    const trainingData = await fetchStudentTrainingData(studentId);
    
    if (!trainingData || trainingData.length === 0) {
      return res.status(200).json({ 
        achievements: [],
        message: '没有找到训练数据'
      });
    }
    
    // 分析训练数据
    const { progress } = analyzeTrainingData(trainingData);
    
    // 获取教练和课程详情
    const coachIds = new Set();
    const courseIds = new Set();
    
    progress.achievements.forEach(achievement => {
      if (achievement.coachId) coachIds.add(achievement.coachId);
      if (achievement.courseId) courseIds.add(achievement.courseId);
    });
    
    const coachDetails = await fetchCoachDetails(Array.from(coachIds));
    const courseDetails = await fetchCourseDetails(Array.from(courseIds));
    
    // 合并成就信息
    const enrichedAchievements = progress.achievements.map(achievement => ({
      ...achievement,
      coach: coachDetails[achievement.coachId] || null,
      course: courseDetails[achievement.courseId] || null
    }));
    
    // 返回结果
    return res.status(200).json({
      achievements: enrichedAchievements,
      count: enrichedAchievements.length
    });
  } catch (error) {
    console.error('获取成就列表时出错:', error);
    return res.status(500).json({ error: '处理请求时出错' });
  }
}

/**
 * 从数据库获取学生训练数据
 * @param {string} studentId - 学生ID
 * @param {string} timeRange - 时间范围 ('week', 'month', 'year', 'all')
 * @returns {Promise<Array>} 训练数据数组
 */
async function fetchStudentTrainingData(studentId, timeRange = 'all') {
  // 这里应该是实际的数据库查询
  // 示例实现:
  try {
    let dateFilter = '';
    const now = new Date();
    
    if (timeRange === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      dateFilter = `AND training_date >= '${weekAgo.toISOString().split('T')[0]}'`;
    } else if (timeRange === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      dateFilter = `AND training_date >= '${monthAgo.toISOString().split('T')[0]}'`;
    } else if (timeRange === 'year') {
      const yearAgo = new Date(now);
      yearAgo.setFullYear(now.getFullYear() - 1);
      dateFilter = `AND training_date >= '${yearAgo.toISOString().split('T')[0]}'`;
    }
    
    const query = `
      SELECT td.id, td.student_id, td.course_id, td.coach_id, td.training_date, 
             td.duration_minutes, td.notes, td.achievements, td.metrics,
             c.category_id, sc.name as category_name
      FROM training_data td
      JOIN courses c ON td.course_id = c.id
      JOIN sport_categories sc ON c.category_id = sc.id
      WHERE td.student_id = ? ${dateFilter}
      ORDER BY td.training_date ASC
    `;
    
    // 模拟数据返回
    return [
      {
        id: "1",
        studentId: studentId,
        courseId: "course1",
        coachId: "coach1",
        trainingDate: "2025-02-01",
        durationMinutes: 60,
        notes: "第一次训练，基础动作练习",
        achievements: ["完成基础动作"],
        metrics: JSON.stringify({
          pushups: 10,
          weight: 70,
          runningDistance: 2
        }),
        categoryId: 6,
        categoryName: "健身"
      },
      {
        id: "2",
        studentId: studentId,
        courseId: "course1",
        coachId: "coach1",
        trainingDate: "2025-02-08",
        durationMinutes: 65,
        notes: "增加了一些强度",
        achievements: ["完成中级动作"],
        metrics: JSON.stringify({
          pushups: 12,
          weight: 69.5,
          runningDistance: 2.2
        }),
        categoryId: 6,
        categoryName: "健身"
      },
      {
        id: "3",
        studentId: studentId,
        courseId: "course2",
        coachId: "coach2",
        trainingDate: "2025-02-15",
        durationMinutes: 70,
        notes: "尝试了新的训练方法",
        achievements: ["完成高级动作"],
        metrics: JSON.stringify({
          pushups: 15,
          weight: 69,
          runningDistance: 2.5
        }),
        categoryId: 6,
        categoryName: "健身"
      },
      {
        id: "4",
        studentId: studentId,
        courseId: "course3",
        coachId: "coach1",
        trainingDate: "2025-02-22",
        durationMinutes: 60,
        notes: "恢复训练",
        achievements: [],
        metrics: JSON.stringify({
          pushups: 14,
          weight: 68.5,
          runningDistance: 2.3
        }),
        categoryId: 6,
        categoryName: "健身"
      },
      {
        id: "5",
        studentId: studentId,
        courseId: "course4",
        coachId: "coach3",
        trainingDate: "2025-03-01",
        durationMinutes: 75,
        notes: "增强训练",
        achievements: ["突破个人记录"],
        metrics: JSON.stringify({
          pushups: 18,
          weight: 68,
          runningDistance: 3
        }),
        categoryId: 6,
        categoryName: "健身"
      },
      {
        id: "6",
        studentId: studentId,
        courseId: "course5",
        coachId: "coach2",
        trainingDate: "2025-03-08",
        durationMinutes: 80,
        notes: "高强度训练",
        achievements: ["完成挑战赛"],
        metrics: JSON.stringify({
          pushups: 20,
          weight: 67.5,
          runningDistance: 3.5
        }),
        categoryId: 6,
        categoryName: "健身"
      }
    ];
  } catch (error) {
    console.error('获取训练数据时出错:', error);
    throw error;
  }
}

/**
 * 获取运动类别详情
 * @param {Array} categoryIds - 类别ID数组
 * @returns {Promise<Object>} 类别详情对象
 */
async function fetchCategoryDetails(categoryIds) {
  // 这里应该是实际的数据库查询
  // 示例实现:
  try {
    const query = `
      SELECT id, name, description, icon_url
      FROM sport_categories
      WHERE id IN (?)
    `;
    
    // 模拟数据返回
    const categories = {
      "1": { name: "足球", description: "足球训练和技巧指导", iconUrl: "/icons/soccer.png" },
      "2": { name: "篮球", description: "篮球训练和技巧指导", iconUrl: "/icons/basketball.png" },
      "3": { name: "网球", description: "网球训练和技巧指导", iconUrl: "/icons/tennis.png" },
      "4": { name: "游泳", description: "游泳训练和技巧指导", iconUrl: "/icons/swimming.png" },
      "5": { name: "瑜伽", description: "瑜伽训练和姿势指导", iconUrl: "/icons/yoga.png" },
      "6": { name: "健身", description: "力量训练和健身指导", iconUrl: "/icons/fitness.png" },
      "7": { name: "跑步", description: "跑步训练和技巧指导", iconUrl: "/icons/running.png" },
      "8": { name: "武术", description: "武术训练和技巧指导", iconUrl: "/icons/martial-arts.png" },
      "9": { name: "舞蹈", description: "舞蹈训练和技巧指导", iconUrl: "/icons/dance.png" },
      "10": { name: "高尔夫", description: "高尔夫训练和技巧指导", iconUrl: "/icons/golf.png" }
    };
    
    const result = {};
    categoryIds.forEach(id => {
      if (categories[id]) {
        result[id] = categories[id];
      }
    });
    
    return result;
  } catch (error) {
    console.error('获取类别详情时出错:', error);
    throw error;
  }
}

/**
 * 获取教练详情
 * @param {Array} coachIds - 教练ID数组
 * @returns {Promise<Object>} 教练详情对象
 */
async function fetchCoachDetails(coachIds) {
  // 这里应该是实际的数据库查询
  // 示例实现:
  try {
    const query = `
      SELECT u.id, u.full_name, u.avatar_url, cp.rating
      FROM users u
      JOIN coach_profiles cp ON u.id = cp.user_id
      WHERE u.id IN (?)
    `;
    
    // 模拟数据返回
    const coaches = {
      "coach1": { fullName: "教练A", avatarUrl: "/avatars/coach1.jpg", rating: 4.9 },
      "coach2": { fullName: "教练B", avatarUrl: "/avatars/coach2.jpg", rating: 4.7 },
      "coach3": { fullName: "教练C", avatarUrl: "/avatars/coach3.jpg", rating: 4.8 }
    };
    
    const result = {};
    coachIds.forEach(id => {
      if (coaches[id]) {
        result[id] = coaches[id];
      }
    });
    
    return result;
  } catch (error) {
    console.error('获取教练详情时出错:', error);
    throw error;
  }
}

/**
 * 获取课程详情
 * @param {Array} courseIds - 课程ID数组
 * @returns {Promise<Object>} 课程详情对象
 */
async function fetchCourseDetails(courseIds) {
  // 这里应该是实际的数据库查询
  // 示例实现:
  try {
    const query = `
      SELECT id, title, description, category_id, difficulty_level
      FROM courses
      WHERE id IN (?)
    `;
    
    // 模拟数据返回
    const courses = {
      "course1": { title: "基础健身", description: "适合初学者的基础健身课程", categoryId: 6, difficultyLevel: "beginner" },
      "course2": { title: "中级健身", description: "提升核心力量的中级健身课程", categoryId: 6, difficultyLevel: "intermediate" },
      "course3": { title: "恢复训练", description: "帮助身体恢复的低强度训练", categoryId: 6, difficultyLevel: "beginner" },
      "course4": { title: "高强度间歇", description: "提高心肺功能的高强度训练", categoryId: 6, difficultyLevel: "advanced" },
      "course5": { title: "挑战赛", description: "测试极限的挑战性训练", categoryId: 6, difficultyLevel: "advanced" }
    };
    
    const result = {};
    courseIds.forEach(id => {
      if (courses[id]) {
        result[id] = courses[id];
      }
    });
    
    return result;
  } catch (error) {
    console.error('获取课程详情时出错:', error);
    throw error;
  }
}

module.exports = {
  getTrainingDataAnalysis,
  getPredictedMetrics,
  getCategoryAnalysis,
  getAchievements
};
