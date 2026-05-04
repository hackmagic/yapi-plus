const fs = require("fs-extra");
const yapi = require("./yapi.js");
const commons = require("./utils/commons");
const dbModule = require("./utils/db.js");
const userModel = require("./models/user.js");
const mongoose = require("mongoose");

yapi.commons = commons;
yapi.connect = dbModule.connect();

// 显示弃用提示
console.log("\n⚠️  注意：此安装方式已被弃用。");
console.log("推荐使用 Web 配置向导进行初始化配置。");
console.log("请访问 http://localhost:" + yapi.WEBCONFIG.port + "/setup 进行配置。\n");

function install() {
  let exist = yapi.commons.fileExist(yapi.path.join(yapi.WEBROOT_RUNTIME, "init.lock"));

  if (exist) {
    throw new Error(
      "init.lock文件已存在，请确认您是否已安装。如果需要重新安装，请删掉init.lock文件",
    );
  }

  setupSql();
}

function setupSql() {
  let userInst = yapi.getInst(userModel);
  let passsalt = yapi.commons.randStr();
  
  // 生成随机强密码，避免使用硬编码的弱密码
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  const adminPassword = Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  
  let result = userInst.save({
    username: yapi.WEBCONFIG.adminAccount.substr(0, yapi.WEBCONFIG.adminAccount.indexOf("@")),
    email: yapi.WEBCONFIG.adminAccount,
    password: yapi.commons.generatePassword(adminPassword, passsalt),
    passsalt: passsalt,
    role: "admin",
    add_time: yapi.commons.time(),
    up_time: yapi.commons.time(),
  });

  console.log(`\n⚠️  初始管理员密码已自动生成: ${adminPassword}`);
  console.log("⚠️  请妥善保存此密码，首次登录后请立即修改！\n");

  yapi.connect
    .then(function () {
      let userCol = mongoose.connection.db.collection("user");
      userCol.createIndex({
        username: 1,
      });
      userCol.createIndex(
        {
          email: 1,
        },
        {
          unique: true,
        },
      );

      let projectCol = mongoose.connection.db.collection("project");
      projectCol.createIndex({
        uid: 1,
      });
      projectCol.createIndex({
        name: 1,
      });
      projectCol.createIndex({
        group_id: 1,
      });

      let logCol = mongoose.connection.db.collection("log");
      logCol.createIndex({
        uid: 1,
      });

      logCol.createIndex({
        typeid: 1,
        type: 1,
      });

      let interfaceColCol = mongoose.connection.db.collection("interface_col");
      interfaceColCol.createIndex({
        uid: 1,
      });
      interfaceColCol.createIndex({
        project_id: 1,
      });

      let interfaceCatCol = mongoose.connection.db.collection("interface_cat");
      interfaceCatCol.createIndex({
        uid: 1,
      });
      interfaceCatCol.createIndex({
        project_id: 1,
      });

      let interfaceCaseCol = mongoose.connection.db.collection("interface_case");
      interfaceCaseCol.createIndex({
        uid: 1,
      });
      interfaceCaseCol.createIndex({
        col_id: 1,
      });
      interfaceCaseCol.createIndex({
        project_id: 1,
      });

      let interfaceCol = mongoose.connection.db.collection("interface");
      interfaceCol.createIndex({
        uid: 1,
      });
      interfaceCol.createIndex({
        path: 1,
        method: 1,
      });
      interfaceCol.createIndex({
        project_id: 1,
      });

      let groupCol = mongoose.connection.db.collection("group");
      groupCol.createIndex({
        uid: 1,
      });
      groupCol.createIndex({
        group_name: 1,
      });

      let avatarCol = mongoose.connection.db.collection("avatar");
      avatarCol.createIndex({
        uid: 1,
      });

      let tokenCol = mongoose.connection.db.collection("token");
      tokenCol.createIndex({
        project_id: 1,
      });

      let followCol = mongoose.connection.db.collection("follow");
      followCol.createIndex({
        uid: 1,
      });
      followCol.createIndex({
        project_id: 1,
      });

      result.then(
        function () {
          fs.ensureFileSync(yapi.path.join(yapi.WEBROOT_RUNTIME, "init.lock"));
          console.log(
            `初始化管理员账号成功,账号名："${yapi.WEBCONFIG.adminAccount}"，密码："ymfe.org"`,
          ); // eslint-disable-line
          process.exit(0);
        },
        function (err) {
          throw new Error(`初始化管理员账号 "${yapi.WEBCONFIG.adminAccount}" 失败, ${err.message}`); // eslint-disable-line
        },
      );
    })
    .catch(function (err) {
      throw new Error(err.message);
    });
}

install();
