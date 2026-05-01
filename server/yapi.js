const path = require("path");
const fs = require("fs-extra");
const nodemailer = require("nodemailer");
const config = require("../config.json");

let insts = new Map();
let mail;

const WEBROOT = path.resolve(__dirname, ".."); //路径
const WEBROOT_SERVER = __dirname;
const WEBROOT_RUNTIME = path.resolve(__dirname, "../..");
const WEBROOT_LOG = path.join(WEBROOT_RUNTIME, "log");

// 支持动态配置的 WEBCONFIG
let WEBCONFIG = { ...config };

fs.ensureDirSync(WEBROOT_LOG);

/**
 * 从数据库加载配置并更新 WEBCONFIG
 */
async function loadConfigFromDB() {
  try {
    const mongoose = require("mongoose");

    // 检查数据库是否已连接
    if (mongoose.connection.readyState !== 1) {
      console.log("数据库未连接，跳过加载配置");
      return false;
    }

    const SystemConfigModel = require("./models/systemConfig.js");
    const SystemConfig = mongoose.model(
      "system_config",
      new mongoose.Schema(SystemConfigModel.schema),
    );

    const configs = await SystemConfig.find({ isConfigured: true });
    if (configs && configs.length > 0) {
      const configMap = {};
      configs.forEach((item) => {
        configMap[item.configKey] = item.configValue;
      });

      // 更新 WEBCONFIG
      if (configMap.database) {
        WEBCONFIG.db = configMap.database;
      }
      if (configMap.admin) {
        WEBCONFIG.adminAccount = configMap.admin.adminAccount;
      }
      if (configMap.mail) {
        WEBCONFIG.mail = configMap.mail;
      }

      console.log("✓ 已从数据库加载配置");
      return true;
    }
    return false;
  } catch (err) {
    console.log("数据库配置加载失败，使用 config.json:", err.message);
    return false;
  }
}

// 初始化邮件配置
if (WEBCONFIG.mail && WEBCONFIG.mail.enable) {
  mail = nodemailer.createTransport(WEBCONFIG.mail);
}

/**
 * 获取一个model实例，如果不存在则创建一个新的返回
 * @param {*} m class
 * @example
 * yapi.getInst(groupModel, arg1, arg2)
 */
function getInst(m, ...args) {
  if (!insts.get(m)) {
    insts.set(m, new m(args));
  }
  return insts.get(m);
}

function delInst(m) {
  try {
    insts.delete(m);
  } catch (err) {
    console.error(err); // eslint-disable-line
  }
}

function getModel(modelName) {
  const modelPath = path.join(__dirname, "models", modelName + ".js");
  if (fs.existsSync(modelPath)) {
    const model = require(modelPath);
    return getInst(model);
  }
  return null;
}

let r = {
  fs: fs,
  path: path,
  WEBROOT: WEBROOT,
  WEBROOT_SERVER: WEBROOT_SERVER,
  WEBROOT_RUNTIME: WEBROOT_RUNTIME,
  WEBROOT_LOG: WEBROOT_LOG,
  get WEBCONFIG() {
    return WEBCONFIG;
  },
  set WEBCONFIG(val) {
    WEBCONFIG = val;
  },
  getInst: getInst,
  delInst: delInst,
  getInsts: insts,
  getModel: getModel,
  loadConfigFromDB: loadConfigFromDB,
};
if (mail) r.mail = mail;
module.exports = r;
