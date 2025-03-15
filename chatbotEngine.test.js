/**
 * 智能客服单元测试
 */

const { expect } = require('chai');
const { 
  processUserQuery, 
  identifyIntent,
  generateResponse,
  handleContextualQueries,
  extractEntities,
  getKnowledgeBaseAnswer
} = require('../src/ai/chatbot/chatbotEngine');

describe('智能客服测试', () => {
  describe('processUserQuery', () => {
    it('应该处理基本问题并返回相关回答', () => {
      // 准备测试数据
      const query = "如何预订课程？";
      const userContext = {
        isLoggedIn: true,
        userId: "user1",
        userName: "测试用户",
        userType: "student"
      };
      
      // 执行测试
      const response = processUserQuery(query, userContext);
      
      // 验证结果
      expect(response).to.be.an('object');
      expect(response.answer).to.be.a('string');
      expect(response.answer.length).to.be.above(0);
      expect(response.intent).to.be.a('string');
      expect(response.confidence).to.be.a('number');
      expect(response.confidence).to.be.at.least(0);
      expect(response.confidence).to.be.at.most(1);
    });
    
    it('应该处理上下文相关的问题', () => {
      // 准备测试数据
      const previousQuery = "我想了解瑜伽课程";
      const previousResponse = {
        answer: "我们提供多种瑜伽课程，包括初级瑜伽、高级瑜伽和热瑜伽。您对哪种感兴趣？",
        intent: "course_inquiry",
        entities: [{ type: "course_category", value: "瑜伽" }],
        confidence: 0.95
      };
      
      const query = "初级的价格是多少？";
      const userContext = {
        isLoggedIn: true,
        userId: "user1",
        userName: "测试用户",
        userType: "student",
        conversationHistory: [
          { query: previousQuery, response: previousResponse }
        ]
      };
      
      // 执行测试
      const response = processUserQuery(query, userContext);
      
      // 验证结果
      expect(response).to.be.an('object');
      expect(response.answer).to.be.a('string');
      expect(response.answer).to.include('初级瑜伽');
      expect(response.answer).to.include('价格');
      expect(response.intent).to.be.a('string');
      expect(response.confidence).to.be.a('number');
    });
    
    it('应该处理未登录用户的问题', () => {
      // 准备测试数据
      const query = "我想查看我的课程";
      const userContext = {
        isLoggedIn: false
      };
      
      // 执行测试
      const response = processUserQuery(query, userContext);
      
      // 验证结果
      expect(response).to.be.an('object');
      expect(response.answer).to.be.a('string');
      expect(response.answer).to.include('登录');
      expect(response.intent).to.be.a('string');
      expect(response.confidence).to.be.a('number');
    });
    
    it('应该处理未知问题', () => {
      // 准备测试数据
      const query = "xyz123完全无关的问题";
      const userContext = {
        isLoggedIn: true,
        userId: "user1",
        userName: "测试用户",
        userType: "student"
      };
      
      // 执行测试
      const response = processUserQuery(query, userContext);
      
      // 验证结果
      expect(response).to.be.an('object');
      expect(response.answer).to.be.a('string');
      expect(response.intent).to.equal('unknown');
      expect(response.confidence).to.be.below(0.5);
    });
  });
  
  describe('identifyIntent', () => {
    it('应该识别预订相关意图', () => {
      // 准备测试数据
      const queries = [
        "如何预订课程",
        "我想报名参加课程",
        "怎么预约教练",
        "课程预订流程是什么",
        "我能在线预约吗"
      ];
      
      // 执行测试并验证结果
      queries.forEach(query => {
        const result = identifyIntent(query);
        expect(result).to.be.an('object');
        expect(result.intent).to.equal('booking_inquiry');
        expect(result.confidence).to.be.above(0.7);
      });
    });
    
    it('应该识别课程相关意图', () => {
      // 准备测试数据
      const queries = [
        "有哪些课程",
        "瑜伽课程信息",
        "力量训练课程详情",
        "课程时间表",
        "课程价格是多少"
      ];
      
      // 执行测试并验证结果
      queries.forEach(query => {
        const result = identifyIntent(query);
        expect(result).to.be.an('object');
        expect(result.intent).to.equal('course_inquiry');
        expect(result.confidence).to.be.above(0.7);
      });
    });
    
    it('应该识别教练相关意图', () => {
      // 准备测试数据
      const queries = [
        "教练资质",
        "如何成为教练",
        "教练评价在哪里看",
        "最受欢迎的教练",
        "教练专长信息"
      ];
      
      // 执行测试并验证结果
      queries.forEach(query => {
        const result = identifyIntent(query);
        expect(result).to.be.an('object');
        expect(result.intent).to.equal('coach_inquiry');
        expect(result.confidence).to.be.above(0.7);
      });
    });
    
    it('应该识别账户相关意图', () => {
      // 准备测试数据
      const queries = [
        "如何注册账号",
        "忘记密码怎么办",
        "修改个人信息",
        "如何登录",
        "账号安全问题"
      ];
      
      // 执行测试并验证结果
      queries.forEach(query => {
        const result = identifyIntent(query);
        expect(result).to.be.an('object');
        expect(result.intent).to.equal('account_inquiry');
        expect(result.confidence).to.be.above(0.7);
      });
    });
    
    it('应该识别支付相关意图', () => {
      // 准备测试数据
      const queries = [
        "支付方式有哪些",
        "如何退款",
        "课程费用",
        "支付失败怎么办",
        "发票问题"
      ];
      
      // 执行测试并验证结果
      queries.forEach(query => {
        const result = identifyIntent(query);
        expect(result).to.be.an('object');
        expect(result.intent).to.equal('payment_inquiry');
        expect(result.confidence).to.be.above(0.7);
      });
    });
    
    it('应该处理未知意图', () => {
      // 准备测试数据
      const queries = [
        "xyz123",
        "完全无关的问题",
        "随机字符串测试",
        "不相关的内容"
      ];
      
      // 执行测试并验证结果
      queries.forEach(query => {
        const result = identifyIntent(query);
        expect(result).to.be.an('object');
        expect(result.intent).to.equal('unknown');
        expect(result.confidence).to.be.below(0.5);
      });
    });
  });
  
  describe('generateResponse', () => {
    it('应该根据意图生成相关回答', () => {
      // 准备测试数据
      const intents = [
        'booking_inquiry',
        'course_inquiry',
        'coach_inquiry',
        'account_inquiry',
        'payment_inquiry'
      ];
      
      const userContext = {
        isLoggedIn: true,
        userId: "user1",
        userName: "测试用户",
        userType: "student"
      };
      
      // 执行测试并验证结果
      intents.forEach(intent => {
        const query = "测试问题";
        const intentData = { intent, confidence: 0.9, entities: [] };
        
        const response = generateResponse(query, intentData, userContext);
        
        expect(response).to.be.an('object');
        expect(response.answer).to.be.a('string');
        expect(response.answer.length).to.be.above(0);
        expect(response.intent).to.equal(intent);
      });
    });
    
    it('应该处理未知意图', () => {
      // 准备测试数据
      const query = "完全无关的问题";
      const intentData = { intent: 'unknown', confidence: 0.3, entities: [] };
      const userContext = {
        isLoggedIn: true,
        userId: "user1",
        userName: "测试用户",
        userType: "student"
      };
      
      // 执行测试
      const response = generateResponse(query, intentData, userContext);
      
      // 验证结果
      expect(response).to.be.an('object');
      expect(response.answer).to.be.a('string');
      expect(response.answer).to.include('抱歉');
      expect(response.intent).to.equal('unknown');
    });
    
    it('应该根据用户类型定制回答', () => {
      // 准备测试数据 - 学生
      const query = "如何成为教练";
      const intentData = { intent: 'coach_inquiry', confidence: 0.9, entities: [] };
      const studentContext = {
        isLoggedIn: true,
        userId: "user1",
        userName: "测试用户",
        userType: "student"
      };
      
      // 教练
      const coachContext = {
        isLoggedIn: true,
        userId: "coach1",
        userName: "测试教练",
        userType: "coach"
      };
      
      // 执行测试
      const studentResponse = generateResponse(query, intentData, studentContext);
      const coachResponse = generateResponse(query, intentData, coachContext);
      
      // 验证结果
      expect(studentResponse.answer).to.not.equal(coachResponse.answer);
      expect(studentResponse.answer).to.include('申请');
      expect(coachResponse.answer).to.include('已经是');
    });
  });
  
  describe('handleContextualQueries', () => {
    it('应该处理上下文相关的问题', () => {
      // 准备测试数据
      const query = "它的价格是多少？";
      const userContext = {
        conversationHistory: [
          {
            query: "瑜伽课程信息",
            response: {
              intent: "course_inquiry",
              entities: [{ type: "course_category", value: "瑜伽" }]
            }
          }
        ]
      };
      
      // 执行测试
      const result = handleContextualQueries(query, userContext);
      
      // 验证结果
      expect(result).to.be.an('object');
      expect(result.enhancedQuery).to.be.a('string');
      expect(result.enhancedQuery).to.include('瑜伽');
      expect(result.enhancedQuery).to.include('价格');
      expect(result.context).to.be.an('object');
      expect(result.context.previousIntent).to.equal('course_inquiry');
    });
    
    it('应该处理代词引用', () => {
      // 准备测试数据
      const queries = [
        { query: "它什么时候开始？", expected: "course" },
        { query: "他有什么资质？", expected: "coach" },
        { query: "他们什么时候可用？", expected: "coach" }
      ];
      
      const userContext = {
        conversationHistory: [
          {
            query: "瑜伽课程信息",
            response: {
              intent: "course_inquiry",
              entities: [{ type: "course", value: "瑜伽课程" }]
            }
          },
          {
            query: "张教练怎么样？",
            response: {
              intent: "coach_inquiry",
              entities: [{ type: "coach", value: "张教练" }]
            }
          }
        ]
      };
      
      // 执行测试并验证结果
      queries.forEach(item => {
        const result = handleContextualQueries(item.query, userContext);
        expect(result.context.referencedEntity.type).to.equal(item.expected);
      });
    });
    
    it('应该处理没有上下文的情况', () => {
      // 准备测试数据
      const query = "课程价格是多少？";
      const userContext = {
        // 没有会话历史
      };
      
      // 执行测试
      const result = handleContextualQueries(query, userContext);
      
      // 验证结果
      expect(result).to.be.an('object');
      expect(result.enhancedQuery).to.equal(query);
      expect(result.context).to.be.an('object');
      expect(result.context.previousIntent).to.be.undefined;
    });
  });
  
  describe('extractEntities', () => {
    it('应该提取课程相关实体', () => {
      // 准备测试数据
      const queries = [
        { query: "瑜伽课程信息", entity: "瑜伽", type: "course_category" },
        { query: "高级力量训练课程详情", entity: "高级力量训练", type: "course" },
        { query: "周六的课程时间表", entity: "周六", type: "time" }
      ];
      
      // 执行测试并验证结果
      queries.forEach(item => {
        const entities = extractEntities(item.query);
        expect(entities).to.be.an('array');
        expect(entities.length).to.be.above(0);
        expect(entities.some(e => e.value.includes(item.entity) && e.type === item.type)).to.be.true;
      });
    });
    
    it('应该提取教练相关实体', () => {
      // 准备测试数据
      const queries = [
        { query: "张教练的资质", entity: "张教练", type: "coach" },
        { query: "瑜伽专业的教练", entity: "瑜伽", type: "specialty" }
      ];
      
      // 执行测试并验证结果
      queries.forEach(item => {
        const entities = extractEntities(item.query);
        expect(entities).to.be.an('array');
        expect(entities.length).to.be.above(0);
        expect(entities.some(e => e.value.includes(item.entity) && e.type === item.type)).to.be.true;
      });
    });
    
    it('应该提取支付相关实体', () => {
      // 准备测试数据
      const queries = [
        { query: "微信支付问题", entity: "微信", type: "payment_method" },
        { query: "退款政策是什么", entity: "退款", type: "payment_action" }
      ];
      
      // 执行测试并验证结果
      queries.forEach(item => {
        const entities = extractEntities(item.query);
        expect(entities).to.be.an('array');
        expect(entities.length).to.be.above(0);
        expect(entities.some(e => e.value.includes(item.entity) && e.type === item.type)).to.be.true;
      });
    });
    
    it('应该处理没有实体的情况', () => {
      // 准备测试数据
      const query = "你好";
      
      // 执行测试
      const entities = extractEntities(query);
      
      // 验证结果
      expect(entities).to.be.an('array');
      expect(entities.length).to.equal(0);
    });
  });
  
  describe('getKnowledgeBaseAnswer', () => {
    it('应该返回预订相关问题的答案', () => {
      // 准备测试数据
      const intent = 'booking_inquiry';
      const entities = [];
      const userContext = {
        isLoggedIn: true,
        userType: 'student'
      };
      
      // 执行测试
      const answer = getKnowledgeBaseAnswer(intent, entities, userContext);
      
      // 验证结果
      expect(answer).to.be.a('string');
      expect(answer.length).to.be.above(0);
      expect(answer).to.include('预订');
    });
    
    it('应该返回课程相关问题的答案', () => {
      // 准备测试数据
      const intent = 'course_inquiry';
      const entities = [{ type: 'course_category', value: '瑜伽' }];
      const userContext = {
        isLoggedIn: true,
        userType: 'student'
      };
      
      // 执行测试
      const answer = getKnowledgeBaseAnswer(intent, entities, userContext);
      
      // 验证结果
      expect(answer).to.be.a('string');
      expect(answer.length).to.be.above(0);
      expect(answer).to.include('瑜伽');
    });
    
    it('应该返回教练相关问题的答案', () => {
      // 准备测试数据
      const intent = 'coach_inquiry';
      const entities = [];
      const userContext = {
        isLoggedIn: true,
        userType: 'student'
      };
      
      // 执行测试
      const answer = getKnowledgeBaseAnswer(intent, entities, userContext);
      
      // 验证结果
      expect(answer).to.be.a('string');
      expect(answer.length).to.be.above(0);
      expect(answer).to.include('教练');
    });
    
    it('应该返回账户相关问题的答案', () => {
      // 准备测试数据
      const intent = 'account_inquiry';
      const entities = [];
      const userContext = {
        isLoggedIn: false
      };
      
      // 执行测试
      const answer = getKnowledgeBaseAnswer(intent, entities, userContext);
      
      // 验证结果
      expect(answer).to.be.a('string');
      expect(answer.length).to.be.above(0);
      expect(answer).to.include('账号');
    });
    
    it('应该返回支付相关问题的答案', () => {
      // 准备测试数据
      const intent = 'payment_inquiry';
      const entities = [{ type: 'payment_method', value: '支付宝' }];
      const userContext = {
        isLoggedIn: true,
        userType: 'student'
      };
      
      // 执行测试
      const answer = getKnowledgeBaseAnswer(intent, entities, userContext);
      
      // 验证结果
      expect(answer).to.be.a('string');
      expect(answer.length).to.be.above(0);
      expect(answer).to.include('支付');
      expect(answer).to.include('支付宝');
    });
    
    it('应该处理未知意图', () => {
      // 准备测试数据
      const intent = 'unknown';
      const entities = [];
      const userContext = {
        isLoggedIn: true,
        userType: 'student'
      };
      
      // 执行测试
      const answer = getKnowledgeBaseAnswer(intent, entities, userContext);
      
      // 验证结果
      expect(answer).to.be.a('string');
      expect(answer.length).to.be.above(0);
      expect(answer).to.include('抱歉');
    });
  });
});
