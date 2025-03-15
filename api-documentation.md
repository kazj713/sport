# 体育教练平台 API 文档

## 目录

1. [简介](#1-简介)
2. [API 概述](#2-api-概述)
3. [认证与授权](#3-认证与授权)
4. [通用格式与约定](#4-通用格式与约定)
5. [用户 API](#5-用户-api)
6. [课程 API](#6-课程-api)
7. [预订 API](#7-预订-api)
8. [支付 API](#8-支付-api)
9. [评价 API](#9-评价-api)
10. [场馆 API](#10-场馆-api)
11. [AI 功能 API](#11-ai-功能-api)
    - [智能匹配 API](#111-智能匹配-api)
    - [训练数据分析 API](#112-训练数据分析-api)
    - [个性化训练建议 API](#113-个性化训练建议-api)
    - [智能客服 API](#114-智能客服-api)
    - [语音识别 API](#115-语音识别-api)
12. [社区 API](#12-社区-api)
13. [管理员 API](#13-管理员-api)
14. [错误处理](#14-错误处理)
15. [限流策略](#15-限流策略)
16. [版本控制](#16-版本控制)
17. [附录](#17-附录)

## 1. 简介

本文档详细描述了体育教练平台的 API 接口，供前端应用、移动应用和第三方集成使用。API 采用 RESTful 设计风格，使用 JSON 作为数据交换格式。

### 1.1 API 基础 URL

- 生产环境：`https://api.sportcoach-platform.com/v1`
- 测试环境：`https://api-test.sportcoach-platform.com/v1`
- 开发环境：`https://api-dev.sportcoach-platform.com/v1`

### 1.2 API 版本

当前 API 版本为 v1。版本信息包含在 URL 路径中。

## 2. API 概述

体育教练平台 API 分为以下几个主要模块：

- **用户 API**：用户注册、登录、资料管理等
- **课程 API**：课程创建、查询、管理等
- **预订 API**：课程预订、取消、查询等
- **支付 API**：支付处理、退款、账单等
- **评价 API**：评价提交、查询、管理等
- **场馆 API**：场馆信息、设施管理等
- **AI 功能 API**：智能匹配、数据分析、训练建议、智能客服、语音识别等
- **社区 API**：社区内容、讨论、活动等
- **管理员 API**：用户管理、内容审核、系统设置等

## 3. 认证与授权

### 3.1 认证方式

API 使用基于 JWT（JSON Web Token）的认证机制。

#### 3.1.1 获取访问令牌

```
POST /auth/login
```

**请求参数**：

```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

**响应**：

```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600,
    "token_type": "Bearer"
  }
}
```

#### 3.1.2 刷新访问令牌

```
POST /auth/refresh
```

**请求头**：

```
Authorization: Bearer {refresh_token}
```

**响应**：

```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600,
    "token_type": "Bearer"
  }
}
```

### 3.2 授权级别

API 根据用户角色提供不同的授权级别：

- **学生**：访问学生相关功能
- **教练**：访问教练相关功能
- **场馆管理员**：访问场馆管理功能
- **系统管理员**：访问所有功能

### 3.3 API 请求认证

所有需要认证的 API 请求都需要在 HTTP 头中包含访问令牌：

```
Authorization: Bearer {access_token}
```

## 4. 通用格式与约定

### 4.1 请求格式

- **GET 请求**：参数通过 URL 查询字符串传递
- **POST/PUT/PATCH 请求**：参数通过 JSON 格式的请求体传递
- **DELETE 请求**：参数通过 URL 查询字符串传递

### 4.2 响应格式

所有 API 响应都使用统一的 JSON 格式：

```json
{
  "status": "success",
  "data": {
    // 响应数据
  },
  "meta": {
    // 元数据，如分页信息
  }
}
```

错误响应格式：

```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述信息",
    "details": {
      // 详细错误信息
    }
  }
}
```

### 4.3 分页

支持分页的 API 使用以下查询参数：

- `page`：页码，从 1 开始
- `limit`：每页记录数，默认 20，最大 100

分页响应包含以下元数据：

```json
{
  "status": "success",
  "data": [...],
  "meta": {
    "pagination": {
      "total": 100,
      "count": 20,
      "per_page": 20,
      "current_page": 1,
      "total_pages": 5,
      "links": {
        "next": "https://api.sportcoach-platform.com/v1/courses?page=2&limit=20",
        "prev": null
      }
    }
  }
}
```

### 4.4 过滤和排序

- **过滤**：使用查询参数进行过滤，例如 `?status=active`
- **排序**：使用 `sort` 参数进行排序，例如 `?sort=created_at` 或 `?sort=-created_at`（降序）

### 4.5 字段选择

使用 `fields` 参数选择返回的字段，例如 `?fields=id,name,price`

## 5. 用户 API

### 5.1 注册用户

```
POST /users/register
```

**请求参数**：

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "13800138000",
  "role": "student",
  "name": "John Doe"
}
```

**响应**：

```json
{
  "status": "success",
  "data": {
    "id": "usr_123456789",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "student",
    "name": "John Doe",
    "created_at": "2025-03-14T07:00:00Z"
  }
}
```

### 5.2 获取用户信息

```
GET /users/{user_id}
```

**响应**：

```json
{
  "status": "success",
  "data": {
    "id": "usr_123456789",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "student",
    "name": "John Doe",
    "phone": "13800138000",
    "avatar": "https://example.com/avatars/johndoe.jpg",
    "bio": "热爱运动的学生",
    "preferences": {
      "sports": ["basketball", "swimming"],
      "level": "intermediate",
      "goals": ["fitness", "skill"]
    },
    "created_at": "2025-03-14T07:00:00Z",
    "updated_at": "2025-03-14T07:00:00Z"
  }
}
```

### 5.3 更新用户信息

```
PUT /users/{user_id}
```

**请求参数**：

```json
{
  "name": "John Smith",
  "bio": "热爱篮球和游泳的学生",
  "preferences": {
    "sports": ["basketball", "swimming"],
    "level": "intermediate",
    "goals": ["fitness", "skill"]
  }
}
```

**响应**：

```json
{
  "status": "success",
  "data": {
    "id": "usr_123456789",
    "name": "John Smith",
    "bio": "热爱篮球和游泳的学生",
    "preferences": {
      "sports": ["basketball", "swimming"],
      "level": "intermediate",
      "goals": ["fitness", "skill"]
    },
    "updated_at": "2025-03-14T08:00:00Z"
  }
}
```

### 5.4 更改密码

```
POST /users/{user_id}/change-password
```

**请求参数**：

```json
{
  "current_password": "password123",
  "new_password": "newpassword456"
}
```

**响应**：

```json
{
  "status": "success",
  "message": "密码已成功更新"
}
```

### 5.5 上传头像

```
POST /users/{user_id}/avatar
```

**请求参数**：
- 使用 `multipart/form-data` 格式
- 字段名：`avatar`，文件类型：图片

**响应**：

```json
{
  "status": "success",
  "data": {
    "avatar_url": "https://example.com/avatars/johndoe.jpg"
  }
}
```

## 6. 课程 API

### 6.1 获取课程列表

```
GET /courses
```

**查询参数**：
- `page`：页码
- `limit`：每页记录数
- `sport`：运动类型
- `level`：难度级别
- `price_min`：最低价格
- `price_max`：最高价格
- `location`：位置
- `distance`：距离（公里）
- `coach_id`：教练 ID
- `sort`：排序字段

**响应**：

```json
{
  "status": "success",
  "data": [
    {
      "id": "crs_123456789",
      "title": "初级篮球训练",
      "description": "适合初学者的篮球基础训练",
      "sport": "basketball",
      "level": "beginner",
      "price": 200,
      "duration": 60,
      "coach": {
        "id": "usr_987654321",
        "name": "李教练",
        "avatar": "https://example.com/avatars/coach_li.jpg",
        "rating": 4.8
      },
      "location": {
        "venue_id": "ven_123456789",
        "name": "星光体育馆",
        "address": "北京市朝阳区星光大道1号",
        "coordinates": {
          "latitude": 39.9042,
          "longitude": 116.4074
        }
      },
      "schedule": {
        "start_date": "2025-04-01",
        "end_date": "2025-04-30",
        "days": ["monday", "wednesday", "friday"],
        "time": "18:00-19:00"
      },
      "max_students": 10,
      "enrolled_students": 5,
      "rating": 4.7,
      "reviews_count": 15,
      "created_at": "2025-03-01T07:00:00Z",
      "updated_at": "2025-03-10T07:00:00Z"
    },
    // 更多课程...
  ],
  "meta": {
    "pagination": {
      "total": 50,
      "count": 20,
      "per_page": 20,
      "current_page": 1,
      "total_pages": 3,
      "links": {
        "next": "https://api.sportcoach-platform.com/v1/courses?page=2&limit=20",
        "prev": null
      }
    }
  }
}
```

### 6.2 获取课程详情

```
GET /courses/{course_id}
```

**响应**：

```json
{
  "status": "success",
  "data": {
    "id": "crs_123456789",
    "title": "初级篮球训练",
    "description": "适合初学者的篮球基础训练",
    "detailed_description": "本课程专为篮球初学者设计，内容包括基本运球、传球、投篮技巧，以及简单的战术理解。通过系统训练，学员将掌握篮球基础知识和技能，为进一步提高打下坚实基础。",
    "sport": "basketball",
    "level": "beginner",
    "price": 200,
    "duration": 60,
    "coach": {
      "id": "usr_987654321",
      "name": "李教练",
      "avatar": "https://example.com/avatars/coach_li.jpg",
      "bio": "前职业篮球运动员，10年教学经验",
      "rating": 4.8,
      "reviews_count": 120
    },
    "location": {
      "venue_id": "ven_123456789",
      "name": "星光体育馆",
      "address": "北京市朝阳区星光大道1号",
      "coordinates": {
        "latitude": 39.9042,
        "longitude": 116.4074
      },
      "facilities": ["室内篮球场", "更衣室", "淋浴间"]
    },
    "schedule": {
      "start_date": "2025-04-01",
      "end_date": "2025-04-30",
      "days": ["monday", "wednesday", "friday"],
      "time": "18:00-19:00",
      "sessions": [
        {
          "date": "2025-04-01",
          "time": "18:00-19:00",
          "available": true
        },
        // 更多课程安排...
      ]
    },
    "curriculum": [
      {
        "session": 1,
        "title": "基础运球技巧",
        "description": "学习基本运球姿势和技巧"
      },
      // 更多课程内容...
    ],
    "requirements": ["运动服装", "篮球鞋", "水壶"],
    "max_students": 10,
    "enrolled_students": 5,
    "rating": 4.7,
    "reviews": [
      {
        "id": "rev_123456789",
        "user": {
          "id": "usr_123456789",
          "name": "John Doe",
          "avatar": "https://example.com/avatars/johndoe.jpg"
        },
        "rating": 5,
        "comment": "非常棒的课程，教练很专业",
        "created_at": "2025-03-05T07:00:00Z"
      },
      // 更多评价...
    ],
    "images": [
      "https://example.com/courses/basketball_1.jpg",
      "https://example.com/courses/basketball_2.jpg"
    ],
    "created_at": "2025-03-01T07:00:00Z",
    "updated_at": "2025-03-10T07:00:00Z"
  }
}
```

### 6.3 创建课程（教练）

```
POST /courses
```

**请求参数**：

```json
{
  "title": "高级篮球训练",
  "description": "适合进阶学员的篮球训练",
  "detailed_description": "本课程专为有一定篮球基础的学员设计，内容包括高级运球、传球、投篮技巧，以及复杂战术理解和实战演练。",
  "sport": "basketball",
  "level": "advanced",
  "price": 300,
  "duration": 90,
  "venue_id": "ven_123456789",
  "schedule": {
    "start_date": "2025-05-01",
    "end_date": "2025-05-31",
    "days": ["tuesday", "thursday"],
    "time": "19:00-20:30"
  },
  "curriculum": [
    {
      "session": 1,
      "title": "高级运球技巧",
      "description": "学习高级运球姿势和技巧"
    },
    // 更多课程内容...
  ],
  "requirements": ["运动服装", "篮球鞋", "水壶"],
  "max_students": 8,
  "images": [
    "https://example.com/courses/basketball_advanced_1.jpg",
    "https://example.com/courses/basketball_advanced_2.jpg"
  ]
}
```

**响应**：

```json
{
  "status": "success",
  "data": {
    "id": "crs_987654321",
    "title": "高级篮球训练",
    // 其他课程信息...
    "created_at": "2025-03-14T07:00:00Z"
  }
}
```

### 6.4 更新课程（教练）

```
PUT /courses/{course_id}
```

**请求参数**：
与创建课程类似，但只需包含要更新的字段。

**响应**：

```json
{
  "status": "success",
  "data": {
    "id": "crs_987654321",
    // 更新后的课程信息...
    "updated_at": "2025-03-14T08:00:00Z"
  }
}
```

### 6.5 删除课程（教练）

```
DELETE /courses/{course_id}
```

**响应**：

```json
{
  "status": "success",
  "message": "课程已成功删除"
}
```

## 7. 预订 API

### 7.1 创建预订

```
POST /bookings
```

**请求参数**：

```json
{
  "course_id": "crs_123456789",
  "session_ids": ["ses_123456789", "ses_987654321"],
  "notes": "我有一些基础篮球经验"
}
```

**响应**：

```json
{
  "status": "success",
  "data": {
    "id": "bkg_123456789",
    "user_id": "usr_123456789",
    "course": {
      "id": "crs_123456789",
      "title": "初级篮球训练"
    },
    "sessions": [
      {
        "id": "ses_123456789",
        "date": "2025-04-01",
        "time": "18:00-19:00"
      },
      {
        "id": "ses_987654321",
        "date": "2025-04-03",
        "time": "18:00-19:00"
      }
    ],
    "status": "pending",
    "total_price": 400,
    "payment_status": "unpaid",
    "notes": "我有一些基础篮球经验",
    "created_at": "2025-03-14T07:00:00Z"
  }
}
```

### 7.2 获取预订列表

```
GET /bookings
```

**查询参数**：
- `page`：页码
- `limit`：每页记录数
- `status`：预订状态（pending, confirmed, cancelled, completed）
- `start_date`：开始日期
- `end_date`：结束日期

**响应**：

```json
{
  "status": "success",
  "data": [
    {
      "id": "bkg_123456789",
      "course": {
        "id": "crs_123456789",
        "title": "初级篮球训练",
        "coach": {
          "id": "usr_987654321",
          "name": "李教练"
        }
      },
      "sessions": [
        {
          "id": "ses_123456789",
          "date": "2025-04-01",
          "time": "18:00-19:00"
        },
        {
          "id": "ses_987654321",
          "date": "2025-04-03",
          "time": "18:00-19:00"
        }
      ],
      "status": "confirmed",
      "total_price": 400,
      "payment_status": "paid",
      "created_at": "2025-03-14T07:00:00Z"
    },
    // 更多预订...
  ],
  "meta": {
    "pagination": {
      // 分页信息...
    }
  }
}
```

### 7.3 获取预订详情

```
GET /bookings/{booking_id}
```

**响应**：

```json
{
  "status": "success",
  "data": {
    "id": "bkg_123456789",
    "user": {
      "id": "usr_123456789",
      "name": "John Doe",
      "phone": "13800138000",
      "email": "john@example.com"
    },
    "course": {
      "id": "crs_123456789",
      "title": "初级篮球训练",
      "coach": {
        "id": "usr_987654321",
        "name": "李教练",
        "phone": "13900139000"
      },
      "location": {
        "venue_id": "ven_123456789",
        "name": "星光体育馆",
        "address": "北京市朝阳区星光大道1号"
      }
    },
    "sessions": [
      {
        "id": "ses_123456789",
        "date": "2025-04-01",
        "time": "18:00-19:00",
        "status": "scheduled"
      },
      {
        "id": "ses_987654321",
        "date": "2025-04-03",
        "time": "18:00-19:00",
        "status": "scheduled"
      }
    ],
    "status": "confirmed",
    "total_price": 400,
    "payment": {
      "id": "pmt_123456789",
      "amount": 400,
      "method": "alipay",
      "status": "completed",
      "paid_at": "2025-03-14T07:30:00Z"
    },
    "notes": "我有一些基础篮球经验",
    "created_at": "2025-03-14T07:00:00Z",
    "updated_at": "2025-03-14T07:30:00Z"
  }
}
```

### 7.4 取消预订

```
POST /bookings/{booking_id}/cancel
```

**请求参数**：

```json
{
  "reason": "时间冲突",
  "details": "临时有事无法参加"
}
```

**响应**：

```json
{
  "status": "success",
  "data": {
    "id": "bkg_123456789",
    "status": "cancelled",
    "cancellation": {
      "reason": "时间冲突",
      "details": "临时有事无法参加",
      "refund_amount": 360,
      "refund_status": "processing"
    },
    "updated_at": "2025-03-14T08:00:00Z"
  }
}
```

## 8. 支付 API

### 8.1 创建支付

```
POST /payments
```

**请求参数**：

```json
{
  "booking_id": "bkg_123456789",
  "amount": 400,
  "method": "alipay"
}
```

**响应**：

```json
{
  "status": "success",
  "data": {
    "id": "pmt_123456789",
    "booking_id": "bkg_123456789",
    "amount": 400,
    "method": "alipay",
    "status": "pending",
    "payment_url": "https://pay.example.com/alipay?order=123456789",
    "created_at": "2025-03-14T07:00:00Z"
  }
}
```

### 8.2 获取支付详情

```
GET /payments/{payment_id}
```

**响应**：

```json
{
  "status": "success",
  "data": {
    "id": "pmt_123456789",
    "booking_id": "bkg_123456789",
    "amount": 400,
    "method": "alipay",
    "status": "completed",
    "transaction_id": "2025031412345678",
    "paid_at": "2025-03-14T07:30:00Z",
    "created_at": "2025-03-14T07:00:00Z",
    "updated_at": "2025-03-14T07:30:00Z"
  }
}
```

### 8.3 申请退款

```
POST /refunds
```

**请求参数**：

```json
{
  "payment_id": "pmt_123456789",
  "amount": 360,
  "reason": "课程取消",
  "details": "由于个人原因无法参加课程"
}
```

**响应**：

```json
{
  "status": "success",
  "data": {
    "id": "ref_123456789",
    "payment_id": "pmt_123456789",
    "amount": 360,
    "reason": "课程取消",
    "details": "由于个人原因无法参加课程",
    "status": "processing",
    "created_at": "2025-03-14T08:00:00Z"
  }
}
```

### 8.4 获取退款详情

```
GET /refunds/{refund_id}
```

**响应**：

```json
{
  "status": "success",
  "data": {
    "id": "ref_123456789",
    "payment_id": "pmt_123456789",
    "amount": 360,
    "reason": "课程取消",
    "details": "由于个人原因无法参加课程",
    "status": "completed",
    "refunded_at": "2025-03-14T10:00:00Z",
    "created_at": "2025-03-14T08:00:00Z",
    "updated_at": "2025-03-14T10:00:00Z"
  }
}
```

## 9. 评价 API

### 9.1 创建评价

```
POST /reviews
```

**请求参数**：

```json
{
  "booking_id": "bkg_123456789",
  "rating": 5,
  "comment": "非常棒的课程，教练很专业，讲解清晰，场地也很好",
  "coach_rating": 5,
  "course_rating": 5,
  "venue_rating": 4,
  "anonymous": false,
  "images": [
    "https://example.com/reviews/image1.jpg",
    "https://example.com/reviews/image2.jpg"
  ]
}
```

**响应**：

```json
{
  "status": "success",
  "data": {
    "id": "rev_123456789",
    "booking_id": "bkg_123456789",
    "course_id": "crs_123456789",
    "coach_id": "usr_987654321",
    "user_id": "usr_123456789",
    "rating": 5,
    "comment": "非常棒的课程，教练很专业，讲解清晰，场地也很好",
    "coach_rating": 5,
    "course_rating": 5,
    "venue_rating": 4,
    "anonymous": false,
    "images": [
      "https://exampl<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>