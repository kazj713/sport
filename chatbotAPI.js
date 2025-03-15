/**
 * 智能客服API接口
 * 
 * 该模块提供了与前端交互的API接口，用于处理智能客服请求
 */

const { processUserQuery } = require('./chatbotEngine');

/**
 * 处理用户问题并返回回答
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
async function handleChatbotQuery(req, res) {
  try {
    const { query, sessionId } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: '缺少必要参数: query' });
    }
    
    // 获取用户上下文
    const userContext = await getUserContext(sessionId);
    
    // 处理用户问题
    const response = processUserQuery(query, userContext);
    
    // 记录对话历史
    await saveConversationHistory(sessionId, query, response);
    
    // 返回结果
    return res.status(200).json({
      response,
      sessionId
    });
  } catch (error) {
    console.error('处理智能客服请求时出错:', error);
    return res.status(500).json({ error: '处理请求时出错' });
  }
}

/**
 * 获取对话历史
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
async function getConversationHistory(req, res) {
  try {
    const { sessionId, limit = 10 } = req.query;
    
    if (!sessionId) {
      return res.status(400).json({ error: '缺少必要参数: sessionId' });
    }
    
    // 获取对话历史
    const history = await fetchConversationHistory(sessionId, parseInt(limit));
    
    // 返回结果
    return res.status(200).json({
      history,
      count: history.length
    });
  } catch (error) {
    console.error('获取对话历史时出错:', error);
    return res.status(500).json({ error: '处理请求时出错' });
  }
}

/**
 * 获取常见问题建议
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
async function getFAQSuggestions(req, res) {
  try {
    const { category } = req.query;
    
    // 获取常见问题建议
    const suggestions = await fetchFAQSuggestions(category);
    
    // 返回结果
    return res.status(200).json({
      suggestions,
      count: suggestions.length
    });
  } catch (error) {
    console.error('获取常见问题建议时出错:', error);
    return res.status(500).json({ error: '处理请求时出错' });
  }
}

/**
 * 创建新的会话
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
async function createNewSession(req, res) {
  try {
    const { userId } = req.body;
    
    // 创建新会话
    const sessionId = await createSession(userId);
    
    // 返回结果
    return res.status(200).json({
      sessionId,
      message: '会话创建成功'
    });
  } catch (error) {
    console.error('创建会话时出错:', error);
    return res.status(500).json({ error: '处理请求时出错' });
  }
}

/**
 * 转接到人工客服
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
async function transferToHumanAgent(req, res) {
  try {
    const { sessionId, reason } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: '缺少必要参数: sessionId' });
    }
    
    // 记录转接请求
    await recordTransferRequest(sessionId, reason);
    
    // 返回结果
    return res.status(200).json({
      message: '转接请求已提交，人工客服将尽快接入',
      estimatedWaitTime: '2分钟'
    });
  } catch (error) {
    console.error('转接到人工客服时出错:', error);
    return res.status(500).json({ error: '处理请求时出错' });
  }
}

/**
 * 获取用户上下文
 * @param {string} sessionId - 会话ID
 * @returns {Promise<Object>} 用户上下文
 */
async function getUserContext(sessionId) {
  // 这里应该是实际的数据库查询
  // 示例实现:
  try {
    if (!sessionId) {
      return { isLoggedIn: false };
    }
    
    const query = `
      SELECT s.user_id, u.full_name, u.user_type
      FROM chat_sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.session_id = ?
    `;
    
    // 模拟数据返回
    // 根据sessionId的最后一位数字决定是否登录
    const lastDigit = sessionId.slice(-1);
    const isLoggedIn = parseInt(lastDigit) % 2 === 0; // 偶数为登录状态
    
    if (isLoggedIn) {
      return {
        isLoggedIn: true,
        userId: `user${lastDigit}`,
        userName: `用户${lastDigit}`,
        userType: parseInt(lastDigit) > 5 ? 'coach' : 'student'
      };
    } else {
      return { isLoggedIn: false };
    }
  } catch (error) {
    console.error('获取用户上下文时出错:', error);
    return { isLoggedIn: false };
  }
}

/**
 * 保存对话历史
 * @param {string} sessionId - 会话ID
 * @param {string} query - 用户问题
 * @param {Object} response - 系统回答
 * @returns {Promise<void>}
 */
async function saveConversationHistory(sessionId, query, response) {
  // 这里应该是实际的数据库操作
  // 示例实现:
  try {
    const insertQuery = `
      INSERT INTO chat_history (session_id, user_query, system_response, response_type, confidence, timestamp)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;
    
    console.log(`保存对话历史: sessionId=${sessionId}, query=${query}, responseType=${response.type}`);
    
    // 实际应用中这里会执行数据库插入操作
  } catch (error) {
    console.error('保存对话历史时出错:', error);
  }
}

/**
 * 获取对话历史
 * @param {string} sessionId - 会话ID
 * @param {number} limit - 返回记录数量限制
 * @returns {Promise<Array>} 对话历史
 */
async function fetchConversationHistory(sessionId, limit) {
  // 这里应该是实际的数据库查询
  // 示例实现:
  try {
    const query = `
      SELECT user_query, system_response, response_type, timestamp
      FROM chat_history
      WHERE session_id = ?
      ORDER BY timestamp DESC
      LIMIT ?
    `;
    
    // 模拟数据返回
    return [
      {
        userQuery: "你好",
        systemResponse: {
          answer: "您好！我是体育教练平台的智能助手，有什么可以帮助您的吗？",
          type: "greeting",
          suggestions: ["如何选择课程", "预订流程", "支付方式", "联系客服"]
        },
        timestamp: new Date(Date.now() - 300000).toISOString() // 5分钟前
      },
      {
        userQuery: "如何预订课程",
        systemResponse: {
          answer: "预订课程非常简单：1. 在首页浏览或搜索您感兴趣的课程；2. 点击课程卡片进入详情页；3. 选择您想参加的时间段；4. 点击"立即预订"按钮；5. 确认预订信息并完成支付。预订成功后，您会收到确认邮件和短信通知，也可以在"我的预订"页面查看所有预订记录。",
          type: "booking",
          suggestions: ["浏览课程", "支付方式", "取消政策", "联系客服"]
        },
        timestamp: new Date(Date.now() - 240000).toISOString() // 4分钟前
      },
      {
        userQuery: "有什么支付方式",
        systemResponse: {
          answer: "我们支持多种支付方式，包括微信支付、支付宝、银联卡和信用卡。在完成预订后，您可以选择任一方式进行支付。支付成功后，您会立即收到确认通知。如果您有优惠券或积分，也可以在支付页面使用。我们定期会推出优惠活动，建议关注平台公告或订阅我们的推送消息。",
          type: "payment",
          suggestions: ["优惠活动", "如何使用优惠券", "退款政策", "联系客服"]
        },
        timestamp: new Date(Date.now() - 180000).toISOString() // 3分钟前
      }
    ];
  } catch (error) {
    console.error('获取对话历史时出错:', error);
    throw error;
  }
}

/**
 * 获取常见问题建议
 * @param {string} category - 问题类别
 * @returns {Promise<Array>} 常见问题建议
 */
async function fetchFAQSuggestions(category) {
  // 这里应该是实际的数据库查询
  // 示例实现:
  try {
    const query = `
      SELECT question, category
      FROM faq_suggestions
      WHERE category = ? OR ? IS NULL
      ORDER BY frequency DESC
      LIMIT 10
    `;
    
    // 常见问题映射
    const faqMap = {
      course: [
        "有哪些课程可以选择",
        "课程价格是多少",
        "如何筛选适合我的课程",
        "课程有什么难度级别",
        "可以试听课程吗"
      ],
      booking: [
        "如何预订课程",
        "如何取消预订",
        "可以改期吗",
        "预订成功后会收到确认吗",
        "可以为他人预订课程吗"
      ],
      payment: [
        "支持哪些支付方式",
        "如何使用优惠券",
        "退款政策是什么",
        "支付安全吗",
        "可以开发票吗"
      ],
      account: [
        "如何注册账号",
        "忘记密码怎么办",
        "如何修改个人信息",
        "账号安全问题",
        "如何注销账号"
      ],
      coach: [
        "如何选择适合的教练",
        "教练资质如何验证",
        "可以更换教练吗",
        "如何评价教练",
        "教练的收费标准是什么"
      ]
    };
    
    // 返回指定类别的问题，如果未指定类别则返回所有类别的热门问题
    if (category && faqMap[category]) {
      return faqMap[category].map(question => ({ question, category }));
    } else {
      // 返回所有类别的前2个问题
      const allSuggestions = [];
      Object.keys(faqMap).forEach(cat => {
        faqMap[cat].slice(0, 2).forEach(question => {
          allSuggestions.push({ question, category: cat });
        });
      });
      return allSuggestions;
    }
  } catch (error) {
    console.error('获取常见问题建议时出错:', error);
    throw error;
  }
}

/**
 * 创建新会话
 * @param {string} userId - 用户ID
 * @returns {Promise<string>} 会话ID
 */
async function createSession(userId) {
  // 这里应该是实际的数据库操作
  // 示例实现:
  try {
    const sessionId = `session_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    const insertQuery = `
      INSERT INTO chat_sessions (session_id, user_id, created_at, last_activity)
      VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
    
    console.log(`创建新会话: sessionId=${sessionId}, userId=${userId || 'anonymous'}`);
    
    // 实际应用中这里会执行数据库插入操作
    
    return sessionId;
  } catch (error) {
    console.error('创建会话时出错:', error);
    throw error;
  }
}

/**
 * 记录转接请求
 * @param {string} sessionId - 会话ID
 * @param {string} reason - 转接原因
 * @returns {Promise<void>}
 */
async function recordTransferRequest(sessionId, reason) {
  // 这里应该是实际的数据库操作
  // 示例实现:
  try {
    const insertQuery = `
      INSERT INTO transfer_requests (session_id, reason, status, requested_at)
      VALUES (?, ?, 'pending', CURRENT_TIMESTAMP)
    `;
    
    console.log(`记录转接请求: sessionId=${sessionId}, reason=${reason || '未指定'}`);
    
    // 实际应用中这里会执行数据库插入操作
  } catch (error) {
    console.error('记录转接请求时出错:', error);
    throw error;
  }
}

module.exports = {
  handleChatbotQuery,
  getConversationHistory,
  getFAQSuggestions,
  createNewSession,
  transferToHumanAgent
};
