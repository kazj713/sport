/**
 * 数据库集成测试
 * 
 * 本测试文件验证应用能够正确与数据库交互，包括读取、写入和更新操作
 */

const { expect } = require('chai');
const { Pool } = require('pg');
const { 
  saveMatchingResults,
  saveTrainingAnalysis,
  saveRecommendations,
  saveChatHistory,
  getStudentTrainingData
} = require('../src/database/aiDataRepository');

describe('数据库集成测试', () => {
  let pool;
  let client;
  
  before(async () => {
    // 创建数据库连接池
    pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'sportcoach_test',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres'
    });
    
    // 获取客户端连接
    client = await pool.connect();
    
    // 设置测试数据
    await setupTestData();
  });
  
  after(async () => {
    // 清理测试数据
    await cleanupTestData();
    
    // 释放客户端连接
    if (client) {
      client.release();
    }
    
    // 关闭连接池
    if (pool) {
      await pool.end();
    }
  });
  
  async function setupTestData() {
    // 创建测试用户
    await client.query(`
      INSERT INTO users (id, email, full_name, user_type, created_at)
      VALUES 
        ('test-student-1', 'test-student-1@example.com', '测试学生1', 'student', NOW()),
        ('test-coach-1', 'test-coach-1@example.com', '测试教练1', 'coach', NOW())
      ON CONFLICT (id) DO NOTHING
    `);
    
    // 创建测试课程
    await client.query(`
      INSERT INTO courses (id, coach_id, title, description, category_id, difficulty_level, max_students, price)
      VALUES 
        ('test-course-1', 'test-coach-1', '测试课程1', '测试课程描述', 6, 'intermediate', 10, 100)
      ON CONFLICT (id) DO NOTHING
    `);
  }
  
  async function cleanupTestData() {
    // 删除测试数据
    await client.query(`DELETE FROM chat_history WHERE session_id LIKE 'test-%'`);
    await client.query(`DELETE FROM training_recommendations WHERE student_id LIKE 'test-%'`);
    await client.query(`DELETE FROM training_analysis WHERE student_id LIKE 'test-%'`);
    await client.query(`DELETE FROM matching_results WHERE student_id LIKE 'test-%'`);
    await client.query(`DELETE FROM training_records WHERE student_id LIKE 'test-%'`);
    await client.query(`DELETE FROM bookings WHERE student_id LIKE 'test-%'`);
    await client.query(`DELETE FROM courses WHERE id LIKE 'test-%'`);
    await client.query(`DELETE FROM users WHERE id LIKE 'test-%'`);
  }
  
  describe('AI数据存储测试', () => {
    it('应该能够保存匹配结果', async () => {
      // 准备测试数据
      const studentId = 'test-student-1';
      const matchingResults = {
        coaches: [
          {
            id: 'test-coach-1',
            name: '测试教练1',
            matchScore: 0.92
          }
        ],
        courses: [
          {
            id: 'test-course-1',
            title: '测试课程1',
            matchScore: 0.90
          }
        ],
        timestamp: new Date().toISOString()
      };
      
      // 执行测试
      const result = await saveMatchingResults(studentId, matchingResults);
      
      // 验证结果
      expect(result).to.be.an('object');
      expect(result.id).to.be.a('string');
      expect(result.student_id).to.equal(studentId);
      
      // 验证数据库中的数据
      const dbResult = await client.query(
        'SELECT * FROM matching_results WHERE student_id = $1 ORDER BY created_at DESC LIMIT 1',
        [studentId]
      );
      
      expect(dbResult.rows.length).to.equal(1);
      expect(dbResult.rows[0].data).to.be.an('object');
      expect(dbResult.rows[0].data.coaches.length).to.equal(1);
      expect(dbResult.rows[0].data.coaches[0].id).to.equal('test-coach-1');
    });
    
    it('应该能够保存训练数据分析', async () => {
      // 准备测试数据
      const studentId = 'test-student-1';
      const analysisData = {
        totalSessions: 10,
        totalDuration: 650,
        averageDuration: 65,
        trends: {
          durationTrend: { direction: 'increasing', changePercent: 8 }
        },
        progress: {
          metrics: {
            pushups: { values: [10, 12, 15, 18, 20] }
          }
        }
      };
      
      // 执行测试
      const result = await saveTrainingAnalysis(studentId, analysisData);
      
      // 验证结果
      expect(result).to.be.an('object');
      expect(result.id).to.be.a('string');
      expect(result.student_id).to.equal(studentId);
      
      // 验证数据库中的数据
      const dbResult = await client.query(
        'SELECT * FROM training_analysis WHERE student_id = $1 ORDER BY created_at DESC LIMIT 1',
        [studentId]
      );
      
      expect(dbResult.rows.length).to.equal(1);
      expect(dbResult.rows[0].data).to.be.an('object');
      expect(dbResult.rows[0].data.totalSessions).to.equal(10);
    });
    
    it('应该能够保存训练建议', async () => {
      // 准备测试数据
      const studentId = 'test-student-1';
      const recommendationsData = {
        summary: '您在过去两个月完成了10次训练，总时长650分钟，平均每次65分钟。',
        nextSteps: [
          '增加训练频率至每周3-4次',
          '尝试加入高强度间歇训练'
        ],
        suggestedCourses: [
          { id: 'test-course-1', title: '测试课程1' }
        ]
      };
      
      // 执行测试
      const result = await saveRecommendations(studentId, recommendationsData);
      
      // 验证结果
      expect(result).to.be.an('object');
      expect(result.id).to.be.a('string');
      expect(result.student_id).to.equal(studentId);
      
      // 验证数据库中的数据
      const dbResult = await client.query(
        'SELECT * FROM training_recommendations WHERE student_id = $1 ORDER BY created_at DESC LIMIT 1',
        [studentId]
      );
      
      expect(dbResult.rows.length).to.equal(1);
      expect(dbResult.rows[0].data).to.be.an('object');
      expect(dbResult.rows[0].data.nextSteps.length).to.equal(2);
    });
    
    it('应该能够保存聊天历史', async () => {
      // 准备测试数据
      const sessionId = 'test-session-1';
      const chatData = {
        query: '如何预订课程？',
        response: '您可以在"课程"页面浏览所有可用课程，选择心仪的课程后点击"预订"按钮，然后选择日期和时间完成预订。',
        intent: 'booking_inquiry',
        confidence: 0.95,
        userId: 'test-student-1'
      };
      
      // 执行测试
      const result = await saveChatHistory(sessionId, chatData);
      
      // 验证结果
      expect(result).to.be.an('object');
      expect(result.id).to.be.a('string');
      expect(result.session_id).to.equal(sessionId);
      
      // 验证数据库中的数据
      const dbResult = await client.query(
        'SELECT * FROM chat_history WHERE session_id = $1 ORDER BY created_at DESC LIMIT 1',
        [sessionId]
      );
      
      expect(dbResult.rows.length).to.equal(1);
      expect(dbResult.rows[0].user_query).to.equal('如何预订课程？');
      expect(dbResult.rows[0].system_response).to.include('预订');
    });
  });
  
  describe('训练数据检索测试', () => {
    before(async () => {
      // 插入测试训练记录
      await client.query(`
        INSERT INTO training_records (id, student_id, course_id, training_date, duration_minutes, metrics, category_id)
        VALUES 
          ('test-record-1', 'test-student-1', 'test-course-1', '2025-02-01', 60, '{"pushups": 10, "weight": 70}', 6),
          ('test-record-2', 'test-student-1', 'test-course-1', '2025-02-08', 65, '{"pushups": 12, "weight": 69}', 6),
          ('test-record-3', 'test-student-1', 'test-course-1', '2025-02-15', 70, '{"pushups": 15, "weight": 68}', 6)
      `);
    });
    
    it('应该能够检索学生训练数据', async () => {
      // 准备测试数据
      const studentId = 'test-student-1';
      
      // 执行测试
      const result = await getStudentTrainingData(studentId);
      
      // 验证结果
      expect(result).to.be.an('array');
      expect(result.length).to.equal(3);
      expect(result[0].student_id).to.equal(studentId);
      expect(result[0].metrics).to.be.an('object');
      expect(result[0].metrics.pushups).to.be.a('number');
    });
    
    it('应该能够按日期范围检索训练数据', async () => {
      // 准备测试数据
      const studentId = 'test-student-1';
      const startDate = '2025-02-05';
      const endDate = '2025-02-20';
      
      // 执行测试
      const result = await getStudentTrainingData(studentId, startDate, endDate);
      
      // 验证结果
      expect(result).to.be.an('array');
      expect(result.length).to.equal(2); // 只有2条记录在日期范围内
      
      // 验证日期在范围内
      result.forEach(record => {
        const recordDate = new Date(record.training_date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        expect(recordDate >= start && recordDate <= end).to.be.true;
      });
    });
  });
  
  describe('事务处理测试', () => {
    it('应该在事务中正确处理多表操作', async () => {
      // 开始事务
      await client.query('BEGIN');
      
      try {
        // 插入预订记录
        const bookingResult = await client.query(`
          INSERT INTO bookings (id, student_id, course_id, booking_date, booking_time, duration, status)
          VALUES ('test-booking-1', 'test-student-1', 'test-course-1', '2025-04-01', '10:00', 60, 'confirmed')
          RETURNING id
        `);
        
        const bookingId = bookingResult.rows[0].id;
        
        // 插入训练记录
        await client.query(`
          INSERT INTO training_records (id, student_id, course_id, booking_id, training_date, duration_minutes, metrics, category_id)
          VALUES ('test-record-tx', 'test-student-1', 'test-course-1', $1, '2025-04-01', 60, '{"pushups": 20, "weight": 67}', 6)
        `, [bookingId]);
        
        // 更新课程可用名额
        await client.query(`
          UPDATE courses
          SET available_slots = available_slots - 1
          WHERE id = 'test-course-1'
        `);
        
        // 提交事务
        await client.query('COMMIT');
        
        // 验证预订记录
        const bookingCheck = await client.query(
          'SELECT * FROM bookings WHERE id = $1',
          ['test-booking-1']
        );
        
        expect(bookingCheck.rows.length).to.equal(1);
        
        // 验证训练记录
        const recordCheck = await client.query(
          'SELECT * FROM training_records WHERE id = $1',
          ['test-record-tx']
        );
        
        expect(recordCheck.rows.length).to.equal(1);
        expect(recordCheck.rows[0].booking_id).to.equal(bookingId);
        
      } catch (error) {
        // 回滚事务
        await client.query('ROLLBACK');
        throw error;
      }
    });
    
    it('应该在错误时回滚事务', async () => {
      // 开始事务
      await client.query('BEGIN');
      
      try {
        // 插入预订记录
        await client.query(`
          INSERT INTO bookings (id, student_id, course_id, booking_date, booking_time, duration, status)
          VALUES ('test-booking-2', 'test-student-1', 'test-course-1', '2025-04-02', '11:00', 60, 'confirmed')
        `);
        
        // 故意引入错误 - 插入重复ID的训练记录
        await client.query(`
          INSERT INTO training_records (id, student_id, course_id, training_date, duration_minutes, metrics, category_id)
          VALUES ('test-record-1', 'test-student-1', 'test-course-1', '2025-04-02', 60, '{"pushups": 20, "weight": 67}', 6)
        `);
        
        // 提交事务 - 不应该执行到这里
        await client.query('COMMIT');
        expect.fail('应该抛出错误');
        
      } catch (error) {
        // 回滚事务
        await client.query('ROLLBACK');
        
        // 验证预订记录没有被插入
        const bookingCheck = await client.query(
          'SELECT * FROM bookings WHERE id = $1',
          ['test-booking-2']
        );
        
        expect(bookingCheck.rows.length).to.equal(0);
      }
    });
  });
  
  describe('并发访问测试', () => {
    it('应该正确处理并发预订请求', async () => {
      // 准备测试数据 - 设置课程可用名额为1
      await client.query(`
        UPDATE courses
        SET max_students = 1, available_slots = 1
        WHERE id = 'test-course-1'
      `);
      
      // 创建两个并发预订请求
      const booking1 = client.query(`
        INSERT INTO bookings (id, student_id, course_id, booking_date, booking_time, duration, status)
        VALUES ('test-booking-concurrent-1', 'test-student-1', 'test-course-1', '2025-04-03', '10:00', 60, 'confirmed')
        RETURNING id
      `);
      
      const booking2 = client.query(`
        INSERT INTO bookings (id, student_id, course_id, booking_date, booking_time, duration, status)
        VALUES ('test-booking-concurrent-2', 'test-student-1', 'test-course-1', '2025-04-03', '10:00', 60, 'confirmed')
        RETURNING id
      `);
      
      // 等待两个请求完成
      try {
        await Promise.all([booking1, booking2]);
        expect.fail('应该抛出错误');
      } catch (error) {
        // 预期会有一个请求失败
        
        // 验证只有一个预订成功
        const bookingCheck = await client.query(`
          SELECT * FROM bookings 
          WHERE id IN ('test-booking-concurrent-1', 'test-booking-concurrent-2')
        `);
        
        expect(bookingCheck.rows.length).to.be.at.most(1);
        
        // 验证课程可用名额为0
        const courseCheck = await client.query(`
          SELECT available_slots FROM courses WHERE id = 'test-course-1'
        `);
        
        expect(courseCheck.rows[0].available_slots).to.equal(0);
      }
    });
  });
  
  describe('数据迁移测试', () => {
    it('应该能够执行数据库架构更新', async () => {
      // 模拟数据迁移 - 添加新列
      try {
        await client.query(`
          ALTER TABLE training_records 
          ADD COLUMN IF NOT EXISTS test_column TEXT
        `);
        
        // 验证列已添加
        const result = await client.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'training_records' AND column_name = 'test_column'
        `);
        
        expect(result.rows.length).to.equal(1);
        
        // 更新数据
        await client.query(`
          UPDATE training_records
          SET test_column = 'test value'
          WHERE id LIKE 'test-%'
        `);
        
        // 验证数据已更新
        const dataCheck = await client.query(`
          SELECT test_column
          FROM training_records
          WHERE id = 'test-record-1'
        `);
        
        expect(dataCheck.rows[0].test_column).to.equal('test value');
        
      } finally {
        // 清理 - 删除测试列
        await client.query(`
          ALTER TABLE training_records 
          DROP COLUMN IF EXISTS test_column
        `);
      }
    });
  });
});
