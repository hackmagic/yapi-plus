const { spawn } = require("child_process");

const serverProcess = spawn("node", ["server/app.js", "dev"], {
  cwd: "K:\\workspaces\\github\\yapi-plus",
  shell: true,
  stdio: "inherit",
});

// 30秒后自动退出
setTimeout(() => {
  console.log("\n测试超时，退出...");
  serverProcess.kill("SIGTERM");
  process.exit(0);
}, 30000);

process.on("SIGINT", () => {
  serverProcess.kill("SIGTERM");
  process.exit(0);
});
