const yapi = require('../yapi.js');
const baseController = require('./base.js');
const axios = require('axios');

class aiController extends baseController {
  constructor(ctx) {
    super(ctx);
    this.model = yapi.getModel('ai');
  }

  /**
    * 获取 AI 助手列表
    */
   async getAiAgents(ctx) {
     if (this.$auth !== true) {
       return (ctx.body = yapi.commons.resReturn(null, 40011, '请登录...'));
     }
     try {
       const agents = await this.model.getList();
       ctx.body = yapi.commons.resSuccess(agents);
     } catch (err) {
       ctx.body = yapi.commons.resError(err.message);
     }
   }

  /**
    * 创建 AI 助手
    */
   async addAiAgent(ctx) {
     if (this.$auth !== true) {
       return (ctx.body = yapi.commons.resReturn(null, 40011, '请登录...'));
     }
     try {
       const params = ctx.request.body;
       if (!params.baseURL) {
         params.baseURL = 'https://api.deepseek.com';
       }
       const agent = await this.model.save(params);
       ctx.body = yapi.commons.resSuccess(agent);
     } catch (err) {
       ctx.body = yapi.commons.resError(err.message);
     }
   }

  /**
    * 更新 AI 助手
    */
   async updateAiAgent(ctx) {
     if (this.$auth !== true) {
       return (ctx.body = yapi.commons.resReturn(null, 40011, '请登录...'));
     }
     try {
       const params = ctx.request.body;
       const agent = await this.model.update(params);
       ctx.body = yapi.commons.resSuccess(agent);
     } catch (err) {
       ctx.body = yapi.commons.resError(err.message);
     }
   }

  /**
    * 删除 AI 助手
    */
   async deleteAiAgent(ctx) {
     if (this.$auth !== true) {
       return (ctx.body = yapi.commons.resReturn(null, 40011, '请登录...'));
     }
     try {
       const id = ctx.request.body.id;
       await this.model.remove(id);
       ctx.body = yapi.commons.resSuccess({});
     } catch (err) {
       ctx.body = yapi.commons.resError(err.message);
     }
   }

  /**
   * 调用 AI API
   */
  async callAiApi(agent, messages) {
    const { type, apiKey, model, baseURL } = agent;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };

    let apiUrl = baseURL || 'https://api.deepseek.com';
    let requestBody = {};

    switch (type) {
      case 'deepseek':
        apiUrl = `${apiUrl}/v1/chat/completions`;
        requestBody = {
          model: model || 'deepseek-chat',
          messages: messages,
          temperature: agent.temperature || 0.7,
          max_tokens: agent.maxTokens || 1000
        };
        break;
      case 'openai':
        apiUrl = `${apiUrl}/v1/chat/completions`;
        requestBody = {
          model: model || 'gpt-3.5-turbo',
          messages: messages,
          temperature: agent.temperature || 0.7,
          max_tokens: agent.maxTokens || 1000
        };
        break;
      case 'claude':
        apiUrl = `${apiUrl}/v1/messages`;
        requestBody = {
          model: model || 'claude-3-opus-20240229',
          messages: messages,
          temperature: agent.temperature || 0.7,
          max_tokens: agent.maxTokens || 1000
        };
        break;
      case 'gemini':
        apiUrl = `${apiUrl}/v1beta/models/${model || 'gemini-pro'}:generateContent`;
        requestBody = {
          contents: messages,
          generationConfig: {
            temperature: agent.temperature || 0.7,
            maxOutputTokens: agent.maxTokens || 1000
          }
        };
        break;
      default:
        apiUrl = `${apiUrl}/v1/chat/completions`;
        requestBody = {
          model: model || 'deepseek-chat',
          messages: messages,
          temperature: agent.temperature || 0.7,
          max_tokens: agent.maxTokens || 1000
        };
    }

    const response = await axios.post(apiUrl, requestBody, { headers, timeout: 60000 });
    return response.data;
  }

  /**
    * 与 AI 助手对话
    */
   async chatWithAiAgent(ctx) {
     if (this.$auth !== true) {
       return (ctx.body = yapi.commons.resReturn(null, 40011, '请登录...'));
     }
     try {
      const params = ctx.request.body;
      const { agentId, message } = params;

      const agents = await this.model.getList();
      const agent = agents.find(a => a._id.toString() === agentId);

      if (!agent) {
        ctx.body = yapi.commons.resError('AI 助手不存在');
        return;
      }

      const messages = [
        { role: 'system', content: '你是一个专业的 API 助手，帮助开发者管理 API 接口。' },
        { role: 'user', content: message }
      ];

      const result = await this.callAiApi(agent, messages);

      let reply = '';
      if (result.choices && result.choices[0]) {
        reply = result.choices[0].message.content;
      } else if (result.content) {
        reply = result.content;
      } else if (result.candidates && result.candidates[0]) {
        reply = result.candidates[0].content.parts[0].text;
      }

      const response = {
        id: Date.now().toString(),
        message: reply,
        timestamp: new Date().toISOString()
      };

      ctx.body = yapi.commons.resSuccess(response);
    } catch (err) {
      ctx.body = yapi.commons.resError(err.message);
    }
  }

  /**
    * 生成 API 文档
    */
   async generateApiDoc(ctx) {
     if (this.$auth !== true) {
       return (ctx.body = yapi.commons.resReturn(null, 40011, '请登录...'));
     }
     try {
      const params = ctx.request.body;
      const { projectId, interfaceId, agentId } = params;

      if (!agentId) {
        ctx.body = yapi.commons.resError('请选择 AI 助手');
        return;
      }

      const interfaceModel = yapi.getModel('interface');
      const interfaceData = await interfaceModel.get(interfaceId);
      if (!interfaceData) {
        ctx.body = yapi.commons.resError('接口不存在');
        return;
      }

      const agents = await this.model.getList();
      const agent = agents.find(a => a._id.toString() === agentId);

      if (!agent) {
        ctx.body = yapi.commons.resError('AI 助手不存在');
        return;
      }

      const prompt = `请为以下 API 接口生成详细的文档说明（Markdown格式），包括：接口名称、接口描述、请求路径、请求方法、请求参数说明、响应参数示例等。
      
接口信息：
名称：${interfaceData.title}
路径：${interfaceData.path}
方法：${interfaceData.method}
描述：${interfaceData.desc}
请求参数：${JSON.stringify(interfaceData.req_query || [])}
请求体：${interfaceData.req_body_other || JSON.stringify(interfaceData.req_body_form || [])}
响应体：${interfaceData.res_body}`;

      const messages = [
        { role: 'system', content: '你是一个专业的 API 文档生成助手，擅长生成清晰、易读的 API 文档。' },
        { role: 'user', content: prompt }
      ];

      const result = await this.callAiApi(agent, messages);

      let content = '';
      if (result.choices && result.choices[0]) {
        content = result.choices[0].message.content;
      } else if (result.content) {
        content = result.content;
      }

      const doc = {
        id: Date.now().toString(),
        projectId,
        interfaceId,
        content: content || '# API 文档\n\n生成失败',
        generatedAt: new Date().toISOString()
      };

      ctx.body = yapi.commons.resSuccess(doc);
    } catch (err) {
      ctx.body = yapi.commons.resError(err.message);
    }
  }

  /**
    * 生成测试用例
    */
   async generateTestCase(ctx) {
     if (this.$auth !== true) {
       return (ctx.body = yapi.commons.resReturn(null, 40011, '请登录...'));
     }
     try {
      const params = ctx.request.body;
      const { projectId, interfaceId, agentId } = params;

      if (!agentId) {
        ctx.body = yapi.commons.resError('请选择 AI 助手');
        return;
      }

      const interfaceModel = yapi.getModel('interface');
      const interfaceData = await interfaceModel.get(interfaceId);
      if (!interfaceData) {
        ctx.body = yapi.commons.resError('接口不存在');
        return;
      }

      const agents = await this.model.getList();
      const agent = agents.find(a => a._id.toString() === agentId);

      if (!agent) {
        ctx.body = yapi.commons.resError('AI 助手不存在');
        return;
      }

      const prompt = `请为以下 API 接口生成自动化测试用例代码。要求包括正常的请求测试和边界情况测试，并提供详细的代码注释。
      
接口信息：
名称：${interfaceData.title}
路径：${interfaceData.path}
方法：${interfaceData.method}
请求参数：${JSON.stringify(interfaceData.req_query || [])}
请求体：${interfaceData.req_body_other || JSON.stringify(interfaceData.req_body_form || [])}
响应体：${interfaceData.res_body}`;

      const messages = [
        { role: 'system', content: '你是一个专业的测试工程师，擅长生成高质量的测试用例代码。' },
        { role: 'user', content: prompt }
      ];

      const result = await this.callAiApi(agent, messages);

      let content = '';
      if (result.choices && result.choices[0]) {
        content = result.choices[0].message.content;
      } else if (result.content) {
        content = result.content;
      }

      const testCase = {
        id: Date.now().toString(),
        projectId,
        interfaceId,
        content: content || '# 测试用例\n\n生成失败',
        generatedAt: new Date().toISOString()
      };

      ctx.body = yapi.commons.resSuccess(testCase);
    } catch (err) {
      ctx.body = yapi.commons.resError(err.message);
    }
  }
}

module.exports = aiController;
