const yapi = require("../yapi.js");

class testController {
  constructor(ctx) {
    this.ctx = ctx;
  }

  async testPost(ctx) {
    ctx.body = { method: "POST", body: ctx.request.body, query: ctx.request.query };
  }

  async testGet(ctx) {
    ctx.body = { method: "GET", query: ctx.request.query };
  }

  async testPut(ctx) {
    ctx.body = { method: "PUT", body: ctx.request.body };
  }

  async testDelete(ctx) {
    ctx.body = { method: "DELETE", query: ctx.request.query };
  }

  async testHead(ctx) {
    ctx.status = 200;
  }

  async testOptions(ctx) {
    ctx.body = { method: "OPTIONS" };
  }

  async testPatch(ctx) {
    ctx.body = { method: "PATCH", body: ctx.request.body };
  }

  async testFilesUpload(ctx) {
    ctx.body = { files: ctx.request.files };
  }

  async testSingleUpload(ctx) {
    ctx.body = { file: ctx.request.file };
  }

  async testHttpCode(ctx) {
    const code = parseInt(ctx.request.query.code) || 200;
    ctx.status = code;
    ctx.body = { code };
  }

  async testRaw(ctx) {
    ctx.body = ctx.request.body;
  }

  async testResponse(ctx) {
    ctx.body = { message: "test response" };
  }
}

module.exports = testController;
