/**
 * 语音识别API接口
 * 
 * 该模块提供了与前端交互的API接口，用于处理语音识别和语音合成请求
 */

const { VoiceAssistant } = require('./voiceRecognition');
const { processUserQuery } = require('../chatbot/chatbotEngine');

// 存储活动的语音助手实例
const activeAssistants = new Map();

/**
 * 初始化语音助手
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
async function initializeVoiceAssistant(req, res) {
  try {
    const { sessionId, language = 'zh-CN' } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: '缺少必要参数: sessionId' });
    }
    
    // 检查是否已存在语音助手实例
    if (activeAssistants.has(sessionId)) {
      return res.status(200).json({
        message: '语音助手已初始化',
        sessionId,
        status: 'ready'
      });
    }
    
    // 获取用户上下文
    const userContext = await getUserContext(sessionId);
    
    // 创建新的语音助手实例
    const assistant = new VoiceAssistant({
      language,
      autoRestart: true,
      continuous: true,
      onQuery: (query) => handleVoiceQuery(sessionId, query, userContext),
      onError: (error) => console.error(`语音助手错误 (${sessionId}):`, error)
    });
    
    // 初始化语音助手
    const initialized = await assistant.initialize();
    
    if (!initialized) {
      return res.status(500).json({ error: '初始化语音助手失败' });
    }
    
    // 存储语音助手实例
    activeAssistants.set(sessionId, {
      assistant,
      userContext,
      lastActivity: Date.now()
    });
    
    // 返回结果
    return res.status(200).json({
      message: '语音助手初始化成功',
      sessionId,
      status: 'ready'
    });
  } catch (error) {
    console.error('初始化语音助手时出错:', error);
    return res.status(500).json({ error: '处理请求时出错' });
  }
}

/**
 * 启动语音识别
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
async function startVoiceRecognition(req, res) {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: '缺少必要参数: sessionId' });
    }
    
    // 获取语音助手实例
    const assistantData = activeAssistants.get(sessionId);
    
    if (!assistantData) {
      return res.status(404).json({ error: '未找到语音助手实例，请先初始化' });
    }
    
    const { assistant } = assistantData;
    
    // 启动语音识别
    const started = await assistant.start();
    
    if (!started) {
      return res.status(500).json({ error: '启动语音识别失败' });
    }
    
    // 更新最后活动时间
    assistantData.lastActivity = Date.now();
    
    // 返回结果
    return res.status(200).json({
      message: '语音识别已启动',
      sessionId,
      status: 'listening'
    });
  } catch (error) {
    console.error('启动语音识别时出错:', error);
    return res.status(500).json({ error: '处理请求时出错' });
  }
}

/**
 * 停止语音识别
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
async function stopVoiceRecognition(req, res) {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: '缺少必要参数: sessionId' });
    }
    
    // 获取语音助手实例
    const assistantData = activeAssistants.get(sessionId);
    
    if (!assistantData) {
      return res.status(404).json({ error: '未找到语音助手实例' });
    }
    
    const { assistant } = assistantData;
    
    // 停止语音识别
    assistant.stop();
    
    // 更新最后活动时间
    assistantData.lastActivity = Date.now();
    
    // 返回结果
    return res.status(200).json({
      message: '语音识别已停止',
      sessionId,
      status: 'stopped'
    });
  } catch (error) {
    console.error('停止语音识别时出错:', error);
    return res.status(500).json({ error: '处理请求时出错' });
  }
}

/**
 * 文本转语音
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
async function textToSpeech(req, res) {
  try {
    const { sessionId, text, options = {} } = req.body;
    
    if (!sessionId || !text) {
      return res.status(400).json({ error: '缺少必要参数: sessionId 或 text' });
    }
    
    // 获取语音助手实例
    const assistantData = activeAssistants.get(sessionId);
    
    if (!assistantData) {
      return res.status(404).json({ error: '未找到语音助手实例，请先初始化' });
    }
    
    const { assistant } = assistantData;
    
    // 文本转语音
    const success = await assistant.respond(text, options);
    
    if (!success) {
      return res.status(500).json({ error: '文本转语音失败' });
    }
    
    // 更新最后活动时间
    assistantData.lastActivity = Date.now();
    
    // 返回结果
    return res.status(200).json({
      message: '文本转语音成功',
      sessionId,
      text
    });
  } catch (error) {
    console.error('文本转语音时出错:', error);
    return res.status(500).json({ error: '处理请求时出错' });
  }
}

/**
 * 获取语音助手状态
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
async function getVoiceAssistantStatus(req, res) {
  try {
    const { sessionId } = req.query;
    
    if (!sessionId) {
      return res.status(400).json({ error: '缺少必要参数: sessionId' });
    }
    
    // 获取语音助手实例
    const assistantData = activeAssistants.get(sessionId);
    
    if (!assistantData) {
      return res.status(404).json({ error: '未找到语音助手实例' });
    }
    
    const { assistant, lastActivity } = assistantData;
    
    // 返回状态
    return res.status(200).json({
      sessionId,
      isActive: assistant.isActive,
      isListening: assistant.isListening,
      isSpeaking: assistant.isSpeaking,
      lastQuery: assistant.lastQuery,
      lastActivity,
      idleTime: Date.now() - lastActivity
    });
  } catch (error) {
    console.error('获取语音助手状态时出错:', error);
    return res.status(500).json({ error: '处理请求时出错' });
  }
}

/**
 * 释放语音助手资源
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
async function releaseVoiceAssistant(req, res) {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: '缺少必要参数: sessionId' });
    }
    
    // 获取语音助手实例
    const assistantData = activeAssistants.get(sessionId);
    
    if (!assistantData) {
      return res.status(404).json({ error: '未找到语音助手实例' });
    }
    
    const { assistant } = assistantData;
    
    // 停止语音助手
    assistant.stop();
    
    // 移除语音助手实例
    activeAssistants.delete(sessionId);
    
    // 返回结果
    return res.status(200).json({
      message: '语音助手资源已释放',
      sessionId
    });
  } catch (error) {
    console.error('释放语音助手资源时出错:', error);
    return res.status(500).json({ error: '处理请求时出错' });
  }
}

/**
 * 处理语音查询
 * @param {string} sessionId - 会话ID
 * @param {string} query - 用户查询
 * @param {Object} userContext - 用户上下文
 */
async function handleVoiceQuery(sessionId, query, userContext) {
  try {
    console.log(`处理语音查询: sessionId=${sessionId}, query=${query}`);
    
    // 获取语音助手实例
    const assistantData = activeAssistants.get(sessionId);
    
    if (!assistantData) {
      console.error(`未找到语音助手实例: ${sessionId}`);
      return;
    }
    
    const { assistant } = assistantData;
    
    // 使用智能客服处理查询
    const response = processUserQuery(query, userContext);
    
    // 使用语音合成播放回答
    await assistant.respond(response.answer);
    
    // 保存对话历史
    await saveConversationHistory(sessionId, query, response);
    
    // 更新最后活动时间
    assistantData.lastActivity = Date.now();
  } catch (error) {
    console.error('处理语音查询时出错:', error);
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
 * 清理闲置的语音助手实例
 * 定期运行，释放长时间不活动的实例资源
 */
function cleanupIdleAssistants() {
  const now = Date.now();
  const idleTimeout = 30 * 60 * 1000; // 30分钟
  
  for (const [sessionId, assistantData] of activeAssistants.entries()) {
    const { lastActivity, assistant } = assistantData;
    const idleTime = now - lastActivity;
    
    if (idleTime > idleTimeout) {
      console.log(`清理闲置语音助手: ${sessionId}, 闲置时间: ${idleTime / 1000}秒`);
      assistant.stop();
      activeAssistants.delete(sessionId);
    }
  }
}

// 设置定期清理任务
setInterval(cleanupIdleAssistants, 10 * 60 * 1000); // 每10分钟运行一次

module.exports = {
  initializeVoiceAssistant,
  startVoiceRecognition,
  stopVoiceRecognition,
  textToSpeech,
  getVoiceAssistantStatus,
  releaseVoiceAssistant
};
