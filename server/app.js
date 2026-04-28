process.env.NODE_PATH = __dirname;
require('module').Module._initPaths();

const yapi = require('./yapi.js');
const commons = require('./utils/commons');
yapi.commons = commons;
const dbModule = require('./utils/db.js');
const configChecker = require('./configChecker.js');

// 初始化 yapi.connect 为一个空的 Promise，避免插件报错
// 在正常模式下会被真实的数据库连接替换
yapi.connect = Promise.resolve(null);

// 延迟加载模块，在配置模式下不需要这些
let mockServer, websocket, storageCreator;

const Koa = require('koa');
const koaStatic = require('koa-static');
const koaBody = require('koa-body');
const configController = require('./controllers/configController.js');

global.storageCreator = storageCreator;
let indexFile = process.argv[2] === 'dev' ? 'dev.html' : 'index.html';

/**
 * 启动配置模式服务器（轻量化）
 */
function startConfigMode() {
  console.log('\n⚙️  检测到未完成配置，启动配置模式...');
  console.log('请访问: http://localhost:' + yapi.WEBCONFIG.port + '/setup\n');
  
  const app = new Koa();
  const configRouter = require('./configRouter.js');
  
  app.use(koaBody({ strict: false, multipart: true, jsonLimit: '2mb', formLimit: '1mb', textLimit: '1mb' }));
  
  // 使用配置路由
  app.use(configRouter.routes());
  app.use(configRouter.allowedMethods());
  
  // 静态文件服务 - 前端配置引导页面
  app.use(async (ctx) => {
    if (ctx.path === '/setup' || ctx.path === '/') {
      ctx.type = 'html';
      const fs = require('fs');
      const htmlPath = yapi.path.join(yapi.WEBROOT, 'static', 'dev.html');
      if (fs.existsSync(htmlPath)) {
        ctx.body = fs.readFileSync(htmlPath, 'utf-8');
      } else {
        ctx.body = '<h1>配置页面未找到，请确保前端资源已构建</h1>';
      }
    } else if (!ctx.path.startsWith('/api')) {
      // 其他非 API 请求也返回配置页面（SPA）
      ctx.type = 'html';
      const fs = require('fs');
      const htmlPath = yapi.path.join(yapi.WEBROOT, 'static', indexFile);
      if (fs.existsSync(htmlPath)) {
        ctx.body = fs.readFileSync(htmlPath, 'utf-8');
      }
    }
  });
  
  const server = app.listen(yapi.WEBCONFIG.port);
  server.setTimeout(yapi.WEBCONFIG.timeout);
  
  console.log('✓ 配置模式服务器已启动');
}

/**
 * 启动正常模式服务器
 */
async function startNormalMode() {
  try {
    console.log('正在加载配置...');
    // 尝试从数据库加载配置（如果数据库未连接则跳过）
    try {
      await yapi.loadConfigFromDB();
    } catch (e) {
      console.log('数据库配置加载失败，将使用 config.json');
    }
    
    // 先连接数据库（插件和模型需要数据库）
    const mongoose = require('mongoose');
    let connectString = '';
    
    console.log('正在连接数据库...');
    if (yapi.WEBCONFIG.db.connectString) {
      connectString = yapi.WEBCONFIG.db.connectString;
    } else {
      connectString = `mongodb://${yapi.WEBCONFIG.db.servername || '127.0.0.1'}:${yapi.WEBCONFIG.db.port || 27017}/${yapi.WEBCONFIG.db.DATABASE || 'yapi'}`;
      if (yapi.WEBCONFIG.db.authSource) {
        connectString += `?authSource=${yapi.WEBCONFIG.db.authSource}`;
      }
    }
    
    await mongoose.connect(connectString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      serverSelectionTimeoutMS: 5000  // 5秒超时
    });
    
    // 连接成功，初始化 yapi.connect
    yapi.connect = Promise.resolve(mongoose.connection);
    yapi.commons.log('mongodb load success...');
    
    console.log('正在加载插件系统...');
    // 加载正常模式所需的模块
    require('./plugin.js');  // 加载插件系统
    
    console.log('正在加载路由...');
    const router = require('./router.js');  // 加载完整路由
    
    console.log('正在加载中间件...');
    mockServer = require('./middleware/mockServer.js');
    const websockify = require('koa-websocket');
    websocket = require('./websocket.js');
    storageCreator = require('./utils/storage');
    global.storageCreator = storageCreator;
    require('./utils/notice');
    
    const app = websockify(new Koa());
    app.proxy = true;
    yapi.app = app;

    app.use(koaBody({strict: false, multipart: true, jsonLimit: '2mb', formLimit: '1mb', textLimit: '1mb' }));
    app.use(mockServer);
    app.use(router.routes());
    app.use(router.allowedMethods());

    websocket(app);

    app.use(async (ctx, next) => {
      if (/^\/(?!api)[a-zA-Z0-9\/\-_]*$/.test(ctx.path)) {
        ctx.path = '/';
        await next();
      } else {
        await next();
      }
    });

    app.use(async (ctx, next) => {
      if (ctx.path.indexOf('/prd') === 0) {
        ctx.set('Cache-Control', 'max-age=8640000000');
        if (yapi.commons.fileExist(yapi.path.join(yapi.WEBROOT, 'static', ctx.path + '.gz'))) {
          ctx.set('Content-Encoding', 'gzip');
          ctx.path = ctx.path + '.gz';
        }
      }
      await next();
    });

    app.use(koaStatic(yapi.path.join(yapi.WEBROOT, 'static'), { index: indexFile, gzip: true }));

    const server = app.listen(yapi.WEBCONFIG.port);
    server.setTimeout(yapi.WEBCONFIG.timeout);

    commons.log(
      `服务已启动，请打开下面链接访问: \nhttp://127.0.0.1${
        yapi.WEBCONFIG.port == '80' ? '' : ':' + yapi.WEBCONFIG.port
      }/`
    );
  } catch (err) {
    console.log('\n❌ 启动失败');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (err.message.includes('ECONNREFUSED') || err.message.includes('connect')) {
      console.log('\n📋 可能原因:');
      console.log('   1. MongoDB 服务未启动');
      console.log('   2. MongoDB 连接地址或端口不正确');
      console.log('\n💡 解决方案:');
      console.log('   1. 启动 MongoDB 服务:');
      console.log('      Windows: net start MongoDB');
      console.log('      或: mongod --dbpath "你的数据目录"');
      console.log('      macOS/Linux: sudo systemctl start mongod');
      console.log('   2. 检查 config.json 中的数据库配置');
      console.log(`      当前配置: mongodb://${yapi.WEBCONFIG.db.servername || '127.0.0.1'}:${yapi.WEBCONFIG.db.port || 27017}/${yapi.WEBCONFIG.db.DATABASE || 'yapi'}`);
      console.log('\n🔧 或者，如果你想重新配置数据库连接:');
      console.log('   1. 删除或重命名 config.json');
      console.log('   2. 运行 npm start 进入配置向导');
    } else {
      console.log('\n错误信息:', err.message);
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // 退出程序
    process.exit(1);
  }
}

// 主启动逻辑
async function start() {
  try {
    console.log('正在检测配置状态...');
    const configStatus = await configChecker.checkConfigStatus();
    console.log('配置状态:', JSON.stringify(configStatus));
    
    if (!configStatus.configured) {
      // 进入配置模式
      startConfigMode();
    } else {
      console.log('配置已存在，尝试启动正常模式...');
      // 正常启动
      await startNormalMode();
    }
  } catch (err) {
    console.error('启动失败:', err);
    // 如果出错，也尝试启动配置模式
    startConfigMode();
  }
}

start();
