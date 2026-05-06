const yapi = require("../yapi.js");
const baseController = require("./base.js");
const configChecker = require("../configChecker.js");
const fs = require("fs-extra");
const mongoose = require("mongoose");

class configController extends baseController {
  constructor(ctx) {
    super(ctx);
  }

  /**
   * 获取配置状态
   */
  async getConfigStatus(ctx) {
    try {
      const status = await configChecker.checkConfigStatus();
      ctx.body = yapi.commons.resReturn(status);
    } catch (err) {
      ctx.body = yapi.commons.resReturn(null, 400, err.message);
    }
  }

  /**
   * 测试数据库连接
   */
  async testDatabase(ctx) {
    try {
      const dbConfig = ctx.request.body;

      if (!dbConfig) {
        ctx.body = yapi.commons.resReturn(null, 400, "请提供数据库配置");
        return;
      }

      const result = await configChecker.testDatabaseConnection(dbConfig);

      if (result.success) {
        ctx.body = yapi.commons.resReturn({ success: true, message: "数据库连接成功" });
      } else {
        ctx.body = yapi.commons.resReturn(null, 400, result.error);
      }
    } catch (err) {
      ctx.body = yapi.commons.resReturn(null, 400, err.message);
    }
  }

  /**
   * 保存配置并初始化
   */
  async saveConfig(ctx) {
    try {
      // 安全检查：只有在未初始化时才允许调用此接口
      const initLockPath = yapi.path.join(yapi.WEBROOT_RUNTIME, "init.lock");
      if (yapi.fs.existsSync(initLockPath)) {
        return (ctx.body = yapi.commons.resReturn(null, 403, "系统已初始化，无法再次配置"));
      }

      const config = ctx.request.body;

      // 验证必需的配置
      if (!config.db) {
        ctx.body = yapi.commons.resReturn(null, 400, "请提供数据库配置");
        return;
      }

      if (!config.adminAccount) {
        ctx.body = yapi.commons.resReturn(null, 400, "请提供管理员账号");
        return;
      }

      // 测试数据库连接
      const testResult = await configChecker.testDatabaseConnection(config.db);
      if (!testResult.success) {
        ctx.body = yapi.commons.resReturn(null, 400, `数据库连接失败: ${testResult.error}`);
        return;
      }

      // 连接到数据库
      let connectString = "";
      if (config.db.connectString) {
        connectString = config.db.connectString;
      } else {
        connectString = `mongodb://${config.db.servername}:${config.db.port}/${config.db.DATABASE}`;
        if (config.db.authSource) {
          connectString += `?authSource=${config.db.authSource}`;
        }
      }

      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      };

      if (config.db.user) {
        options.user = config.db.user;
        options.pass = config.db.pass;
      }

      await mongoose.connect(connectString, options);

      // 加载 db.js 以初始化 yapi.db 方法
      require("../utils/db.js");

      // 保存配置到数据库
      const time = yapi.commons.time();

      // 创建 SystemConfig mongoose model
      const systemConfigSchema = new mongoose.Schema({
        configKey: { type: String, required: true, unique: true },
        configValue: { type: Object, required: true },
        isConfigured: { type: Boolean, default: false },
        createTime: Number,
        updateTime: Number,
      });
      const SystemConfigModel = mongoose.model(
        "system_config",
        systemConfigSchema,
        "system_config",
      );

      // 保存数据库配置
      await SystemConfigModel.findOneAndUpdate(
        { configKey: "database" },
        {
          configKey: "database",
          configValue: config.db,
          isConfigured: true,
          createTime: time,
          updateTime: time,
        },
        { upsert: true, new: true },
      );

      // 保存管理员配置
      await SystemConfigModel.findOneAndUpdate(
        { configKey: "admin" },
        {
          configKey: "admin",
          configValue: { adminAccount: config.adminAccount },
          isConfigured: true,
          createTime: time,
          updateTime: time,
        },
        { upsert: true, new: true },
      );

      // 保存邮件配置（如果有）
      if (config.mail) {
        await SystemConfigModel.findOneAndUpdate(
          { configKey: "mail" },
          {
            configKey: "mail",
            configValue: config.mail,
            isConfigured: true,
            createTime: time,
            updateTime: time,
          },
          { upsert: true, new: true },
        );
      }

      // 创建管理员账号
      const passsalt = yapi.commons.randStr();
      const adminEmail = config.adminAccount;
      const adminUsername = adminEmail.substr(0, adminEmail.indexOf("@"));
      
      // 生成随机强密码，避免使用硬编码的弱密码
      let adminPassword = config.adminPassword;
      if (!adminPassword || adminPassword === "ymfe.org") {
        // 生成 16 位随机密码：大写字母 + 小写字母 + 数字 + 特殊字符
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        adminPassword = Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
        // 密码已自动生成，请通过安全渠道获取
        console.log("⚠️  初始管理员密码已自动生成，请通过安全渠道获取！\n");
      }

      // 创建 User mongoose model
      const userSchema = new mongoose.Schema({
        username: { type: String, required: true },
        password: { type: String, required: true },
        email: { type: String, required: true },
        passsalt: String,
        role: String,
        add_time: Number,
        up_time: Number,
        type: { type: String, enum: ["site", "third"], default: "site" },
      });
      const UserModel = mongoose.model("user", userSchema, "user");

      await UserModel.create({
        username: adminUsername,
        email: adminEmail,
        password: yapi.commons.generatePassword(adminPassword, passsalt),
        passsalt: passsalt,
        role: "admin",
        add_time: time,
        up_time: time,
      });

      // 创建索引
      const userCol = mongoose.connection.db.collection("user");
      await userCol.createIndex({ username: 1 });
      await userCol.createIndex({ email: 1 }, { unique: true });

      const projectCol = mongoose.connection.db.collection("project");
      await projectCol.createIndex({ uid: 1 });
      await projectCol.createIndex({ name: 1 });
      await projectCol.createIndex({ group_id: 1 });

      // 创建 init.lock 文件
      fs.ensureFileSync(yapi.path.join(yapi.WEBROOT_RUNTIME, "init.lock"));

      // 更新 config.json（作为备份）
      const configPath = yapi.path.join(yapi.WEBROOT, "config.json");
      const currentConfig = fs.existsSync(configPath) ? fs.readJsonSync(configPath) : {};

      const newConfig = {
        ...currentConfig,
        db: config.db,
        adminAccount: config.adminAccount,
        timeout: config.timeout || 120000,
      };

      if (config.mail) {
        newConfig.mail = config.mail;
      }

      fs.writeJsonSync(configPath, newConfig, { spaces: 2 });

      // 断开连接
      await mongoose.disconnect();

      ctx.body = yapi.commons.resReturn({
        success: true,
        message: "配置保存成功，请重启服务",
      });
    } catch (err) {
      ctx.body = yapi.commons.resReturn(null, 400, err.message);
    }
  }
}

module.exports = configController;
