const koaRouter = require("koa-router");
const configController = require("./controllers/configController.js");
const koaBody = require("koa-body");

const router = koaRouter();

// 配置模式下的路由
router.post("/api/config/test-db", async (ctx) => {
  const controller = new configController(ctx);
  await controller.testDatabase(ctx);
});

router.post("/api/config/save", async (ctx) => {
  const controller = new configController(ctx);
  await controller.saveConfig(ctx);
});

router.get("/api/config/status", async (ctx) => {
  const controller = new configController(ctx);
  await controller.getConfigStatus(ctx);
});

module.exports = router;
