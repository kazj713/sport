/**
 * 个性化训练建议单元测试
 */

const { expect } = require('chai');
const { 
  generateTrainingRecommendations, 
  generateBasicRecommendations,
  generateSummary,
  generateNextSteps,
  recommendCourses,
  identifyImprovementAreas,
  generateWeeklyPlan,
  suggestLongTermGoals
} = require('../src/ai/recommendations/trainingRecommendations');

describe('个性化训练建议测试', () => {
  describe('generateTrainingRecommendations', () => {
    it('应该基于训练历史生成个性化建议', () => {
      // 准备测试数据
      const studentProfile = {
        id: "student1",
        fullName: "学生A",
        fitnessLevel: "intermediate",
        trainingGoals: "增强核心力量，提高耐力，减轻体重",
        preferredCategories: [1, 3, 6],
        healthInfo: "无特殊健康问题"
      };
      
      const trainingData = [
        {
          id: "1",
          studentId: "student1",
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
          studentId: "student1",
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
          studentId: "student1",
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
        }
      ];
      
      // 执行测试
      const recommendations = generateTrainingRecommendations(studentProfile, trainingData, availableCourses);
      
      // 验证结果
      expect(recommendations).to.be.an('object');
      expect(recommendations.summary).to.be.a('string');
      expect(recommendations.summary.length).to.be.above(0);
      expect(recommendations.nextSteps).to.be.an('array');
      expect(recommendations.nextSteps.length).to.be.above(0);
      expect(recommendations.suggestedCourses).to.be.an('array');
      expect(recommendations.improvementAreas).to.be.an('array');
      expect(recommendations.weeklyPlan).to.be.an('array');
      expect(recommendations.longTermGoals).to.be.an('array');
    });
    
    it('应该处理没有训练历史的情况', () => {
      // 准备测试数据
      const studentProfile = {
        id: "student2",
        fullName: "学生B",
        fitnessLevel: "beginner",
        trainingGoals: "入门健身，提高体能",
        preferredCategories: [6],
        healthInfo: "无特殊健康问题"
      };
      
      const trainingData = [];
      
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
        }
      ];
      
      // 执行测试
      const recommendations = generateTrainingRecommendations(studentProfile, trainingData, availableCourses);
      
      // 验证结果
      expect(recommendations).to.be.an('object');
      expect(recommendations.summary).to.be.a('string');
      expect(recommendations.summary.length).to.be.above(0);
      expect(recommendations.nextSteps).to.be.an('array');
      expect(recommendations.nextSteps.length).to.be.above(0);
      expect(recommendations.suggestedCourses).to.be.an('array');
      expect(recommendations.improvementAreas).to.be.an('array');
      expect(recommendations.weeklyPlan).to.be.an('array');
      expect(recommendations.longTermGoals).to.be.an('array');
    });
  });
  
  describe('generateBasicRecommendations', () => {
    it('应该为新学生生成基础建议', () => {
      // 准备测试数据
      const studentProfile = {
        id: "student2",
        fullName: "学生B",
        fitnessLevel: "beginner",
        trainingGoals: "入门健身，提高体能",
        preferredCategories: [6],
        healthInfo: "无特殊健康问题"
      };
      
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
      
      // 执行测试
      const recommendations = generateBasicRecommendations(studentProfile, availableCourses);
      
      // 验证结果
      expect(recommendations).to.be.an('object');
      expect(recommendations.summary).to.be.a('string');
      expect(recommendations.summary.length).to.be.above(0);
      expect(recommendations.nextSteps).to.be.an('array');
      expect(recommendations.nextSteps.length).to.be.above(0);
      expect(recommendations.suggestedCourses).to.be.an('array');
      expect(recommendations.suggestedCourses.length).to.be.above(0);
      expect(recommendations.improvementAreas).to.be.an('array');
      expect(recommendations.weeklyPlan).to.be.an('array');
      expect(recommendations.weeklyPlan.length).to.be.above(0);
      expect(recommendations.longTermGoals).to.be.an('array');
      expect(recommendations.longTermGoals.length).to.be.above(0);
    });
    
    it('应该处理不同健身水平', () => {
      // 准备测试数据 - 高级学员
      const studentProfile = {
        id: "student3",
        fullName: "学生C",
        fitnessLevel: "advanced",
        trainingGoals: "增肌，提高力量",
        preferredCategories: [6, 7],
        healthInfo: "无特殊健康问题"
      };
      
      const availableCourses = [
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
        }
      ];
      
      // 执行测试
      const recommendations = generateBasicRecommendations(studentProfile, availableCourses);
      
      // 验证结果
      expect(recommendations).to.be.an('object');
      expect(recommendations.summary).to.include('高级');
      expect(recommendations.weeklyPlan.length).to.be.above(0);
      expect(recommendations.weeklyPlan[0].intensity).to.equal('high');
    });
  });
  
  describe('generateSummary', () => {
    it('应该生成包含训练历史摘要的文本', () => {
      // 准备测试数据
      const studentProfile = {
        fitnessLevel: "intermediate"
      };
      
      const analysis = {
        totalSessions: 10,
        totalDuration: 700,
        averageDuration: 70,
        trends: {
          durationTrend: { direction: 'increasing' }
        },
        firstSession: { trainingDate: '2025-01-01' },
        lastSession: { trainingDate: '2025-03-01' },
        frequencyPerWeek: 2.5
      };
      
      // 执行测试
      const summary = generateSummary(studentProfile, analysis);
      
      // 验证结果
      expect(summary).to.be.a('string');
      expect(summary.length).to.be.above(0);
      expect(summary).to.include('10次训练');
      expect(summary).to.include('700');
      expect(summary).to.include('70');
      expect(summary).to.include('上升趋势');
      expect(summary).to.include('2.5次');
    });
    
    it('应该处理不同健身水平', () => {
      // 准备测试数据 - 高级学员
      const studentProfile = {
        fitnessLevel: "advanced"
      };
      
      const analysis = {
        totalSessions: 20,
        totalDuration: 1600,
        averageDuration: 80,
        trends: {
          durationTrend: { direction: 'stable' }
        },
        firstSession: { trainingDate: '2025-01-01' },
        lastSession: { trainingDate: '2025-03-01' },
        frequencyPerWeek: 3.5
      };
      
      // 执行测试
      const summary = generateSummary(studentProfile, analysis);
      
      // 验证结果
      expect(summary).to.be.a('string');
      expect(summary).to.include('高级学员');
      expect(summary).to.include('4-5次');
    });
  });
  
  describe('generateNextSteps', () => {
    it('应该生成下一步行动建议', () => {
      // 准备测试数据
      const studentProfile = {
        fitnessLevel: "intermediate"
      };
      
      const analysis = {
        frequencyPerWeek: 2,
        trends: {},
        progress: {
          metrics: {
            pushups: {
              trend: { direction: 'stable' },
              values: [10, 10, 11, 10]
            }
          }
        },
        categories: { "6": { count: 10 } },
        lastSession: { trainingDate: '2025-03-01' }
      };
      
      const availableCourses = [
        {
          id: "course1",
          title: "核心训练",
          description: "专注于核心肌群的训练",
          categoryId: 6,
          difficultyLevel: "intermediate"
        }
      ];
      
      // 执行测试
      const nextSteps = generateNextSteps(studentProfile, analysis, availableCourses);
      
      // 验证结果
      expect(nextSteps).to.be.an('array');
      expect(nextSteps.length).to.be.at.least(3);
      expect(nextSteps[0]).to.include('频率');
    });
    
    it('应该处理训练多样性不足的情况', () => {
      // 准备测试数据
      const studentProfile = {
        fitnessLevel: "intermediate"
      };
      
      const analysis = {
        frequencyPerWeek: 3,
        trends: {},
        progress: {},
        categories: { "6": { count: 10 } }, // 只有一种类别
        lastSession: { trainingDate: '2025-03-01' }
      };
      
      const availableCourses = [
        {
          id: "course1",
          title: "核心训练",
          description: "专注于核心肌群的训练",
          categoryId: 6,
          difficultyLevel: "intermediate"
        },
        {
          id: "course6",
          title: "瑜伽课程",
          description: "提高柔韧性的瑜伽课程",
          categoryId: 5,
          difficultyLevel: "intermediate"
        }
      ];
      
      // 执行测试
      const nextSteps = generateNextSteps(studentProfile, analysis, availableCourses);
      
      // 验证结果
      expect(nextSteps).to.be.an('array');
      expect(nextSteps.length).to.be.at.least(3);
      expect(nextSteps.some(step => step.includes('多样性') || step.includes('种类'))).to.be.true;
    });
  });
  
  describe('recommendCourses', () => {
    it('应该推荐适合的课程', () => {
      // 准备测试数据
      const studentProfile = {
        fitnessLevel: "intermediate",
        trainingGoals: "增强核心力量，提高耐力",
        preferredCategories: [6]
      };
      
      const analysis = {
        categories: { "6": { count: 10 } },
        lastSession: { records: [{ courseId: "course1" }] }
      };
      
      const availableCourses = [
        {
          id: "course1",
          title: "基础健身",
          description: "基础健身课程",
          categoryId: 6,
          difficultyLevel: "beginner"
        },
        {
          id: "course2",
          title: "核心训练",
          description: "专注于核心肌群的训练",
          categoryId: 6,
          difficultyLevel: "intermediate"
        },
        {
          id: "course3",
          title: "高强度间歇",
          description: "提高心肺功能的高强度训练",
          categoryId: 6,
          difficultyLevel: "advanced"
        },
        {
          id: "course4",
          title: "瑜伽课程",
          description: "提高柔韧性的瑜伽课程",
          categoryId: 5,
          difficultyLevel: "intermediate"
        }
      ];
      
      // 执行测试
      const recommendedCourses = recommendCourses(studentProfile, analysis, availableCourses);
      
      // 验证结果
      expect(recommendedCourses).to.be.an('array');
      expect(recommendedCourses.length).to.be.above(0);
      expect(recommendedCourses.length).to.be.at.most(5);
      expect(recommendedCourses[0].id).to.not.equal("course1"); // 不应推荐已参加的课程
      expect(recommendedCourses[0].difficultyLevel).to.not.equal("advanced"); // 中级学员不应优先推荐高级课程
    });
    
    it('应该处理偏好类别', () => {
      // 准备测试数据
      const studentProfile = {
        fitnessLevel: "intermediate",
        trainingGoals: "提高柔韧性",
        preferredCategories: [5] // 偏好瑜伽
      };
      
      const analysis = {
        categories: { "6": { count: 10 } },
        lastSession: {}
      };
      
      const availableCourses = [
        {
          id: "course1",
          title: "基础健身",
          description: "基础健身课程",
          categoryId: 6,
          difficultyLevel: "beginner"
        },
        {
          id: "course4",
          title: "瑜伽课程",
          description: "提高柔韧性的瑜伽课程",
          categoryId: 5,
          difficultyLevel: "intermediate"
        }
      ];
      
      // 执行测试
      const recommendedCourses = recommendCourses(studentProfile, analysis, availableCourses);
      
      // 验证结果
      expect(recommendedCourses).to.be.an('array');
      expect(recommendedCourses.length).to.be.above(0);
      expect(recommendedCourses[0].categoryId).to.equal(5); // 应优先推荐偏好类别
    });
  });
  
  describe('identifyImprovementAreas', () => {
    it('应该识别需要改进的领域', () => {
      // 准备测试数据
      const analysis = {
        frequencyPerWeek: 1.5, // 低于推荐频率
        averageDuration: 40, // 低于推荐时长
        categories: { "6": { count: 10 } }, // 只有一种类别
        progress: {
          metrics: {
            pushups: {
              trend: { direction: 'decreasing' },
              values: [15, 14, 13, 12]
            },
            weight: {
              trend: { direction: 'decreasing' },
              values: [75, 74, 73, 72],
              changePercent: -4
            }
          }
        }
      };
      
      // 执行测试
      const improvementAreas = identifyImprovementAreas(analysis);
      
      // 验证结果
      expect(improvementAreas).to.be.an('array');
      expect(improvementAreas.length).to.be.above(0);
      
      // 应该识别训练频率不足
      expect(improvementAreas.some(area => area.area === "训练频率")).to.be.true;
      
      // 应该识别训练时长不足
      expect(improvementAreas.some(area => area.area === "训练时长")).to.be.true;
      
      // 应该识别训练多样性不足
      expect(improvementAreas.some(area => area.area === "训练多样性")).to.be.true;
      
      // 应该识别俯卧撑下降趋势
      expect(improvementAreas.some(area => area.area === "俯卧撑")).to.be.true;
    });
    
    it('应该处理体重减轻的特殊情况', () => {
      // 准备测试数据
      const analysis = {
        frequencyPerWeek: 3,
        averageDuration: 60,
        categories: { "6": { count: 5 }, "5": { count: 5 } },
        progress: {
          metrics: {
            weight: {
              trend: { direction: 'decreasing' },
              values: [80, 75, 70, 65<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>