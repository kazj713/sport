/**
 * 智能匹配算法API接口
 * 
 * 该模块提供了与前端交互的API接口，用于处理智能匹配请求
 */

const { 
  recommendCoaches, 
  recommendStudents, 
  recommendStudentsForCourse 
} = require('./matchingAlgorithm');

/**
 * 处理获取推荐教练的API请求
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
async function getRecommendedCoaches(req, res) {
  try {
    const { studentId, limit = 5 } = req.query;
    
    // 从数据库获取学生信息
    const student = await fetchStudentProfile(studentId);
    if (!student) {
      return res.status(404).json({ error: '未找到学生资料' });
    }
    
    // 获取所有教练
    const coaches = await fetchAllCoaches();
    
    // 获取运动类别
    const sportCategories = await fetchSportCategories();
    
    // 计算推荐结果
    const recommendations = recommendCoaches(student, coaches, sportCategories, parseInt(limit));
    
    // 返回结果
    return res.status(200).json({ recommendations });
  } catch (error) {
    console.error('推荐教练时出错:', error);
    return res.status(500).json({ error: '处理请求时出错' });
  }
}

/**
 * 处理获取推荐学生的API请求
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
async function getRecommendedStudents(req, res) {
  try {
    const { coachId, limit = 5 } = req.query;
    
    // 从数据库获取教练信息
    const coach = await fetchCoachProfile(coachId);
    if (!coach) {
      return res.status(404).json({ error: '未找到教练资料' });
    }
    
    // 获取所有学生
    const students = await fetchAllStudents();
    
    // 获取运动类别
    const sportCategories = await fetchSportCategories();
    
    // 计算推荐结果
    const recommendations = recommendStudents(coach, students, sportCategories, parseInt(limit));
    
    // 返回结果
    return res.status(200).json({ recommendations });
  } catch (error) {
    console.error('推荐学生时出错:', error);
    return res.status(500).json({ error: '处理请求时出错' });
  }
}

/**
 * 处理获取课程推荐学生的API请求
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
async function getRecommendedStudentsForCourse(req, res) {
  try {
    const { courseId, limit = 10 } = req.query;
    
    // 从数据库获取课程信息
    const course = await fetchCourseDetails(courseId);
    if (!course) {
      return res.status(404).json({ error: '未找到课程信息' });
    }
    
    // 获取教练信息
    const coach = await fetchCoachProfile(course.coachId);
    if (!coach) {
      return res.status(404).json({ error: '未找到教练资料' });
    }
    
    // 获取所有学生
    const students = await fetchAllStudents();
    
    // 获取运动类别
    const sportCategories = await fetchSportCategories();
    
    // 计算推荐结果
    const recommendations = recommendStudentsForCourse(
      course, coach, students, sportCategories, parseInt(limit)
    );
    
    // 返回结果
    return res.status(200).json({ recommendations });
  } catch (error) {
    console.error('为课程推荐学生时出错:', error);
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
      trainingGoals: "增强核心力量，提高耐力",
      preferredCategories: [1, 3, 6], // 运动类别ID
      healthInfo: "无特殊健康问题"
    };
  } catch (error) {
    console.error('获取学生资料时出错:', error);
    throw error;
  }
}

/**
 * 从数据库获取教练资料
 * @param {string} coachId - 教练ID
 * @returns {Promise<Object>} 教练资料
 */
async function fetchCoachProfile(coachId) {
  // 这里应该是实际的数据库查询
  // 示例实现:
  try {
    // 查询用户基本信息
    const userQuery = `
      SELECT u.id, u.full_name, u.email, u.avatar_url
      FROM users u
      WHERE u.id = ? AND u.user_type = 'coach'
    `;
    
    // 查询教练详细资料
    const profileQuery = `
      SELECT cp.bio, cp.years_of_experience, cp.hourly_rate, cp.rating, cp.total_reviews
      FROM coach_profiles cp
      WHERE cp.user_id = ?
    `;
    
    // 查询教练专长
    const specialtiesQuery = `
      SELECT cs.category_id, cs.specialty_detail, cs.experience_years
      FROM coach_specialties cs
      WHERE cs.coach_id = ?
    `;
    
    // 模拟数据返回
    return {
      id: coachId,
      fullName: "教练姓名",
      bio: "专业健身教练，擅长力量训练和有氧运动",
      yearsOfExperience: 5,
      rating: 4.8,
      hourlyRate: 200,
      specialties: [
        { categoryId: 1, detail: "足球训练", experienceYears: 5 },
        { categoryId: 6, detail: "健身指导", experienceYears: 7 }
      ]
    };
  } catch (error) {
    console.error('获取教练资料时出错:', error);
    throw error;
  }
}

/**
 * 从数据库获取课程详情
 * @param {string} courseId - 课程ID
 * @returns {Promise<Object>} 课程详情
 */
async function fetchCourseDetails(courseId) {
  // 这里应该是实际的数据库查询
  // 示例实现:
  try {
    const query = `
      SELECT c.id, c.coach_id, c.title, c.description, c.category_id, 
             c.difficulty_level, c.max_students, c.price
      FROM courses c
      WHERE c.id = ?
    `;
    
    // 模拟数据返回
    return {
      id: courseId,
      coachId: "coach123",
      title: "高强度间歇训练",
      description: "适合想要快速提高心肺功能的学员",
      categoryId: 6, // 健身
      difficultyLevel: "intermediate",
      maxStudents: 10,
      price: 150
    };
  } catch (error) {
    console.error('获取课程详情时出错:', error);
    throw error;
  }
}

/**
 * 从数据库获取所有教练
 * @returns {Promise<Array>} 教练列表
 */
async function fetchAllCoaches() {
  // 这里应该是实际的数据库查询
  // 示例实现:
  try {
    // 模拟数据返回
    return [
      {
        id: "coach1",
        fullName: "教练A",
        bio: "专业足球教练，前国家队队员",
        yearsOfExperience: 10,
        rating: 4.9,
        hourlyRate: 300,
        specialties: [
          { categoryId: 1, detail: "足球训练", experienceYears: 10 }
        ]
      },
      {
        id: "coach2",
        fullName: "教练B",
        bio: "专业健身教练，擅长力量训练",
        yearsOfExperience: 5,
        rating: 4.7,
        hourlyRate: 200,
        specialties: [
          { categoryId: 6, detail: "健身指导", experienceYears: 5 }
        ]
      },
      {
        id: "coach3",
        fullName: "教练C",
        bio: "瑜伽导师，专注于身心平衡",
        yearsOfExperience: 8,
        rating: 4.8,
        hourlyRate: 250,
        specialties: [
          { categoryId: 5, detail: "瑜伽指导", experienceYears: 8 }
        ]
      }
    ];
  } catch (error) {
    console.error('获取所有教练时出错:', error);
    throw error;
  }
}

/**
 * 从数据库获取所有学生
 * @returns {Promise<Array>} 学生列表
 */
async function fetchAllStudents() {
  // 这里应该是实际的数据库查询
  // 示例实现:
  try {
    // 模拟数据返回
    return [
      {
        id: "student1",
        fullName: "学生A",
        fitnessLevel: "beginner",
        trainingGoals: "学习基本足球技巧",
        preferredCategories: [1], // 足球
        healthInfo: "无特殊健康问题"
      },
      {
        id: "student2",
        fullName: "学生B",
        fitnessLevel: "intermediate",
        trainingGoals: "增强核心力量，提高耐力",
        preferredCategories: [6], // 健身
        healthInfo: "轻微膝盖问题"
      },
      {
        id: "student3",
        fullName: "学生C",
        fitnessLevel: "advanced",
        trainingGoals: "提高瑜伽技巧，增强柔韧性",
        preferredCategories: [5], // 瑜伽
        healthInfo: "无特殊健康问题"
      }
    ];
  } catch (error) {
    console.error('获取所有学生时出错:', error);
    throw error;
  }
}

/**
 * 从数据库获取所有运动类别
 * @returns {Promise<Array>} 运动类别列表
 */
async function fetchSportCategories() {
  // 这里应该是实际的数据库查询
  // 示例实现:
  try {
    const query = `SELECT id, name, description FROM sport_categories`;
    
    // 模拟数据返回
    return [
      { id: 1, name: "足球", description: "足球训练和技巧指导" },
      { id: 2, name: "篮球", description: "篮球训练和技巧指导" },
      { id: 3, name: "网球", description: "网球训练和技巧指导" },
      { id: 4, name: "游泳", description: "游泳训练和技巧指导" },
      { id: 5, name: "瑜伽", description: "瑜伽训练和姿势指导" },
      { id: 6, name: "健身", description: "力量训练和健身指导" },
      { id: 7, name: "跑步", description: "跑步训练和技巧指导" },
      { id: 8, name: "武术", description: "武术训练和技巧指导" },
      { id: 9, name: "舞蹈", description: "舞蹈训练和技巧指导" },
      { id: 10, name: "高尔夫", description: "高尔夫训练和技巧指导" }
    ];
  } catch (error) {
    console.error('获取运动类别时出错:', error);
    throw error;
  }
}

module.exports = {
  getRecommendedCoaches,
  getRecommendedStudents,
  getRecommendedStudentsForCourse
};
