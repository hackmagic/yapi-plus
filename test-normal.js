const { spawn } = require("child_process");
const http = require("http");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function testEndpoint(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve({ status: res.statusCode, body: data }));
      })
      .on("error", reject);
  });
}

async function main() {
  console.log("=== 测试正常模式启动 ===\n");

  // 启动服务器
  console.log("1. 启动服务器（正常模式）...");
  const server = spawn("node", ["server/app.js"], {
    cwd: "K:\\workspaces\\github\\yapi-plus",
    stdio: "pipe",
  });

  server.stdout.on("data", (data) => console.log("  [stdout]", data.toString().trim()));
  server.stderr.on("data", (data) => console.log("  [stderr]", data.toString().trim()));

  await sleep(4000);

  // 测试各个端点
  console.log("\n2. 测试正常模式 API...");

  const tests = [
    { name: "GET /api/user/status", url: "http://localhost:3000/api/user/status" },
    { name: "GET /api/group/list", url: "http://localhost:3000/api/group/list" },
    { name: "GET /", url: "http://localhost:3000/" },
    { name: "GET /api/project/list", url: "http://localhost:3000/api/project/list" },
  ];

  for (const test of tests) {
    try {
      const result = await testEndpoint(test.url);
      console.log(`  ${test.name}: ${result.status}`);
    } catch (e) {
      console.log(`  ${test.name}: ERROR - ${e.message}`);
    }
  }

  // 停止服务器
  server.kill();
  console.log("\n=== 测试完成 ===");
}

main().catch(console.error);
