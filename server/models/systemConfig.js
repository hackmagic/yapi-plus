const baseModel = require("./base.js");
const mongoose = require("mongoose");

/**
 * 系统配置模型，继承baseModel
 * 修改原因：统一模型继承，与其他模型保持一致
 * 修改时间：2026-05-08
 */
class systemConfigModel extends baseModel {
  constructor() {
    super();
  }

  getName() {
    return "system_config";
  }

  getSchema() {
    return {
      configKey: { type: String, required: true, unique: true },
      configValue: { type: Object, required: true },
      isConfigured: { type: Boolean, default: false },
      createTime: Number,
      updateTime: Number,
    };
  }

  /**
   * 保存或更新配置
   */
  saveConfig(data) {
    const config = {
      configKey: data.configKey,
      configValue: data.configValue,
      isConfigured: data.isConfigured !== undefined ? data.isConfigured : true,
      createTime: data.createTime || yapi.commons.time(),
      updateTime: yapi.commons.time(),
    };

    return this.model
      .findOneAndUpdate({ configKey: data.configKey }, config, { upsert: true, new: true })
      .exec();
  }

  /**
   * 列出所有配置
   */
  listConfig() {
    return this.model.find({}).exec();
  }

  /**
   * 根据key获取配置
   */
  getConfigByKey(key) {
    return this.model.findOne({ configKey: key }).exec();
  }
}

module.exports = systemConfigModel;
