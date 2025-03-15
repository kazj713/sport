-- Migration number: 0001 	 2025-03-13
-- 删除已存在的表
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS coach_profiles;
DROP TABLE IF EXISTS student_profiles;
DROP TABLE IF EXISTS coach_certifications;
DROP TABLE IF EXISTS sport_categories;
DROP TABLE IF EXISTS coach_specialties;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS course_bookings;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS venues;
DROP TABLE IF EXISTS venue_bookings;
DROP TABLE IF EXISTS community_posts;
DROP TABLE IF EXISTS community_comments;
DROP TABLE IF EXISTS training_data;
DROP TABLE IF EXISTS notifications;

-- 用户表 - 存储所有用户的基本信息
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('coach', 'student', 'admin')),
  is_verified BOOLEAN NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 教练资料表 - 存储教练特有的详细信息
CREATE TABLE IF NOT EXISTS coach_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  bio TEXT,
  years_of_experience INTEGER,
  hourly_rate DECIMAL(10, 2),
  rating DECIMAL(3, 2),
  total_reviews INTEGER DEFAULT 0,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  bank_account TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 学生资料表 - 存储学生特有的详细信息
CREATE TABLE IF NOT EXISTS student_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  fitness_level TEXT,
  health_info TEXT,
  training_goals TEXT,
  date_of_birth DATE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 教练认证表 - 存储教练的各种证书和资质
CREATE TABLE IF NOT EXISTS coach_certifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  coach_id INTEGER NOT NULL,
  certification_name TEXT NOT NULL,
  issuing_organization TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  certificate_url TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (coach_id) REFERENCES coach_profiles(id) ON DELETE CASCADE
);

-- 运动类别表 - 存储所有支持的运动类型
CREATE TABLE IF NOT EXISTS sport_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 教练专长表 - 存储教练与运动类别的多对多关系
CREATE TABLE IF NOT EXISTS coach_specialties (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  coach_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  specialty_detail TEXT,
  experience_years INTEGER,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (coach_id) REFERENCES coach_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES sport_categories(id) ON DELETE CASCADE,
  UNIQUE(coach_id, category_id)
);

-- 课程表 - 存储所有课程信息
CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  coach_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category_id INTEGER NOT NULL,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'all')),
  max_students INTEGER NOT NULL,
  duration_minutes INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  is_recurring BOOLEAN NOT NULL DEFAULT 0,
  recurring_pattern TEXT,
  venue_id INTEGER,
  equipment_required TEXT,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (coach_id) REFERENCES coach_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES sport_categories(id),
  FOREIGN KEY (venue_id) REFERENCES venues(id)
);

-- 课程预订表 - 存储学生预订课程的记录
CREATE TABLE IF NOT EXISTS course_bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  booking_status TEXT NOT NULL DEFAULT 'confirmed' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_id INTEGER,
  attended BOOLEAN,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (payment_id) REFERENCES payments(id),
  UNIQUE(course_id, student_id)
);

-- 支付表 - 存储所有支付交易
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  coach_id INTEGER NOT NULL,
  course_id INTEGER,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  transaction_id TEXT UNIQUE,
  payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  platform_fee DECIMAL(10, 2) NOT NULL,
  coach_payout DECIMAL(10, 2) NOT NULL,
  refund_amount DECIMAL(10, 2) DEFAULT 0,
  refund_reason TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES student_profiles(id),
  FOREIGN KEY (coach_id) REFERENCES coach_profiles(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- 评价表 - 存储学生对教练和课程的评价
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  coach_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  professional_rating INTEGER NOT NULL CHECK (professional_rating BETWEEN 1 AND 5),
  communication_rating INTEGER NOT NULL CHECK (communication_rating BETWEEN 1 AND 5),
  punctuality_rating INTEGER NOT NULL CHECK (punctuality_rating BETWEEN 1 AND 5),
  overall_rating INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  comment TEXT,
  coach_response TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (coach_id) REFERENCES coach_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE(student_id, course_id)
);

-- 场地表 - 存储训练场地信息
CREATE TABLE IF NOT EXISTS venues (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  description TEXT,
  facilities TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  website TEXT,
  opening_hours TEXT,
  image_url TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 场地预订表 - 存储教练预订场地的记录
CREATE TABLE IF NOT EXISTS venue_bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  venue_id INTEGER NOT NULL,
  coach_id INTEGER NOT NULL,
  course_id INTEGER,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  booking_status TEXT NOT NULL DEFAULT 'confirmed' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled')),
  payment_id INTEGER,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE,
  FOREIGN KEY (coach_id) REFERENCES coach_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL,
  FOREIGN KEY (payment_id) REFERENCES payments(id)
);

-- 社区帖子表 - 存储社区内容
CREATE TABLE IF NOT EXISTS community_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category_id INTEGER,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES sport_categories(id)
);

-- 社区评论表 - 存储帖子评论
CREATE TABLE IF NOT EXISTS community_comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 训练数据表 - 存储学生训练记录和进度
CREATE TABLE IF NOT EXISTS training_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  coach_id INTEGER NOT NULL,
  training_date DATE NOT NULL,
  duration_minutes INTEGER NOT NULL,
  notes TEXT,
  achievements TEXT,
  metrics TEXT, -- JSON格式存储各种指标
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (coach_id) REFERENCES coach_profiles(id) ON DELETE CASCADE
);

-- 通知表 - 存储系统通知
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  notification_type TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT 0,
  related_id INTEGER, -- 相关实体ID（如课程ID、支付ID等）
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_coach_profiles_user_id ON coach_profiles(user_id);
CREATE INDEX idx_student_profiles_user_id ON student_profiles(user_id);
CREATE INDEX idx_coach_certifications_coach_id ON coach_certifications(coach_id);
CREATE INDEX idx_coach_specialties_coach_id ON coach_specialties(coach_id);
CREATE INDEX idx_coach_specialties_category_id ON coach_specialties(category_id);
CREATE INDEX idx_courses_coach_id ON courses(coach_id);
CREATE INDEX idx_courses_category_id ON courses(category_id);
CREATE INDEX idx_courses_start_time ON courses(start_time);
CREATE INDEX idx_course_bookings_course_id ON course_bookings(course_id);
CREATE INDEX idx_course_bookings_student_id ON course_bookings(student_id);
CREATE INDEX idx_payments_student_id ON payments(student_id);
CREATE INDEX idx_payments_coach_id ON payments(coach_id);
CREATE INDEX idx_reviews_coach_id ON reviews(coach_id);
CREATE INDEX idx_reviews_student_id ON reviews(student_id);
CREATE INDEX idx_venue_bookings_venue_id ON venue_bookings(venue_id);
CREATE INDEX idx_venue_bookings_coach_id ON venue_bookings(coach_id);
CREATE INDEX idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX idx_training_data_student_id ON training_data(student_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- 初始数据 - 运动类别
INSERT INTO sport_categories (name, description) VALUES 
  ('足球', '足球训练和技巧指导'),
  ('篮球', '篮球训练和技巧指导'),
  ('网球', '网球训练和技巧指导'),
  ('游泳', '游泳训练和技巧指导'),
  ('瑜伽', '瑜伽训练和姿势指导'),
  ('健身', '力量训练和健身指导'),
  ('跑步', '跑步训练和技巧指导'),
  ('武术', '武术训练和技巧指导'),
  ('舞蹈', '舞蹈训练和技巧指导'),
  ('高尔夫', '高尔夫训练和技巧指导');
