process.env.NODE_PATH = __dirname;
require('module').Module._initPaths();

const yapi = require('./yapi.js');
const commons = require('./utils/commons');
yapi.commons = commons;
const dbModule = require('./utils/db.js');
const configChecker = require('./configChecker.js');
const mockServer = require('./middleware/mockServer.js');
require('./plugin.js');
const websockify = require('koa-websocket');
const websocket = require('./websocket.js');
const storageCreator = require('./utils/storage')
require('./utils/notice')

const Koa = require('koa');
const koaStatic = require('koa-static');
const koaBody = require('koa-body');
const router = require('./router.js');
const configController = require('./controllers/configController.js');
const koaRouter = require('koa-router');

global.storageCreator = storageCreator;
let indexFile = process.argv[2] === 'dev' ? 'dev.html' : 'index.html';

/**
 * 启动配置模式服务器（轻量化）
 */
function startConfigMode() {
  console.log('\n⚙️  检测到未完成配置，启动配置模式...');
  console.log('请访问: http://localhost:' + yapi.WEBCONFIG.port + '/setup\n');
  
  const app = new Koa();
  const configRouter = koaRouter();
  
  app.use(koaBody({ strict: false, multipart: true, jsonLimit: '2mb', formLimit: '1mb', textLimit: '1mb' }));
  
  // 配置相关的路由
  configRouter.post('/api/config/test-db', async (ctx) => {
    const controller = new configController(ctx);
    await controller.testDatabase(ctx);
  });
  
  configRouter.post('/api/config/save', async (ctx) => {
    const controller = new configController(ctx);
    await controller.saveConfig(ctx);
  });
  
  configRouter.get('/api/config/status', async (ctx) => {
    const controller = new configController(ctx);
    await controller.getConfigStatus(ctx);
  });
  
  // 静态文件服务 - 前端配置引导页面
  configRouter.get('/setup', (ctx) => {
    ctx.type = 'html';
    ctx.body = require('fs').createReadStream(
      yapi.path.join(yapi.WEBROOT, 'static', 'dev.html')
    );
  });
  
  app.use(configRouter.routes());
  app.use(configRouter.allowedMethods());
  
  // 其他请求返回配置页面（单页应用）
  app.use(async (ctx) => {
    if (!ctx.path.startsWith('/api')) {
      ctx.type = 'html';
      const fs = require('fs');
      const htmlPath = yapi.path.join(yapi.WEBROOT, 'static', indexFile);
      if (fs.existsSync(htmlPath)) {
        ctx.body = fs.createReadStream(htmlPath);
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
  // 尝试从数据库加载配置
  await yapi.loadConfigFromDB();
  
  // 连接数据库
  yapi.connect = dbModule.connect();
  
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
}

// 主启动逻辑
async function start() {
  try {
    const configStatus = await configChecker.checkConfigStatus();
    
    if (!configStatus.configured) {
      // 进入配置模式
      startConfigMode();
    } else {
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
