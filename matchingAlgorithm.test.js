/**
 * 智能匹配算法单元测试
 */

const { expect } = require('chai');
const { 
  calculateMatchScore, 
  findBestMatches, 
  generateRecommendations 
} = require('../src/ai/matching/matchingAlgorithm');

describe('智能匹配算法测试', () => {
  describe('calculateMatchScore', () => {
    it('应该根据学生和教练特征计算匹配分数', () => {
      // 准备测试数据
      const student = {
        id: 'student1',
        fitnessLevel: 'intermediate',
        trainingGoals: '增强核心力量，提高耐力',
        preferredCategories: [1, 3, 6],
        availability: ['weekday_evening', 'weekend_morning']
      };
      
      const coach = {
        id: 'coach1',
        specialties: ['核心训练', '耐力训练', '力量训练'],
        categories: [1, 6],
        rating: 4.8,
        teachingLevel: ['beginner', 'intermediate'],
        availability: ['weekday_evening', 'weekend_morning', 'weekend_afternoon']
      };
      
      // 执行测试
      const score = calculateMatchScore(student, coach);
      
      // 验证结果
      expect(score).to.be.a('number');
      expect(score).to.be.at.least(0);
      expect(score).to.be.at.most(1);
      expect(score).to.be.above(0.7); // 这个例子中应该有较高的匹配度
    });
    
    it('应该对不匹配的特征返回较低的分数', () => {
      // 准备测试数据
      const student = {
        id: 'student2',
        fitnessLevel: 'advanced',
        trainingGoals: '马拉松训练，长跑技巧',
        preferredCategories: [2, 4],
        availability: ['weekday_morning']
      };
      
      const coach = {
        id: 'coach2',
        specialties: ['力量训练', '健美'],
        categories: [6, 7],
        rating: 4.5,
        teachingLevel: ['beginner', 'intermediate'],
        availability: ['weekend_morning', 'weekend_afternoon']
      };
      
      // 执行测试
      const score = calculateMatchScore(student, coach);
      
      // 验证结果
      expect(score).to.be.a('number');
      expect(score).to.be.at.least(0);
      expect(score).to.be.at.most(1);
      expect(score).to.be.below(0.5); // 这个例子中应该有较低的匹配度
    });
    
    it('应该处理缺失数据', () => {
      // 准备测试数据
      const student = {
        id: 'student3',
        fitnessLevel: 'beginner',
        // 缺少trainingGoals
        preferredCategories: [1]
        // 缺少availability
      };
      
      const coach = {
        id: 'coach3',
        specialties: ['初级训练'],
        categories: [1, 2],
        // 缺少rating
        teachingLevel: ['beginner']
        // 缺少availability
      };
      
      // 执行测试
      const score = calculateMatchScore(student, coach);
      
      // 验证结果
      expect(score).to.be.a('number');
      expect(score).to.be.at.least(0);
      expect(score).to.be.at.most(1);
      // 即使有缺失数据，仍然应该计算出合理的分数
    });
  });
  
  describe('findBestMatches', () => {
    it('应该返回排序后的最佳匹配列表', () => {
      // 准备测试数据
      const student = {
        id: 'student1',
        fitnessLevel: 'intermediate',
        trainingGoals: '增强核心力量，提高耐力',
        preferredCategories: [1, 3, 6]
      };
      
      const coaches = [
        {
          id: 'coach1',
          specialties: ['核心训练', '耐力训练'],
          categories: [1, 6],
          rating: 4.8,
          teachingLevel: ['beginner', 'intermediate']
        },
        {
          id: 'coach2',
          specialties: ['力量训练', '健美'],
          categories: [6, 7],
          rating: 4.5,
          teachingLevel: ['intermediate', 'advanced']
        },
        {
          id: 'coach3',
          specialties: ['瑜伽', '柔韧性训练'],
          categories: [3, 5],
          rating: 4.9,
          teachingLevel: ['beginner', 'intermediate', 'advanced']
        }
      ];
      
      // 执行测试
      const matches = findBestMatches(student, coaches, 3);
      
      // 验证结果
      expect(matches).to.be.an('array');
      expect(matches.length).to.be.at.most(3);
      expect(matches[0].score).to.be.at.least(matches[1].score); // 验证排序
      expect(matches[0].coach).to.be.an('object');
      expect(matches[0].coach.id).to.be.a('string');
    });
    
    it('应该处理空教练列表', () => {
      // 准备测试数据
      const student = {
        id: 'student1',
        fitnessLevel: 'intermediate',
        trainingGoals: '增强核心力量，提高耐力',
        preferredCategories: [1, 3, 6]
      };
      
      const coaches = [];
      
      // 执行测试
      const matches = findBestMatches(student, coaches, 3);
      
      // 验证结果
      expect(matches).to.be.an('array');
      expect(matches.length).to.equal(0);
    });
    
    it('应该限制返回的匹配数量', () => {
      // 准备测试数据
      const student = {
        id: 'student1',
        fitnessLevel: 'intermediate',
        trainingGoals: '增强核心力量，提高耐力',
        preferredCategories: [1, 3, 6]
      };
      
      const coaches = Array(10).fill(0).map((_, i) => ({
        id: `coach${i}`,
        specialties: ['核心训练', '耐力训练'],
        categories: [1, 6],
        rating: 4.5,
        teachingLevel: ['beginner', 'intermediate']
      }));
      
      // 执行测试
      const matches = findBestMatches(student, coaches, 5);
      
      // 验证结果
      expect(matches).to.be.an('array');
      expect(matches.length).to.equal(5);
    });
  });
  
  describe('generateRecommendations', () => {
    it('应该生成包含教练和课程的推荐', () => {
      // 准备测试数据
      const student = {
        id: 'student1',
        fitnessLevel: 'intermediate',
        trainingGoals: '增强核心力量，提高耐力',
        preferredCategories: [1, 3, 6]
      };
      
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
        },
        {
          id: 'course3',
          title: '高级健美训练',
          coachId: 'coach2',
          categoryId: 7,
          difficultyLevel: 'advanced',
          description: '针对健美比赛的专业训练'
        }
      ];
      
      // 执行测试
      const recommendations = generateRecommendations(student, coaches, courses);
      
      // 验证结果
      expect(recommendations).to.be.an('object');
      expect(recommendations.coaches).to.be.an('array');
      expect(recommendations.courses).to.be.an('array');
      expect(recommendations.coaches.length).to.be.above(0);
      expect(recommendations.courses.length).to.be.above(0);
      expect(recommendations.summary).to.be.a('string');
      expect(recommendations.summary.length).to.be.above(0);
    });
    
    it('应该处理没有匹配的情况', () => {
      // 准备测试数据
      const student = {
        id: 'student1',
        fitnessLevel: 'beginner',
        trainingGoals: '减肥',
        preferredCategories: [5]
      };
      
      const coaches = [
        {
          id: 'coach1',
          name: '教练A',
          specialties: ['高级力量训练'],
          categories: [6],
          rating: 4.8,
          teachingLevel: ['advanced']
        }
      ];
      
      const courses = [
        {
          id: 'course1',
          title: '专业健美训练',
          coachId: 'coach1',
          categoryId: 6,
          difficultyLevel: 'advanced',
          description: '针对健美比赛的专业训练'
        }
      ];
      
      // 执行测试
      const recommendations = generateRecommendations(student, coaches, courses);
      
      // 验证结果
      expect(recommendations).to.be.an('object');
      expect(recommendations.coaches).to.be.an('array');
      expect(recommendations.courses).to.be.an('array');
      // 即使没有好的匹配，也应该提供一些建议
      expect(recommendations.summary).to.be.a('string');
      expect(recommendations.summary.length).to.be.above(0);
    });
  });
});
