/**
 * 智能客服模块
 * 
 * 该模块实现了智能客服功能，自动回答用户常见问题，提供平台使用指导
 */

const natural = require('natural');
const { TfIdf } = natural;

/**
 * 处理用户问题并生成回答
 * @param {string} userQuery - 用户问题
 * @param {Object} userContext - 用户上下文信息
 * @returns {Object} 回答结果
 */
function processUserQuery(userQuery, userContext = {}) {
  // 如果问题为空，返回默认回答
  if (!userQuery || userQuery.trim() === '') {
    return {
      answer: "您好！我是体育教练平台的智能助手，有什么可以帮助您的吗？",
      confidence: 1.0,
      type: "greeting"
    };
  }
  
  // 预处理用户问题
  const processedQuery = preprocessQuery(userQuery);
  
  // 识别用户意图
  const intent = identifyIntent(processedQuery);
  
  // 提取实体
  const entities = extractEntities(processedQuery);
  
  // 根据意图和实体生成回答
  const response = generateResponse(intent, entities, userContext);
  
  return response;
}

/**
 * 预处理用户问题
 * @param {string} query - 用户问题
 * @returns {string} 预处理后的问题
 */
function preprocessQuery(query) {
  // 转换为小写
  let processedQuery = query.toLowerCase();
  
  // 移除标点符号
  processedQuery = processedQuery.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ");
  
  // 移除多余空格
  processedQuery = processedQuery.replace(/\s{2,}/g, " ").trim();
  
  return processedQuery;
}

/**
 * 识别用户意图
 * @param {string} query - 预处理后的用户问题
 * @returns {Object} 识别的意图
 */
function identifyIntent(query) {
  // 定义意图关键词
  const intentKeywords = {
    greeting: ["你好", "您好", "早上好", "下午好", "晚上好", "嗨", "hi", "hello"],
    course_info: ["课程", "课", "教练", "培训", "学习", "上课", "报名", "预订", "预约"],
    booking: ["预订", "预约", "报名", "订课", "取消", "改期", "退款"],
    payment: ["支付", "付款", "价格", "费用", "多少钱", "退款", "优惠", "折扣"],
    account: ["账号", "账户", "登录", "注册", "密码", "修改", "个人信息", "资料"],
    coach: ["教练", "老师", "指导员", "专业", "资质", "经验", "评价"],
    venue: ["场地", "地点", "位置", "地址", "交通", "怎么去", "在哪里"],
    training: ["训练", "锻炼", "健身", "运动", "技巧", "方法", "计划", "建议"],
    review: ["评价", "评论", "反馈", "满意度", "评分", "好评", "差评"],
    help: ["帮助", "怎么用", "使用方法", "指南", "教程", "问题", "困难", "不会"],
    contact: ["联系", "客服", "电话", "邮箱", "微信", "QQ", "人工"]
  };
  
  // 计算每个意图的匹配分数
  const scores = {};
  Object.keys(intentKeywords).forEach(intent => {
    scores[intent] = 0;
    intentKeywords[intent].forEach(keyword => {
      if (query.includes(keyword)) {
        scores[intent] += 1;
      }
    });
  });
  
  // 找出得分最高的意图
  let maxScore = 0;
  let maxIntent = "unknown";
  
  Object.keys(scores).forEach(intent => {
    if (scores[intent] > maxScore) {
      maxScore = scores[intent];
      maxIntent = intent;
    }
  });
  
  // 如果没有匹配到任何意图，尝试使用TF-IDF进行更复杂的匹配
  if (maxScore === 0) {
    const tfidf = new TfIdf();
    
    // 添加各种意图的示例问题
    const intentExamples = {
      greeting: [
        "你好，我想了解一下",
        "您好，请问",
        "嗨，我是新用户"
      ],
      course_info: [
        "有哪些课程可以选择",
        "想了解一下课程信息",
        "课程有什么类型",
        "有没有适合初学者的课程"
      ],
      booking: [
        "怎么预订课程",
        "如何取消预约",
        "能改期吗",
        "预订成功后会收到确认吗"
      ],
      payment: [
        "怎么付款",
        "支持什么支付方式",
        "课程多少钱",
        "有优惠活动吗"
      ],
      account: [
        "怎么注册账号",
        "忘记密码了怎么办",
        "如何修改个人信息",
        "账号安全问题"
      ],
      coach: [
        "教练都有什么资质",
        "如何选择适合的教练",
        "教练评价在哪里看",
        "想找专业的足球教练"
      ],
      venue: [
        "训练场地在哪里",
        "场地有什么设施",
        "怎么去训练场地",
        "场地开放时间"
      ],
      training: [
        "有什么训练建议",
        "如何制定训练计划",
        "初学者应该怎么训练",
        "训练频率多少合适"
      ],
      review: [
        "在哪里可以评价",
        "如何查看课程评价",
        "评分机制是怎样的",
        "可以修改已提交的评价吗"
      ],
      help: [
        "平台怎么使用",
        "遇到问题怎么办",
        "有使用教程吗",
        "需要帮助"
      ],
      contact: [
        "怎么联系客服",
        "有没有人工服务",
        "客服电话是多少",
        "想和真人沟通"
      ]
    };
    
    // 将示例问题添加到TF-IDF
    Object.keys(intentExamples).forEach(intent => {
      intentExamples[intent].forEach(example => {
        tfidf.addDocument(example);
      });
    });
    
    // 添加用户查询
    tfidf.addDocument(query);
    
    // 计算相似度
    const similarities = {};
    let documentIndex = 0;
    
    Object.keys(intentExamples).forEach(intent => {
      intentExamples[intent].forEach(() => {
        const similarity = calculateCosineSimilarity(tfidf, documentIndex, intentExamples[intent].length + intentExamples[Object.keys(intentExamples)[0]].length);
        
        if (!similarities[intent]) {
          similarities[intent] = 0;
        }
        
        similarities[intent] += similarity;
        documentIndex++;
      });
      
      // 计算平均相似度
      similarities[intent] /= intentExamples[intent].length;
    });
    
    // 找出最相似的意图
    let maxSimilarity = 0;
    
    Object.keys(similarities).forEach(intent => {
      if (similarities[intent] > maxSimilarity) {
        maxSimilarity = similarities[intent];
        maxIntent = intent;
      }
    });
    
    // 设置置信度
    maxScore = maxSimilarity > 0.3 ? maxSimilarity : 0;
  }
  
  // 计算置信度
  const confidence = maxScore > 0 ? Math.min(maxScore / 3, 0.95) : 0.3;
  
  return {
    type: maxIntent,
    confidence: confidence
  };
}

/**
 * 计算TF-IDF余弦相似度
 * @param {Object} tfidf - TF-IDF对象
 * @param {number} doc1Index - 文档1索引
 * @param {number} doc2Index - 文档2索引
 * @returns {number} 相似度分数
 */
function calculateCosineSimilarity(tfidf, doc1Index, doc2Index) {
  const terms = {};
  
  // 收集所有术语
  tfidf.documents.forEach((doc, index) => {
    if (index === doc1Index || index === doc2Index) {
      Object.keys(doc).forEach(term => {
        if (term !== '__key') {
          terms[term] = true;
        }
      });
    }
  });
  
  // 构建向量
  const vector1 = [];
  const vector2 = [];
  
  Object.keys(terms).forEach(term => {
    const tfidf1 = tfidf.tfidf(term, doc1Index);
    const tfidf2 = tfidf.tfidf(term, doc2Index);
    
    vector1.push(tfidf1);
    vector2.push(tfidf2);
  });
  
  // 计算余弦相似度
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  for (let i = 0; i < vector1.length; i++) {
    dotProduct += vector1[i] * vector2[i];
    norm1 += vector1[i] * vector1[i];
    norm2 += vector2[i] * vector2[i];
  }
  
  norm1 = Math.sqrt(norm1);
  norm2 = Math.sqrt(norm2);
  
  if (norm1 === 0 || norm2 === 0) return 0;
  
  return dotProduct / (norm1 * norm2);
}

/**
 * 从用户问题中提取实体
 * @param {string} query - 预处理后的用户问题
 * @returns {Object} 提取的实体
 */
function extractEntities(query) {
  const entities = {
    sport_type: null,
    difficulty_level: null,
    price_range: null,
    location: null,
    time_period: null
  };
  
  // 提取运动类型
  const sportTypes = [
    "足球", "篮球", "网球", "游泳", "瑜伽", "健身", 
    "跑步", "武术", "舞蹈", "高尔夫"
  ];
  
  sportTypes.forEach(sport => {
    if (query.includes(sport)) {
      entities.sport_type = sport;
    }
  });
  
  // 提取难度级别
  const difficultyLevels = {
    "初级": "beginner",
    "初学": "beginner",
    "入门": "beginner",
    "基础": "beginner",
    "中级": "intermediate",
    "进阶": "intermediate",
    "高级": "advanced",
    "专业": "advanced",
    "精通": "advanced"
  };
  
  Object.keys(difficultyLevels).forEach(level => {
    if (query.includes(level)) {
      entities.difficulty_level = difficultyLevels[level];
    }
  });
  
  // 提取价格范围
  if (query.includes("价格") || query.includes("费用") || query.includes("多少钱")) {
    // 尝试提取具体数字
    const priceMatch = query.match(/\d+/g);
    if (priceMatch) {
      const prices = priceMatch.map(p => parseInt(p));
      if (prices.length === 1) {
        // 单个数字可能是上限或下限
        if (query.includes("以下") || query.includes("最多") || query.includes("不超过")) {
          entities.price_range = { max: prices[0] };
        } else if (query.includes("以上") || query.includes("最少") || query.includes("不低于")) {
          entities.price_range = { min: prices[0] };
        } else {
          entities.price_range = { around: prices[0] };
        }
      } else if (prices.length >= 2) {
        // 多个数字可能是范围
        entities.price_range = { min: Math.min(...prices), max: Math.max(...prices) };
      }
    } else {
      // 提取模糊价格范围
      if (query.includes("便宜") || query.includes("经济") || query.includes("实惠")) {
        entities.price_range = { description: "low" };
      } else if (query.includes("贵") || query.includes("高端") || query.includes("豪华")) {
        entities.price_range = { description: "high" };
      } else if (query.includes("中等")) {
        entities.price_range = { description: "medium" };
      }
    }
  }
  
  // 提取位置信息
  const locationKeywords = ["附近", "周边", "地区", "区域", "位置"];
  locationKeywords.forEach(keyword => {
    const index = query.indexOf(keyword);
    if (index !== -1) {
      // 尝试提取位置前面的信息
      const locationMatch = query.substring(Math.max(0, index - 10), index).match(/[\u4e00-\u9fa5]+/g);
      if (locationMatch && locationMatch.length > 0) {
        entities.location = locationMatch[locationMatch.length - 1];
      }
    }
  });
  
  // 提取时间段
  const timeKeywords = {
    "早上": "morning",
    "上午": "morning",
    "中午": "noon",
    "下午": "afternoon",
    "晚上": "evening",
    "周末": "weekend",
    "工作日": "weekday",
    "周一": "monday",
    "周二": "tuesday",
    "周三": "wednesday",
    "周四": "thursday",
    "周五": "friday",
    "周六": "saturday",
    "周日": "sunday"
  };
  
  Object.keys(timeKeywords).forEach(time => {
    if (query.includes(time)) {
      entities.time_period = timeKeywords[time];
    }
  });
  
  return entities;
}

/**
 * 根据意图和实体生成回答
 * @param {Object} intent - 识别的意图
 * @param {Object} entities - 提取的实体
 * @param {Object} userContext - 用户上下文信息
 * @returns {Object} 回答结果
 */
function generateResponse(intent, entities, userContext) {
  // 根据意图类型生成回答
  switch (intent.type) {
    case "greeting":
      return handleGreeting(userContext);
    
    case "course_info":
      return handleCourseInfo(entities, userContext);
    
    case "booking":
      return handleBooking(entities, userContext);
    
    case "payment":
      return handlePayment(entities, userContext);
    
    case "account":
      return handleAccount(entities, userContext);
    
    case "coach":
      return handleCoach(entities, userContext);
    
    case "venue":
      return handleVenue(entities, userContext);
    
    case "training":
      return handleTraining(entities, userContext);
    
    case "review":
      return handleReview(entities, userContext);
    
    case "help":
      return handleHelp(entities, userContext);
    
    case "contact":
      return handleContact(entities, userContext);
    
    default:
      return handleUnknown(entities, userContext);
  }
}

/**
 * 处理问候意图
 * @param {Object} userContext - 用户上下文信息
 * @returns {Object} 回答结果
 */
function handleGreeting(userContext) {
  const greetings = [
    "您好！我是体育教练平台的智能助手，有什么可以帮助您的吗？",
    "你好！很高兴为您服务。请问有什么问题需要解答吗？",
    "您好！我可以帮您了解课程信息、预订流程、支付方式等问题。请问您需要什么帮助？"
  ];
  
  // 如果用户已登录，提供个性化问候
  if (userContext.isLoggedIn && userContext.userName) {
    return {
      answer: `${userContext.userName}，您好！欢迎回来。有什么可以帮助您的吗？`,
      confidence: 1.0,
      type: "greeting",
      suggestions: [
        "查看我的课程",
        "推荐课程",
        "训练建议",
        "联系客服"
      ]
    };
  }
  
  // 随机选择一个问候语
  const randomIndex = Math.floor(Math.random() * greetings.length);
  
  return {
    answer: greetings[randomIndex],
    confidence: 1.0,
    type: "greeting",
    suggestions: [
      "如何选择课程",
      "预订流程",
      "支付方式",
      "联系客服"
    ]
  };
}

/**
 * 处理课程信息意图
 * @param {Object} entities - 提取的实体
 * @param {Object} userContext - 用户上下文信息
 * @returns {Object} 回答结果
 */
function handleCourseInfo(entities, userContext) {
  // 根据实体提供相关课程信息
  if (entities.sport_type) {
    return {
      answer: `我们提供多种${entities.sport_type}课程，包括不同难度级别和时长。您可以在首页的课程列表中筛选${entities.sport_type}类别，查看详细信息。每个课程页面都有详细的描述、教练资料和学员评价。`,
      confidence: 0.9,
      type: "course_info",
      entities: entities,
      suggestions: [
        `查看${entities.sport_type}课程`,
        `${entities.sport_type}教练推荐`,
        "如何预订课程",
        "课程价格"
      ]
    };
  }
  
  if (entities.difficulty_level) {
    const levelName = entities.difficulty_level === "beginner" ? "初级" : 
                      entities.difficulty_level === "intermediate" ? "中级" : "高级";
    
    return {
      answer: `我们提供多种${levelName}课程，适合${levelName === "初级" ? "刚开始接触运动的初学者" : levelName === "中级" ? "有一定基础的学员" : "有丰富经验的高级学员"}。您可以在课程列表中筛选难度级别，找到适合您的课程。`,
      confidence: 0.85,
      type: "course_info",
      entities: entities,
      suggestions: [
        `查看${levelName}课程`,
        "教练推荐",
        "如何选择适合的课程",
        "预订流程"
      ]
    };
  }
  
  // 默认课程信息回答
  return {
    answer: "我们平台提供多种运动类型的课程，包括足球、篮球、网球、游泳、瑜伽、健身、跑步、武术、舞蹈和高尔夫等。每种运动都有不同难度级别的课程，从初学者到高级水平都有覆盖。您可以在首页浏览所有课程，也可以使用筛选功能找到最适合您的课程。",
    confidence: 0.8,
    type: "course_info",
    suggestions: [
      "热门课程",
      "如何筛选课程",
      "教练资质",
      "课程评价"
    ]
  };
}

/**
 * 处理预订意图
 * @param {Object} entities - 提取的实体
 * @param {Object} userContext - 用户上下文信息
 * @returns {Object} 回答结果
 */
function handleBooking(entities, userContext) {
  // 如果问题包含"取消"或"退款"
  if (entities.query && (entities.query.includes("取消") || entities.query.includes("退款"))) {
    return {
      answer: "您可以在"我的预订"页面找到已预订的课程，点击"取消预订"按钮进行取消。请注意，根据取消政策，距离课程开始时间不同，退款比例也会不同。一般情况下，提前24小时取消可获得全额退款，提前12小时取消可获得50%退款，少于12小时则无法退款。",
      confidence: 0.9,
      type: "booking",
      suggestions: [
        "查看我的预订",
        "退款政策",
        "联系客服",
        "预订新课程"
      ]
    };
  }
  
  // 如果问题包含"改期"
  if (entities.query && entities.query.includes("改期")) {
    return {
      answer: "目前平台不支持直接改期，您需要先取消原有预订，然后重新预订新的时间段。如果因取消产生退款损失，建议您联系客服寻求帮助。",
      confidence: 0.9,
      type: "booking",
      suggestions: [
        "取消预订流程",
        "联系客服",
        "预订新课程"
      ]
    };
  }
  
  // 默认预订流程回答
  return {
    answer: "预订课程非常简单：1. 在首页浏览或搜索您感兴趣的课程；2. 点击课程卡片进入详情页；3. 选择您想参加的时间段；4. 点击"立即预订"按钮；5. 确认预订信息并完成支付。预订成功后，您会收到确认邮件和短信通知，也可以在"我的预订"页面查看所有预订记录。",
    confidence: 0.85,
    type: "booking",
    suggestions: [
      "浏览课程",
      "支付方式",
      "取消政策",
      "联系客服"
    ]
  };
}

/**
 * 处理支付意图
 * @param {Object} entities - 提取的实体
 * @param {Object} userContext - 用户上下文信息
 * @returns {Object} 回答结果
 */
function handlePayment(entities, userContext) {
  // 如果问题包含价格范围
  if (entities.price_range) {
    let priceResponse = "我们的课程价格根据类型、难度和教练资质有所不同。";
    
    if (entities.price_range.min && entities.price_range.max) {
      priceResponse += `在${entities.price_range.min}元到${entities.price_range.max}元价格区间的课程有很多选择，您可以在课程列表页使用价格筛选功能查看详情。`;
    } else if (entities.price_range.min) {
      priceResponse += `我们有很多${entities.price_range.min}元以上的优质课程，通常由资深教练授课，提供更专业的指导。`;
    } else if (entities.price_range.max) {
      priceResponse += `我们提供多种${entities.price_range.max}元以下的经济实惠课程，非常适合初学者或预算有限的用户。`;
    } else if (entities.price_range.around) {
      priceResponse += `在${entities.price_range.around}元左右价位的课程选择很多，您可以在课程列表页使用价格筛选功能查看详情。`;
    } else if (entities.price_range.description === "low") {
      priceResponse += "我们提供多种经济实惠的课程，价格从50元起，非常适合初学者或预算有限的用户。";
    } else if (entities.price_range.description === "medium") {
      priceResponse += "我们的中等价位课程一般在100-200元之间，由经验丰富的教练授课，性价比很高。";
    } else if (entities.price_range.description === "high") {
      priceResponse += "我们的高端课程由资深专业教练一对一授课，价格通常在300元以上，提供最专业的指导和个性化训练方案。";
    }
    
    return {
      answer: priceResponse,
      confidence: 0.9,
      type: "payment",
      entities: entities,
      suggestions: [
        "查看课程列表",
        "价格筛选",
        "支付方式",
        "优惠活动"
      ]
    };
  }
  
  // 如果问题包含"退款"
  if (entities.query && entities.query.includes("退款")) {
    return {
      answer: "关于退款政策：提前24小时取消可获得全额退款，提前12小时取消可获得50%退款，少于12小时则无法退款。退款将在3-5个工作日内原路返回您的支付账户。如有特殊情况，请联系客服处理。",
      confidence: 0.9,
      type: "payment",
      suggestions: [
        "取消预订",
        "联系客服",
        "查看我的订单"
      ]
    };
  }
  
  // 默认支付信息回答
  return {
    answer: "我们支持多种支付方式，包括微信支付、支付宝、银联卡和信用卡。在完成预订后，您可以选择任一方式进行支付。支付成功后，您会立即收到确认通知。如果您有优惠券或积分，也可以在支付页面使用。我们定期会推出优惠活动，建议关注平台公告或订阅我们的推送消息。",
    confidence: 0.85,
    type: "payment",
    suggestions: [
      "优惠活动",
      "如何使用优惠券",
      "<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>