const baseModel = require("./base.js");
const mongoose = require("mongoose");
const autoIncrement = require("../utils/mongoose-auto-increment");

/**
 * AI模型类，继承baseModel
 * 修改原因：统一模型继承，与其他模型保持一致
 * 修改时间：2026-05-08
 */
class aiModel extends baseModel {
  constructor() {
    super();
  }

  getName() {
    return "ai";
  }

  getSchema() {
    return {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      type: {
        type: String,
        enum: ["deepseek", "openai", "claude", "gemini", "custom"],
        default: "deepseek",
      },
      apiKey: {
        type: String,
      },
      model: {
        type: String,
        default: "deepseek-v4-flash",
      },
      temperature: {
        type: Number,
        default: 0.7,
      },
      maxTokens: {
        type: Number,
        default: 1000,
      },
      baseURL: {
        type: String,
        default: "https://api.deepseek.com",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    };
  }

  /**
   * 获取AI助手列表
   */
  getList() {
    return this.model.find({}).exec();
  }

  /**
   * 保存AI助手
   */
  saveAgent(params) {
    const agent = new this.model(params);
    return agent.save();
  }

  /**
   * 更新AI助手
   */
  updateAgent(params) {
    const { id, ...updateData } = params;
    return this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  /**
   * 删除AI助手
   */
  removeAgent(id) {
    return this.model.findByIdAndRemove(id).exec();
  }
}

module.exports = aiModel;
