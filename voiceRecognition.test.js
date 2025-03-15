/**
 * 语音识别功能单元测试
 */

const { expect } = require('chai');
const { 
  SpeechRecognition, 
  SpeechSynthesis,
  VoiceAssistant
} = require('../src/ai/voice/voiceRecognition');

describe('语音识别功能测试', () => {
  describe('SpeechRecognition', () => {
    it('应该正确初始化语音识别实例', () => {
      // 准备测试数据
      const options = {
        language: 'zh-CN',
        continuous: true,
        interimResults: true,
        maxAlternatives: 1
      };
      
      // 执行测试
      const recognition = new SpeechRecognition(options);
      
      // 验证结果
      expect(recognition).to.be.an('object');
      expect(recognition.options).to.be.an('object');
      expect(recognition.options.language).to.equal('zh-CN');
      expect(recognition.options.continuous).to.be.true;
      expect(recognition.options.interimResults).to.be.true;
      expect(recognition.options.maxAlternatives).to.equal(1);
      expect(recognition.isListening).to.be.false;
    });
    
    it('应该使用默认选项', () => {
      // 执行测试
      const recognition = new SpeechRecognition();
      
      // 验证结果
      expect(recognition).to.be.an('object');
      expect(recognition.options).to.be.an('object');
      expect(recognition.options.language).to.equal('zh-CN');
      expect(recognition.options.continuous).to.be.true;
      expect(recognition.options.interimResults).to.be.true;
      expect(recognition.options.maxAlternatives).to.equal(1);
    });
    
    it('应该处理回调函数', (done) => {
      // 准备测试数据
      let startCalled = false;
      let resultCalled = false;
      let endCalled = false;
      let errorCalled = false;
      
      const options = {
        onStart: () => { startCalled = true; },
        onResult: (results) => { 
          resultCalled = true; 
          expect(results).to.be.an('array');
        },
        onEnd: () => { 
          endCalled = true; 
          // 验证所有回调都被调用
          expect(startCalled).to.be.true;
          expect(resultCalled).to.be.true;
          expect(endCalled).to.be.true;
          expect(errorCalled).to.be.false;
          done();
        },
        onError: () => { errorCalled = true; }
      };
      
      // 执行测试
      const recognition = new SpeechRecognition(options);
      
      // 模拟语音识别过程
      recognition.onStart();
      recognition.onResult([{
        transcript: '测试文本',
        confidence: 0.9,
        isFinal: true
      }]);
      recognition.onEnd();
    });
    
    it('应该处理错误情况', (done) => {
      // 准备测试数据
      let errorCalled = false;
      
      const options = {
        onError: (error) => { 
          errorCalled = true; 
          expect(error).to.be.an('object');
          expect(error.error).to.equal('测试错误');
          expect(error.message).to.equal('这是一个测试错误');
          done();
        }
      };
      
      // 执行测试
      const recognition = new SpeechRecognition(options);
      
      // 模拟错误
      recognition.onError({
        error: '测试错误',
        message: '这是一个测试错误'
      });
    });
    
    it('应该正确获取错误信息', () => {
      // 准备测试数据
      const recognition = new SpeechRecognition();
      const errorCodes = [
        'no-speech',
        'aborted',
        'audio-capture',
        'network',
        'not-allowed',
        'service-not-allowed',
        'bad-grammar',
        'language-not-supported'
      ];
      
      // 执行测试并验证结果
      errorCodes.forEach(code => {
        const message = recognition._getErrorMessage(code);
        expect(message).to.be.a('string');
        expect(message.length).to.be.above(0);
        expect(message).to.not.equal('未知错误');
      });
      
      // 测试未知错误码
      const unknownMessage = recognition._getErrorMessage('unknown-code');
      expect(unknownMessage).to.equal('未知错误');
    });
  });
  
  describe('SpeechSynthesis', () => {
    it('应该正确初始化语音合成实例', () => {
      // 准备测试数据
      const options = {
        language: 'zh-CN',
        pitch: 1.2,
        rate: 0.9,
        volume: 0.8
      };
      
      // 执行测试
      const synthesis = new SpeechSynthesis(options);
      
      // 验证结果
      expect(synthesis).to.be.an('object');
      expect(synthesis.options).to.be.an('object');
      expect(synthesis.options.language).to.equal('zh-CN');
      expect(synthesis.options.pitch).to.equal(1.2);
      expect(synthesis.options.rate).to.equal(0.9);
      expect(synthesis.options.volume).to.equal(0.8);
      expect(synthesis.isSpeaking).to.be.false;
    });
    
    it('应该使用默认选项', () => {
      // 执行测试
      const synthesis = new SpeechSynthesis();
      
      // 验证结果
      expect(synthesis).to.be.an('object');
      expect(synthesis.options).to.be.an('object');
      expect(synthesis.options.language).to.equal('zh-CN');
      expect(synthesis.options.pitch).to.equal(1);
      expect(synthesis.options.rate).to.equal(1);
      expect(synthesis.options.volume).to.equal(1);
    });
    
    it('应该处理回调函数', (done) => {
      // 准备测试数据
      let startCalled = false;
      let endCalled = false;
      let pauseCalled = false;
      let resumeCalled = false;
      let errorCalled = false;
      
      const options = {
        onStart: () => { startCalled = true; },
        onEnd: () => { 
          endCalled = true; 
          // 验证回调被调用
          expect(startCalled).to.be.true;
          expect(endCalled).to.be.true;
          expect(errorCalled).to.be.false;
          done();
        },
        onPause: () => { pauseCalled = true; },
        onResume: () => { resumeCalled = true; },
        onError: () => { errorCalled = true; }
      };
      
      // 执行测试
      const synthesis = new SpeechSynthesis(options);
      
      // 模拟语音合成过程
      synthesis.onStart();
      synthesis.onEnd();
    });
    
    it('应该处理错误情况', (done) => {
      // 准备测试数据
      let errorCalled = false;
      
      const options = {
        onError: (error) => { 
          errorCalled = true; 
          expect(error).to.be.an('object');
          expect(error.error).to.equal('synthesis-error');
          expect(error.message).to.equal('语音合成错误');
          done();
        }
      };
      
      // 执行测试
      const synthesis = new SpeechSynthesis(options);
      
      // 模拟错误
      synthesis.onError({
        error: 'synthesis-error',
        message: '语音合成错误'
      });
    });
  });
  
  describe('VoiceAssistant', () => {
    it('应该正确初始化语音助手实例', () => {
      // 准备测试数据
      const options = {
        language: 'zh-CN',
        autoRestart: true,
        continuous: true
      };
      
      // 执行测试
      const assistant = new VoiceAssistant(options);
      
      // 验证结果
      expect(assistant).to.be.an('object');
      expect(assistant.options).to.be.an('object');
      expect(assistant.options.language).to.equal('zh-CN');
      expect(assistant.options.autoRestart).to.be.true;
      expect(assistant.options.continuous).to.be.true;
      expect(assistant.isActive).to.be.false;
      expect(assistant.isListening).to.be.false;
      expect(assistant.isSpeaking).to.be.false;
      expect(assistant.recognition).to.be.an('object');
      expect(assistant.synthesis).to.be.an('object');
    });
    
    it('应该使用默认选项', () => {
      // 执行测试
      const assistant = new VoiceAssistant();
      
      // 验证结果
      expect(assistant).to.be.an('object');
      expect(assistant.options).to.be.an('object');
      expect(assistant.options.language).to.equal('zh-CN');
      expect(assistant.options.autoRestart).to.be.true;
      expect(assistant.options.continuous).to.be.true;
    });
    
    it('应该处理回调函数', (done) => {
      // 准备测试数据
      let startCalled = false;
      let stopCalled = false;
      let queryCalled = false;
      let responseCalled = false;
      let errorCalled = false;
      
      const options = {
        onStart: () => { startCalled = true; },
        onStop: () => { stopCalled = true; },
        onQuery: (query) => { 
          queryCalled = true; 
          expect(query).to.equal('测试查询');
        },
        onResponse: (response) => { 
          responseCalled = true; 
          expect(response).to.equal('测试响应');
          
          // 验证回调被调用
          expect(startCalled).to.be.true;
          expect(queryCalled).to.be.true;
          expect(responseCalled).to.be.true;
          expect(errorCalled).to.be.false;
          done();
        },
        onError: () => { errorCalled = true; }
      };
      
      // 执行测试
      const assistant = new VoiceAssistant(options);
      
      // 模拟语音助手过程
      assistant.onStart();
      assistant._processQuery('测试查询');
      assistant.onResponse('测试响应');
    });
    
    it('应该处理识别结果', () => {
      // 准备测试数据
      let processedQuery = '';
      
      const options = {
        onQuery: (query) => { processedQuery = query; }
      };
      
      // 执行测试
      const assistant = new VoiceAssistant(options);
      
      // 模拟识别结果
      assistant._handleRecognitionResult([
        {
          transcript: '第一个结果',
          confidence: 0.7,
          isFinal: true
        },
        {
          transcript: '第二个结果',
          confidence: 0.9,
          isFinal: true
        }
      ]);
      
      // 验证结果 - 应该选择置信度最高的结果
      expect(processedQuery).to.equal('第二个结果');
    });
    
    it('应该忽略非最终结果', () => {
      // 准备测试数据
      let processedQuery = '';
      
      const options = {
        onQuery: (query) => { processedQuery = query; }
      };
      
      // 执行测试
      const assistant = new VoiceAssistant(options);
      
      // 模拟识别结果 - 只有非最终结果
      assistant._handleRecognitionResult([
        {
          transcript: '非最终结果',
          confidence: 0.7,
          isFinal: false
        }
      ]);
      
      // 验证结果 - 应该忽略非最终结果
      expect(processedQuery).to.equal('');
    });
    
    it('应该处理语音识别开始和结束', () => {
      // 执行测试
      const assistant = new VoiceAssistant();
      
      // 初始状态
      expect(assistant.isListening).to.be.false;
      
      // 模拟识别开始
      assistant._handleRecognitionStart();
      expect(assistant.isListening).to.be.true;
      
      // 模拟识别结束
      assistant._handleRecognitionEnd();
      expect(assistant.isListening).to.be.false;
    });
    
    it('应该处理语音合成开始和结束', () => {
      // 执行测试
      const assistant = new VoiceAssistant();
      
      // 初始状态
      expect(assistant.isSpeaking).to.be.false;
      
      // 模拟合成开始
      assistant._handleSynthesisStart();
      expect(assistant.isSpeaking).to.be.true;
      
      // 模拟合成结束
      assistant._handleSynthesisEnd();
      expect(assistant.isSpeaking).to.be.false;
    });
  });
});
