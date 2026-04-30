const test = require('ava');

test('yapi.WEBCONFIG - 默认配置存在', t => {
  // 简单测试：验证模块可以被引入
  try {
    const yapi = require('../../server/yapi.js');
    t.truthy(yapi);
    t.truthy(yapi.WEBCONFIG);
  } catch (error) {
    t.fail(`yapi 模块加载失败: ${error.message}`);
  }
});

test('yapi 对象方法 - getInst 存在', t => {
  try {
    const yapi = require('../../server/yapi.js');
    t.truthy(yapi.getInst);
    t.is(typeof yapi.getInst, 'function');
  } catch (error) {
    t.fail(`yapi.getInst 访问失败: ${error.message}`);
  }
});

test('yapi 对象方法 - getModel 存在', t => {
  try {
    const yapi = require('../../server/yapi.js');
    t.truthy(yapi.getModel);
    t.is(typeof yapi.getModel, 'function');
  } catch (error) {
    t.fail(`yapi.getModel 访问失败: ${error.message}`);
  }
});

test('配置文件加载 - config.json 结构', t => {
  try {
    const yapi = require('../../server/yapi.js');
    const config = yapi.WEBCONFIG;
    
    t.truthy(config);
    t.is(typeof config, 'object');
    
    // 验证配置结构
    t.truthy(config.db);
    // mail 可能不存在
    if (config.mail) {
      t.truthy(typeof config.mail === 'object');
    }
  } catch (error) {
    t.fail(`配置结构验证失败: ${error.message}`);
  }
});

test('loadConfigFromDB - 函数存在', async t => {
  try {
    const yapi = require('../../server/yapi.js');
    // 检查 loadConfigFromDB 函数是否存在
    const loadConfigFromDB = yapi.loadConfigFromDB;
    t.is(typeof loadConfigFromDB, 'function');
    
    // 不调用函数，只验证其存在
    t.pass();
  } catch (error) {
    t.fail(`loadConfigFromDB 验证失败: ${error.message}`);
  }
});

test('yapi.getInsts - 存在', t => {
  try {
    const yapi = require('../../server/yapi.js');
    t.truthy(yapi.getInsts);
  } catch (error) {
    t.fail(`yapi.getInsts 访问失败: ${error.message}`);
  }
});

test('yapi.fs - 文件系统模块存在', t => {
  try {
    const yapi = require('../../server/yapi.js');
    t.truthy(yapi.fs);
    t.is(typeof yapi.fs.existsSync, 'function');
  } catch (error) {
    t.fail(`yapi.fs 访问失败: ${error.message}`);
  }
});

test('yapi.path - 路径模块存在', t => {
  try {
    const yapi = require('../../server/yapi.js');
    t.truthy(yapi.path);
    t.is(typeof yapi.path.join, 'function');
  } catch (error) {
    t.fail(`yapi.path 访问失败: ${error.message}`);
  }
});

test('yapi.delInst - 函数存在', t => {
  try {
    const yapi = require('../../server/yapi.js');
    t.truthy(yapi.delInst);
    t.is(typeof yapi.delInst, 'function');
  } catch (error) {
    t.fail(`yapi.delInst 访问失败: ${error.message}`);
  }
});

test('yapi WEBROOT 常量存在', t => {
  try {
    const yapi = require('../../server/yapi.js');
    t.truthy(yapi.WEBROOT);
    t.truthy(yapi.WEBROOT_SERVER);
    t.truthy(yapi.WEBROOT_RUNTIME);
    t.truthy(yapi.WEBROOT_LOG);
  } catch (error) {
    t.fail(`yapi 常量访问失败: ${error.message}`);
  }
});