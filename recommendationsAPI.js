/**
 * 个性化训练建议API接口
 * 
 * 该模块提供了与前端交互的API接口，用于处理个性化训练建议请求
 */

const { 
  generateTrainingRecommendations, 
  generateBasicRecommendations 
} = require('./trainingRecommendations');
const { analyzeTrainingData } = require('../analysis/trainingDataAnalysis');

/**
 * 处理获取个性化训练建议的API请求
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
async function getPersonalizedRecommendations(req, res) {
  try {
    const { studentId } = req.query;
    
    // 从数据库获取学生资料
    const studentProfile = await fetchStudentProfile(studentId);
    if (!studentProfile) {
      return res.status(404).json({ error: '未找到学生资料' });
    }
    
    // 获取学生训练数据
    const trainingData = await fetchStudentTrainingData(studentId);
    
    // 获取可用课程
    const availableCourses = await fetchAvailableCourses(studentProfile);
    
    // 生成个性化建议
    let recommendations;
    if (trainingData && trainingData.length > 0) {
      // 分析训练数据
      const analysis = analyzeTrainingData(trainingData);
      
      // 生成基于训练历史的建议
      recommendations = generateTrainingRecommendations(
        studentProfile, trainingData, availableCourses
      );
    } else {
      // 生成基础建议
      recommendations = generateBasicRecommendations(
        studentProfile, availableCourses
      );
    }
    
    // 返回结果
    return res.status(200).json({
      recommendations,
      studentProfile: {
        id: studentProfile.id,
        fullName: studentProfile.fullName,
        fitnessLevel: studentProfile.fitnessLevel
      },
      dataPoints: trainingData ? trainingData.length : 0
    });
  } catch (error) {
    console.error('生成个性化建议时出错:', error);
    return res.status(500).json({ error: '处理请求时出错' });
  }
}

/**
 * 处理获取每周训练计划的API请求
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
async function getWeeklyTrainingPlan(req, res) {
  try {
    const { studentId } = req.query;
    
    // 从数据库获取学生资料
    const studentProfile = await fetchStudentProfile(studentId);
    if (!studentProfile) {
      return res.status(404).json({ error: '未找到学生资料' });
    }
    
    // 获取学生训练数据
    const trainingData = await fetchStudentTrainingData(studentId);
    
    // 获取可用课程
    const availableCourses = await fetchAvailableCourses(studentProfile);
    
    // 生成每周计划
    let weeklyPlan;
    if (trainingData && trainingData.length > 0) {
      // 分析训练数据
      const analysis = analyzeTrainingData(trainingData);
      
      // 生成基于训练历史的每周计划
      const recommendations = generateTrainingRecommendations(
        studentProfile, trainingData, availableCourses
      );
      weeklyPlan = recommendations.weeklyPlan;
    } else {
      // 生成基础建议
      const recommendations = generateBasicRecommendations(
        studentProfile, availableCourses
      );
      weeklyPlan = recommendations.weeklyPlan;
    }
    
    // 获取教练详情
    const coachIds = new Set();
    weeklyPlan.forEach(session => {
      if (session.course && session.course.coachId) {
        coachIds.add(session.course.coachId);
      }
    });
    
    const coachDetails = await fetchCoachDetails(Array.from(coachIds));
    
    // 合并教练信息
    const enrichedPlan = weeklyPlan.map(session => ({
      ...session,
      coach: session.course && session.course.coachId ? 
        coachDetails[session.course.coachId] : null
    }));
    
    // 返回结果
    return res.status(200).json({
      weeklyPlan: enrichedPlan,
      studentName: studentProfile.fullName,
      fitnessLevel: studentProfile.fitnessLevel
    });
  } catch (error) {
    console.error('生成每周训练计划时出错:', error);
    return res.status(500).json({ error: '处理请求时出错' });
  }
}

/**
 * 处理获取改进领域的API请求
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
async function getImprovementAreas(req, res) {
  try {
    const { studentId } = req.query;
    
    // 从数据库获取学生资料
    const studentProfile = await fetchStudentProfile(studentId);
    if (!studentProfile) {
      return res.status(404).json({ error: '未找到学生资料' });
    }
    
    // 获取学生训练数据
    const trainingData = await fetchStudentTrainingData(studentId);
    
    if (!trainingData || trainingData.length === 0) {
      return res.status(200).json({
        improvementAreas: [],
        message: '没有足够的训练数据来识别改进领域'
      });
    }
    
    // 分析训练数据
    const analysis = analyzeTrainingData(trainingData);
    
    // 识别改进领域
    const improvementAreas = identifyImprovementAreas(analysis);
    
    // 返回结果
    return res.status(200).json({
      improvementAreas,
      count: improvementAreas.length
    });
  } catch (error) {
    console.error('识别改进领域时出错:', error);
    return res.status(500).json({ error: '处理请求时出错' });
  }
}

/**
 * 处理获取长期目标的API请求
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
async function getLongTermGoals(req, res) {
  try {
    const { studentId } = req.query;
    
    // 从数据库获取学生资料
    const studentProfile = await fetchStudentProfile(studentId);
    if (!studentProfile) {
      return res.status(404).json({ error: '未找到学生资料' });
    }
    
    // 获取学生训练数据
    const trainingData = await fetchStudentTrainingData(studentId);
    
    // 生成长期目标
    let longTermGoals;
    if (trainingData && trainingData.length > 0) {
      // 分析训练数据
      const analysis = analyzeTrainingData(trainingData);
      
      // 生成基于训练历史的长期目标
      longTermGoals = suggestLongTermGoals(studentProfile, analysis);
    } else {
      // 生成基础长期目标
      longTermGoals = suggestBasicLongTermGoals(
        studentProfile.fitnessLevel, 
        studentProfile.trainingGoals
      );
    }
    
    // 返回结果
    return res.status(200).json({
      longTermGoals,
      count: longTermGoals.length
    });
  } catch (error) {
    console.error('生成长期目标时出错:', error);
    return res.status(500).json({ error: '处理请求时出错' });
  }
}

/**
 * 从数据库获取学生资料
 * @param {string} studentId - 学生ID
 * @returns {Promise<Object>} 学生资料
 */
async function fetchStudentProfile(studentId) {
  // 这里应该是实际的数据库查询
  // 示例实现:
  try {
    // 查询用户基本信息
    const userQuery = `
      SELECT u.id, u.full_name, u.email, u.avatar_url
      FROM users u
      WHERE u.id = ? AND u.user_type = 'student'
    `;
    
    // 查询学生详细资料
    const profileQuery = `
      SELECT sp.fitness_level, sp.health_info, sp.training_goals, sp.date_of_birth
      FROM student_profiles sp
      WHERE sp.user_id = ?
    `;
    
    // 查询学生偏好的运动类别
    const categoriesQuery = `
      SELECT cb.category_id
      FROM course_bookings cb
      JOIN courses c ON cb.course_id = c.id
      WHERE cb.student_id = ?
      GROUP BY c.category_id
    `;
    
    // 模拟数据返回
    return {
      id: studentId,
      fullName: "学生姓名",
      fitnessLevel: "intermediate",
      trainingGoals: "增强核心力量，提高耐力，减轻体重",
      preferredCategories: [1, 3, 6], // 运动类别ID
      healthInfo: "无特殊健康问题"
    };
  } catch (error) {
    console.error('获取学生资料时出错:', error);
    throw error;
  }
}

/**
 * 从数据库获取学生训练数据
 * @param {string} studentId - 学生ID
 * @returns {Promise<Array>} 训练数据数组
 */
async function fetchStudentTrainingData(studentId) {
  // 这里应该是实际的数据库查询
  // 示例实现:
  try {
    const query = `
      SELECT td.id, td.student_id, td.course_id, td.coach_id, td.training_date, 
             td.duration_minutes, td.notes, td.achievements, td.metrics,
             c.category_id, sc.name as category_name
      FROM training_data td
      JOIN courses c ON td.course_id = c.id
      JOIN sport_categories sc ON c.category_id = sc.id
      WHERE td.student_id = ?
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
 * 获取可用课程
 * @param {Object} studentProfile - 学生资料
 * @returns {Promise<Array>} 可用课程列表
 */
async function fetchAvailableCourses(studentProfile) {
  // 这里应该是实际的数据库查询
  // 示例实现:
  try {
    const query = `
      SELECT c.id, c.coach_id, c.title, c.description, c.category_id, 
             c.difficulty_level, c.max_students, c.price,
             u.full_name as coach_name, cp.rating as coach_rating
      FROM courses c
      JOIN coach_profiles cp ON c.coach_id = cp.id
      JOIN users u ON cp.user_id = u.id
      WHERE c.status = 'active'
      AND c.start_time > CURRENT_TIMESTAMP
      ORDER BY c.start_time ASC
    `;
    
    // 模拟数据返回
    return [
      {
        id: "course1",
        coachId: "coach1",
        title: "基础健身",
        description: "适合初学者的基础健身课程",
        categoryId: 6,
        difficultyLevel: "beginner",
        maxStudents: 10,
        price: 100,
        coachName: "教练A",
        coachRating: 4.9
      },
      {
        id: "course2",
        coachId: "coach2",
        title: "中级健身",
        description: "提升核心力量的中级健身课程",
        categoryId: 6,
        difficultyLevel: "intermediate",
        maxStudents: 8,
        price: 150,
        coachName: "教练B",
        coachRating: 4.7
      },
      {
        id: "course3",
        coachId: "coach1",
        title: "恢复训练",
        description: "帮助身体恢复的低强度训练",
        categoryId: 6,
        difficultyLevel: "beginner",
        maxStudents: 12,
        price: 80,
        coachName: "教练A",
        coachRating: 4.9
      },
      {
        id: "course4",
        coachId: "coach3",
        title: "高强度间歇",
        description: "提高心肺功能的高强度训练",
        categoryId: 6,
        difficultyLevel: "advanced",
        maxStudents: 6,
        price: 200,
        coachName: "教练C",
        coachRating: 4.8
      },
      {
        id: "course5",
        coachId: "coach2",
        title: "挑战赛",
        description: "测试极限的挑战性训练",
        categoryId: 6,
        difficultyLevel: "advanced",
        maxStudents: 5,
        price: 250,
        coachName: "教练B",
        coachRating: 4.7
      },
      {
        id: "course6",
        coachId: "coach4",
        title: "初级瑜伽",
        description: "适合初学者的瑜伽课程",
        categoryId: 5,
        difficultyLevel: "beginner",
        maxStudents: 15,
        price: 120,
        coachName: "教练D",
        coachRating: 4.6
      },
      {
        id: "course7",
        coachId: "coach5",
        title: "足球技巧",
        description: "足球基本技巧训练",
        categoryId: 1,
        difficultyLevel: "intermediate",
        maxStudents: 20,
        price: 150,
        coachName: "教练E",
        coachRating: 4.8
      }
    ];
  } catch (error) {
    console.error('获取可用课程时出错:', error);
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
      "coach3": { fullName: "教练C", avatarUrl: "/avatars/coach3.jpg", rating: 4.8 },
      "coach4": { fullName: "教练D", avatarUrl: "/avatars/coach4.jpg", rating: 4.6 },
      "coach5": { fullName: "教练E", avatarUrl: "/avatars/coach5.jpg", rating: 4.8 }
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

// 导入需要的函数
const { 
  identifyImprovementAreas, 
  suggestLongTermGoals, 
  suggestBasicLongTermGoals 
} = require('./trainingRecommendations');

module.exports = {
  getPersonalizedRecommendations,
  getWeeklyTrainingPlan,
  getImprovementAreas,
  getLongTermGoals
};
