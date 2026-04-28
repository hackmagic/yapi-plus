const yapi = require('./yapi.js');
const fs = require('fs-extra');
const mongoose = require('mongoose');

/**
 * 检查配置状态
 * @returns {Promise<{configured: boolean, missing: Array<string>}>}
 */
async function checkConfigStatus() {
  const missing = [];
  
  // 检查 init.lock 文件
  const lockFileExists = fs.existsSync(yapi.path.join(yapi.WEBROOT_RUNTIME, 'init.lock'));
  
  if (!lockFileExists) {
    missing.push('init_lock');
  }
  
  // 检查数据库配置
  const dbConfig = yapi.WEBCONFIG.db;
  if (!dbConfig || !dbConfig.servername || !dbConfig.DATABASE) {
    // 检查是否有连接字符串
    if (!dbConfig || !dbConfig.connectString) {
      missing.push('database');
    }
  }
  
  // 检查管理员账号配置
  if (!yapi.WEBCONFIG.adminAccount) {
    missing.push('admin_account');
  }
  
  return {
    configured: missing.length === 0,
    missing: missing
  };
}

/**
 * 测试数据库连接
 * @param {Object} dbConfig 数据库配置
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function testDatabaseConnection(dbConfig) {
  let connectString = '';
  
  if (dbConfig.connectString) {
    connectString = dbConfig.connectString;
  } else {
    connectString = `mongodb://${dbConfig.servername}:${dbConfig.port}/${dbConfig.DATABASE}`;
    if (dbConfig.authSource) {
      connectString += `?authSource=${dbConfig.authSource}`;
    }
  }
  
  const options = {
    serverSelectionTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true
  };
  
  if (dbConfig.user) {
    options.user = dbConfig.user;
    options.pass = dbConfig.pass;
  }
  
  try {
    const conn = await mongoose.connect(connectString, options);
    await mongoose.disconnect();
    return { success: true };
  } catch (err) {
    return { 
      success: false, 
      error: err.message 
    };
  }
}

/**
 * 从数据库加载配置
 * @returns {Promise<Object|null>}
 */
async function loadConfigFromDB() {
  try {
    const mongoose = require('mongoose');
    const SystemConfigModel = require('./models/systemConfig.js');
    
    // 检查是否已注册模型
    let SystemConfig;
    if (mongoose.models.system_config) {
      SystemConfig = mongoose.models.system_config;
    } else {
      SystemConfig = mongoose.model('system_config', new mongoose.Schema(SystemConfigModel.schema));
    }
    
    const configs = await SystemConfig.find({ isConfigured: true });
    if (!configs || configs.length === 0) {
      return null;
    }
    
    const configMap = {};
    configs.forEach(item => {
      configMap[item.configKey] = item.configValue;
    });
    
    return configMap;
  } catch (err) {
    console.error('从数据库加载配置失败:', err);
    return null;
  }
}

module.exports = {
  checkConfigStatus,
  testDatabaseConnection,
  loadConfigFromDB
};
