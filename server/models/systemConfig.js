const yapi = require('../yapi.js');

module.exports = {
  name: 'system_config',
  schema: {
    configKey: { type: String, required: true, unique: true },
    configValue: { type: Object, required: true },
    isConfigured: { type: Boolean, default: false },
    createTime: Number,
    updateTime: Number
  },
  
  save: function(data) {
    const config = {
      configKey: data.configKey,
      configValue: data.configValue,
      isConfigured: data.isConfigured !== undefined ? data.isConfigured : true,
      createTime: data.createTime || yapi.commons.time(),
      updateTime: yapi.commons.time()
    };
    
    return this.model.findOneAndUpdate(
      { configKey: data.configKey },
      config,
      { upsert: true, new: true }
    ).exec();
  },
  
  list: function() {
    return this.model.find({}).exec();
  },
  
  getByKey: function(key) {
    return this.model.findOne({ configKey: key }).exec();
  }
};
