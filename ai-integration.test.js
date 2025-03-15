/**
 * AI功能集成测试
 * 
 * 本测试文件验证所有AI功能能够协同工作，并与平台的其他核心功能正确集成
 */

const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');
const { 
  findBestMatches, 
  generateRecommendations 
} = require('../src/ai/matching/matchingAlgorithm');
const { 
  analyzeTrainingData 
} = require('../src/ai/analysis/trainingDataAnalysis');
const { 
  generateTrainingRecommendations 
} = require('../src/ai/recommendations/trainingRecommendations');
const { 
  processUserQuery 
} = require('../src/ai/chatbot/chatbotEngine');
const { 
  VoiceAssistant 
} = require('../src/ai/voice/voiceRecognition');

describe('AI功能集成测试', () => {
  describe('匹配-预订流程', () => {
    it('应该能够基于匹配结果预订课程', async () => {
      // 准备测试数据
      const studentId = 'test-student-1';
      const studentProfile = {
        id: studentId,
        fitnessLevel: 'intermediate',
        trainingGoals: '增强核心力量，提高耐力',
        preferredCategories: [1, 3, 6]
      };
      
      // 模拟教练数据
      const coaches = [
        {
          id: 'coach1',
          name: '教练A',
          specialties: ['核心训练', '耐力训练'],
          categories: [1, 6],
          rating: 4.8,
          teachingLevel: ['beginner', 'intermediate']
        },
        {
          id: 'coach2',
          name: '教练B',
          specialties: ['力量训练', '健美'],
          categories: [6, 7],
          rating: 4.5,
          teachingLevel: ['intermediate', 'advanced']
        }
      ];
      
      // 模拟课程数据
      const courses = [
        {
          id: 'course1',
          title: '核心力量训练',
          coachId: 'coach1',
          categoryId: 6,
          difficultyLevel: 'intermediate',
          description: '专注于核心肌群的训练课程'
        },
        {
          id: 'course2',
          title: '耐力跑步训练',
          coachId: 'coach1',
          categoryId: 1,
          difficultyLevel: 'intermediate',
          description: '提高跑步耐力的专业课程'
        }
      ];
      
      // 1. 使用匹配算法获取推荐
      const matches = findBestMatches(studentProfile, coaches, 2);
      expect(matches).to.be.an('array');
      expect(matches.length).to.be.above(0);
      
      const recommendations = generateRecommendations(studentProfile, coaches, courses);
      expect(recommendations).to.be.an('object');
      expect(recommendations.coaches).to.be.an('array');
      expect(recommendations.courses).to.be.an('array');
      
      // 2. 选择推荐的课程进行预订
      const courseToBook = recommendations.courses[0];
      expect(courseToBook).to.be.an('object');
      expect(courseToBook.id).to.be.a('string');
      
      // 3. 调用预订API
      const bookingData = {
        studentId: studentId,
        courseId: courseToBook.id,
        date: '2025-04-01',
        time: '10:00',
        duration: 60
      };
      
      // 模拟API调用
      const response = await request(app)
        .post('/api/bookings')
        .send(bookingData)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);
      
      // 验证预订结果
      expect(response.body).to.be.an('object');
      expect(response.body.id).to.be.a('string');
      expect(response.body.studentId).to.equal(studentId);
      expect(response.body.courseId).to.equal(courseToBook.id);
      expect(response.body.status).to.equal('confirmed');
    });
  });
  
  describe('分析-建议流程', () => {
    it('应该能够基于训练数据分析生成个性化建议', async () => {
      // 准备测试数据
      const studentId = 'test-student-2';
      const studentProfile = {
        id: studentId,
        fullName: "学生A",
        fitnessLevel: "intermediate",
        trainingGoals: "增强核心力量，提高耐力，减轻体重",
        preferredCategories: [1, 3, 6],
        healthInfo: "无特殊健康问题"
      };
      
      // 模拟训练数据
      const trainingData = [
        {
          id: "1",
          studentId: studentId,
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
          studentId: studentId,
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
          studentId: studentId,
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
      
      // 模拟可用课程
      const availableCourses = [
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
        }
      ];
      
      // 1. 分析训练数据
      const analysis = analyzeTrainingData(trainingData);
      expect(analysis).to.be.an('object');
      expect(analysis.totalSessions).to.equal(3);
      expect(analysis.trends).to.be.an('object');
      
      // 2. 基于分析生成建议
      const recommendations = generateTrainingRecommendations(studentProfile, trainingData, availableCourses);
      expect(recommendations).to.be.an('object');
      expect(recommendations.summary).to.be.a('string');
      expect(recommendations.nextSteps).to.be.an('array');
      expect(recommendations.suggestedCourses).to.be.an('array');
      
      // 3. 调用API保存建议
      const response = await request(app)
        .post('/api/students/' + studentId + '/recommendations')
        .send(recommendations)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);
      
      // 验证保存结果
      expect(response.body).to.be.an('object');
      expect(response.body.id).to.be.a('string');
      expect(response.body.studentId).to.equal(studentId);
      expect(response.body.createdAt).to.be.a('string');
      
      // 4. 获取保存的建议
      const getResponse = await request(app)
        .get('/api/students/' + studentId + '/recommendations')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
      
      // 验证获取结果
      expect(getResponse.body).to.be.an('array');
      expect(getResponse.body.length).to.be.above(0);
      expect(getResponse.body[0].studentId).to.equal(studentId);
    });
  });
  
  describe('客服-语音集成', () => {
    it('应该能够通过语音识别与智能客服交互', async () => {
      // 准备测试数据
      const sessionId = 'test-session-1';
      const userContext = {
        isLoggedIn: true,
        userId: "user1",
        userName: "测试用户",
        userType: "student"
      };
      
      // 1. 创建语音助手实例
      const assistant = new VoiceAssistant({
        language: 'zh-CN',
        autoRestart: false,
        continuous: false
      });
      
      // 初始化语音助手
      const initialized = await assistant.initialize();
      expect(initialized).to.be.true;
      
      // 2. 模拟语音识别结果
      const query = "如何预订课程？";
      
      // 3. 使用智能客服处理查询
      const response = processUserQuery(query, userContext);
      expect(response).to.be.an('object');
      expect(response.answer).to.be.a('string');
      expect(response.answer.length).to.be.above(0);
      expect(response.intent).to.be.a('string');
      
      // 4. 使用语音合成播放回答
      const spoken = await assistant.respond(response.answer);
      expect(spoken).to.be.true;
      
      // 5. 调用API保存对话历史
      const conversationData = {
        sessionId: sessionId,
        query: query,
        response: response.answer,
        intent: response.intent,
        timestamp: new Date().toISOString()
      };
      
      const apiResponse = await request(app)
        .post('/api/chat/history')
        .send(conversationData)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);
      
      // 验证保存结果
      expect(apiResponse.body).to.be.an('object');
      expect(apiResponse.body.id).to.be.a('string');
      expect(apiResponse.body.sessionId).to.equal(sessionId);
      expect(apiResponse.body.query).to.equal(query);
    });
  });
  
  describe('全流程测试', () => {
    it('应该能够完成从注册到训练的完整流程', async () => {
      // 准备测试数据
      const userData = {
        email: `test-${Date.now()}@example.com`,
        password: 'Password123!',
        fullName: '测试用户',
        userType: 'student'
      };
      
      // 1. 用户注册
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);
      
      expect(registerResponse.body).to.be.an('object');
      expect(registerResponse.body.id).to.be.a('string');
      expect(registerResponse.body.token).to.be.a('string');
      
      const userId = registerResponse.body.id;
      const token = registerResponse.body.token;
      
      // 2. 完善用户资料
      const profileData = {
        fitnessLevel: 'beginner',
        trainingGoals: '增强体能，减轻体重',
        preferredCategories: [1, 6],
        healthInfo: '无特殊健康问题'
      };
      
      const profileResponse = await request(app)
        .put('/api/students/' + userId + '/profile')
        .send(profileData)
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(profileResponse.body).to.be.an('object');
      expect(profileResponse.body.id).to.equal(userId);
      
      // 3. 获取课程推荐
      const recommendationsResponse = await request(app)
        .get('/api/students/' + userId + '/course-recommendations')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(recommendationsResponse.body).to.be.an('object');
      expect(recommendationsResponse.body.courses).to.be.an('array');
      expect(recommendationsResponse.body.coaches).to.be.an('array');
      
      // 选择一个推荐的课程
      const courseToBook = recommendationsResponse.body.courses[0];
      expect(courseToBook).to.be.an('object');
      expect(courseToBook.id).to.be.a('string');
      
      // 4. 预订课程
      const bookingData = {
        courseId: courseToBook.id,
        date: '2025-04-01',
        time: '10:00',
        duration: 60
      };
      
      const bookingResponse = await request(app)
        .post('/api/bookings')
        .send(bookingData)
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);
      
      expect(bookingResponse.body).to.be.an('object');
      expect(bookingResponse.body.id).to.be.a('string');
      expect(bookingResponse.body.status).to.equal('confirmed');
      
      const bookingId = bookingResponse.body.id;
      
      // 5. 记录训练数据
      const trainingData = {
        bookingId: bookingId,
        durationMinutes: 65,
        metrics: {
          pushups: 8,
          weight: 75,
          runningDistance: 1.5
        },
        notes: '第一次训练，感觉良好'
      };
      
      const trainingResponse = await request(app)
        .post('/api/training-records')
        .send(trainingData)
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);
      
      expect(trainingResponse.body).to.be.an('object');
      expect(trainingResponse.body.id).to.be.a('string');
      expect(trainingResponse.body.studentId).to.equal(userId);
      
      // 6. 获取训练分析和建议
      const analysisResponse = await request(app)
        .get('/api/students/' + userId + '/training-analysis')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(analysisResponse.body).to.be.an('object');
      expect(analysisResponse.body.analysis).to.be.an('object');
      expect(analysisResponse.body.recommendations).to.be.an('object');
    });
  });
});
