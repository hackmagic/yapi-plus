const { spawn } = require("child_process");

console.log("启动 YAPI Plus 服务器...\n");
const yapi = spawn("node", ["server/app.js", "dev"], {
  cwd: "K:\\workspaces\\github\\yapi-plus",
  shell: true,
  stdio: "pipe",
});

let started = false;

yapi.stdout.on("data", (data) => {
  const str = data.toString();
  console.log("[YAPI]", str.trim());

  if (!started && (str.includes("✓ 配置模式服务器已启动") || str.includes("✓ 服务已启动"))) {
    started = true;
    console.log("\nYAPI 服务器已启动，3秒后开始测试...\n");
    setTimeout(() => runTests(yapi), 3000);
  }
});

yapi.stderr.on("data", (data) => {
  console.error("[YAPI错误]", data.toString());
});

yapi.on("close", (code) => {
  console.log(`\nYAPI 进程退出，代码: ${code}`);
  process.exit(code);
});

function runTests(yapiProcess) {
  const http = require("http");
  const tests = [
    { url: "/", name: "根路径" },
    { url: "/dev.html", name: "dev.html" },
    { url: "/index.html", name: "index.html" },
  ];
  let current = 0;

  function next() {
    if (current >= tests.length) {
      console.log("\n" + "=".repeat(60));
      console.log("所有测试完成！");
      console.log("=".repeat(60));
      setTimeout(() => {
        yapiProcess.kill("SIGTERM");
        process.exit(0);
      }, 5000);
      return;
    }

    const test = tests[current];
    console.log(`[测试 ${current + 1}/${tests.length}] ${test.name} (${test.url})`);
    console.log("-".repeat(60));
    testUrl(test.url, () => {
      current++;
      next();
    });
  }

  function testUrl(path, callback) {
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port: 3000,
        path: path,
        method: "GET",
        timeout: 5000,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          console.log(`  状态码: ${res.statusCode}`);
          console.log(`  Content-Type: ${res.headers["content-type"] || "未设置"}`);
          console.log(`  Content-Disposition: ${res.headers["content-disposition"] || "无"}`);
          console.log(`  响应内容前150字节:`);
          console.log(`  ${data.substring(0, 150).replace(/\n/g, "\n  ")}`);

          if (
            data.startsWith("<!DOCTYPE") ||
            data.startsWith("<html") ||
            data.startsWith("<!doctype")
          ) {
            console.log(`  ✓ HTML 页面正常`);
          } else if (
            data.includes("attachment") ||
            (res.headers["content-disposition"] &&
              res.headers["content-disposition"].includes("attachment"))
          ) {
            console.log(`  ✗ 浏览器会下载文件（Content-Disposition: attachment）`);
          } else {
            console.log(`  ? 内容类型: ${data.substring(0, 50)}`);
          }
          console.log("");
          callback();
        });
      },
    );

    req.on("error", (e) => {
      console.log(`  ✗ 请求失败: ${e.message}\n`);
      callback();
    });

    req.on("timeout", () => {
      console.log("  ✗ 请求超时\n");
      req.destroy();
      callback();
    });

    req.end();
  }

  next();
}

// 60秒超时
setTimeout(() => {
  console.log("\n超时，强制退出");
  process.exit(1);
}, 60000);

process.on("SIGINT", () => process.exit(0));
