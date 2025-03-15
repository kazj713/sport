/**
 * 前后端集成测试
 * 
 * 本测试文件验证前端组件能够正确调用后端API，并正确处理响应和错误
 */

const { expect } = require('chai');
const sinon = require('sinon');
const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

// 导入要测试的前端组件
const { MatchingComponent } = require('../src/components/matching/MatchingComponent');
const { TrainingAnalysisComponent } = require('../src/components/analysis/TrainingAnalysisComponent');
const { ChatbotComponent } = require('../src/components/chatbot/ChatbotComponent');
const { VoiceAssistantComponent } = require('../src/components/voice/VoiceAssistantComponent');

describe('前后端集成测试', () => {
  let mock;
  
  beforeEach(() => {
    // 创建一个axios模拟适配器
    mock = new MockAdapter(axios);
  });
  
  afterEach(() => {
    // 重置模拟
    mock.reset();
  });
  
  describe('AI API调用测试', () => {
    it('匹配组件应该正确调用匹配API并显示结果', async () => {
      // 模拟API响应
      const mockResponse = {
        coaches: [
          {
            id: 'coach1',
            name: '教练A',
            specialties: ['核心训练', '耐力训练'],
            rating: 4.8,
            matchScore: 0.92
          },
          {
            id: 'coach2',
            name: '教练B',
            specialties: ['力量训练', '健美'],
            rating: 4.5,
            matchScore: 0.85
          }
        ],
        courses: [
          {
            id: 'course1',
            title: '核心力量训练',
            coachId: 'coach1',
            coachName: '教练A',
            categoryId: 6,
            difficultyLevel: 'intermediate',
            description: '专注于核心肌群的训练课程',
            matchScore: 0.90
          },
          {
            id: 'course2',
            title: '耐力跑步训练',
            coachId: 'coach1',
            coachName: '教练A',
            categoryId: 1,
            difficultyLevel: 'intermediate',
            description: '提高跑步耐力的专业课程',
            matchScore: 0.88
          }
        ]
      };
      
      // 设置模拟响应
      mock.onGet('/api/matching/recommendations').reply(200, mockResponse);
      
      // 渲染组件
      const { getByText, getAllByTestId } = render(<MatchingComponent userId="test-user-1" />);
      
      // 等待API调用完成
      await waitFor(() => {
        expect(getByText('教练A')).to.exist;
        expect(getByText('核心力量训练')).to.exist;
      });
      
      // 验证显示的匹配结果
      const coachItems = getAllByTestId('coach-item');
      expect(coachItems.length).to.equal(2);
      
      const courseItems = getAllByTestId('course-item');
      expect(courseItems.length).to.equal(2);
      
      // 验证匹配分数显示
      expect(getByText('92% 匹配')).to.exist;
      expect(getByText('90% 匹配')).to.exist;
    });
    
    it('训练分析组件应该正确调用分析API并显示结果', async () => {
      // 模拟API响应
      const mockResponse = {
        analysis: {
          totalSessions: 10,
          totalDuration: 650,
          averageDuration: 65,
          trends: {
            durationTrend: { direction: 'increasing', changePercent: 8 },
            metricsTrends: {
              pushups: { direction: 'increasing', changePercent: 25 },
              weight: { direction: 'decreasing', changePercent: -3 }
            }
          },
          progress: {
            metrics: {
              pushups: { values: [10, 12, 15, 18, 20] },
              weight: { values: [75, 74, 73, 72.5, 72] }
            }
          }
        },
        recommendations: {
          summary: '您在过去两个月完成了10次训练，总时长650分钟，平均每次65分钟。您的训练时长呈上升趋势，增加了8%。',
          nextSteps: [
            '增加训练频率至每周3-4次',
            '尝试加入高强度间歇训练',
            '保持当前的体重减轻速度'
          ],
          improvementAreas: [
            { area: '训练频率', suggestion: '增加至每周3-4次' },
            { area: '训练多样性', suggestion: '加入更多种类的训练' }
          ]
        }
      };
      
      // 设置模拟响应
      mock.onGet('/api/students/test-user-1/training-analysis').reply(200, mockResponse);
      
      // 渲染组件
      const { getByText, getByTestId } = render(<TrainingAnalysisComponent userId="test-user-1" />);
      
      // 等待API调用完成
      await waitFor(() => {
        expect(getByText('训练分析')).to.exist;
        expect(getByText('10次训练')).to.exist;
      });
      
      // 验证显示的分析结果
      expect(getByText('650分钟')).to.exist;
      expect(getByText('上升趋势')).to.exist;
      
      // 验证图表渲染
      const progressChart = getByTestId('progress-chart');
      expect(progressChart).to.exist;
      
      // 验证建议显示
      expect(getByText('增加训练频率至每周3-4次')).to.exist;
      expect(getByText('训练频率')).to.exist;
    });
    
    it('智能客服组件应该正确调用客服API并显示回答', async () => {
      // 模拟API响应
      const mockResponse = {
        answer: '您可以在"课程"页面浏览所有可用课程，选择心仪的课程后点击"预订"按钮，然后选择日期和时间完成预订。',
        intent: 'booking_inquiry',
        confidence: 0.95
      };
      
      // 设置模拟响应
      mock.onPost('/api/chatbot/query').reply(200, mockResponse);
      
      // 渲染组件
      const { getByText, getByPlaceholderText } = render(<ChatbotComponent />);
      
      // 输入问题
      const input = getByPlaceholderText('请输入您的问题...');
      fireEvent.change(input, { target: { value: '如何预订课程？' } });
      fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });
      
      // 等待API调用完成
      await waitFor(() => {
        expect(getByText('如何预订课程？')).to.exist;
        expect(getByText('您可以在"课程"页面浏览所有可用课程')).to.exist;
      });
    });
    
    it('语音助手组件应该正确调用语音API', async () => {
      // 模拟API响应
      const initResponse = {
        message: '语音助手初始化成功',
        sessionId: 'test-session-1',
        status: 'ready'
      };
      
      const startResponse = {
        message: '语音识别已启动',
        sessionId: 'test-session-1',
        status: 'listening'
      };
      
      const queryResponse = {
        answer: '您可以在"课程"页面浏览所有可用课程，选择心仪的课程后点击"预订"按钮，然后选择日期和时间完成预订。',
        intent: 'booking_inquiry',
        confidence: 0.95
      };
      
      // 设置模拟响应
      mock.onPost('/api/voice/initialize').reply(200, initResponse);
      mock.onPost('/api/voice/start').reply(200, startResponse);
      mock.onPost('/api/chatbot/query').reply(200, queryResponse);
      
      // 模拟SpeechRecognition API
      global.SpeechRecognition = class {
        constructor() {
          this.onstart = null;
          this.onresult = null;
          this.onend = null;
          this.onerror = null;
        }
        
        start() {
          if (this.onstart) this.onstart();
          
          // 模拟识别结果
          setTimeout(() => {
            if (this.onresult) {
              this.onresult({
                results: [
                  [{ transcript: '如何预订课程？', confidence: 0.9 }]
                ]
              });
            }
            
            if (this.onend) this.onend();
          }, 500);
        }
        
        stop() {
          if (this.onend) this.onend();
        }
      };
      
      // 渲染组件
      const { getByText, getByTestId } = render(<VoiceAssistantComponent />);
      
      // 点击启动按钮
      const startButton = getByTestId('voice-start-button');
      fireEvent.click(startButton);
      
      // 等待API调用完成
      await waitFor(() => {
        expect(getByText('正在聆听...')).to.exist;
      });
      
      // 等待识别结果和回答
      await waitFor(() => {
        expect(getByText('如何预订课程？')).to.exist;
        expect(getByText('您可以在"课程"页面浏览所有可用课程')).to.exist;
      }, { timeout: 2000 });
    });
  });
  
  describe('数据流测试', () => {
    it('应该在组件之间正确传递数据', async () => {
      // 模拟匹配API响应
      const matchingResponse = {
        coaches: [
          {
            id: 'coach1',
            name: '教练A',
            specialties: ['核心训练', '耐力训练'],
            rating: 4.8,
            matchScore: 0.92
          }
        ],
        courses: [
          {
            id: 'course1',
            title: '核心力量训练',
            coachId: 'coach1',
            coachName: '教练A',
            categoryId: 6,
            difficultyLevel: 'intermediate',
            description: '专注于核心肌群的训练课程',
            matchScore: 0.90
          }
        ]
      };
      
      // 模拟预订API响应
      const bookingResponse = {
        id: 'booking1',
        studentId: 'test-user-1',
        courseId: 'course1',
        date: '2025-04-01',
        time: '10:00',
        duration: 60,
        status: 'confirmed'
      };
      
      // 设置模拟响应
      mock.onGet('/api/matching/recommendations').reply(200, matchingResponse);
      mock.onPost('/api/bookings').reply(200, bookingResponse);
      
      // 创建一个包含匹配和预订功能的测试组件
      const TestComponent = () => {
        const [selectedCourse, setSelectedCourse] = useState(null);
        const [booking, setBooking] = useState(null);
        
        const handleCourseSelect = (course) => {
          setSelectedCourse(course);
        };
        
        const handleBooking = async () => {
          if (!selectedCourse) return;
          
          try {
            const response = await axios.post('/api/bookings', {
              courseId: selectedCourse.id,
              date: '2025-04-01',
              time: '10:00',
              duration: 60
            });
            
            setBooking(response.data);
          } catch (error) {
            console.error('预订失败:', error);
          }
        };
        
        return (
          <div>
            <MatchingComponent userId="test-user-1" onCourseSelect={handleCourseSelect} />
            {selectedCourse && (
              <div>
                <h3>已选课程: {selectedCourse.title}</h3>
                <button onClick={handleBooking}>预订课程</button>
              </div>
            )}
            {booking && (
              <div>
                <h3>预订成功</h3>
                <p>预订ID: {booking.id}</p>
                <p>状态: {booking.status}</p>
              </div>
            )}
          </div>
        );
      };
      
      // 渲染测试组件
      const { getByText, findByText } = render(<TestComponent />);
      
      // 等待匹配结果显示
      await findByText('核心力量训练');
      
      // 选择课程
      fireEvent.click(getByText('核心力量训练'));
      
      // 验证选择的课程显示
      expect(getByText('已选课程: 核心力量训练')).to.exist;
      
      // 点击预订按钮
      fireEvent.click(getByText('预订课程'));
      
      // 等待预订成功显示
      await findByText('预订成功');
      expect(getByText('预订ID: booking1')).to.exist;
      expect(getByText('状态: confirmed')).to.exist;
    });
  });
  
  describe('错误处理测试', () => {
    it('应该正确处理API错误', async () => {
      // 设置模拟错误响应
      mock.onGet('/api/matching/recommendations').reply(500, {
        error: '服务器错误',
        message: '无法获取推荐'
      });
      
      // 渲染组件
      const { findByText } = render(<MatchingComponent userId="test-user-1" />);
      
      // 等待错误显示
      const errorElement = await findByText('获取推荐失败');
      expect(errorElement).to.exist;
      expect(await findByText('请稍后再试')).to.exist;
    });
    
    it('应该处理网络超时', async () => {
      // 设置模拟网络超时
      mock.onGet('/api/students/test-user-1/training-analysis').timeout();
      
      // 渲染组件
      const { findByText } = render(<TrainingAnalysisComponent userId="test-user-1" />);
      
      // 等待错误显示
      const errorElement = await findByText('请求超时');
      expect(errorElement).to.exist;
    });
    
    it('应该处理认证错误', async () => {
      // 设置模拟认证错误响应
      mock.onGet('/api/students/test-user-1/training-analysis').reply(401, {
        error: '未授权',
        message: '请先登录'
      });
      
      // 渲染组件
      const { findByText } = render(<TrainingAnalysisComponent userId="test-user-1" />);
      
      // 等待错误显示
      const errorElement = await findByText('请先登录');
      expect(errorElement).to.exist;
      
      // 验证登录按钮显示
      expect(await findByText('登录')).to.exist;
    });
  });
  
  describe('认证与授权测试', () => {
    it('应该在请求中包含认证令牌', async () => {
      // 创建一个spy来监视axios请求
      const spy = sinon.spy(axios, 'get');
      
      // 模拟localStorage中的令牌
      global.localStorage = {
        getItem: sinon.stub().returns('test-token')
      };
      
      // 设置模拟响应
      mock.onGet('/api/students/test-user-1/training-analysis').reply(200, {
        analysis: {},
        recommendations: {}
      });
      
      // 渲染组件
      render(<TrainingAnalysisComponent userId="test-user-1" />);
      
      // 等待API调用完成
      await waitFor(() => {
        expect(spy.called).to.be.true;
      });
      
      // 验证请求头中包含认证令牌
      const call = spy.getCall(0);
      expect(call.args[1].headers.Authorization).to.equal('Bearer test-token');
      
      // 恢复spy
      spy.restore();
    });
  });
});
