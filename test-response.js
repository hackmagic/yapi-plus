const http = require("http");

const options = {
  hostname: "127.0.0.1",
  port: 3000,
  path: "/",
  method: "GET",
};

const req = http.request(options, (res) => {
  console.log("状态码:", res.statusCode);
  console.log("响应头:", res.headers);
  console.log("Content-Type:", res.headers["content-type"]);

  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    console.log("\n响应内容前100字节:", data.substring(0, 100));
    console.log(
      "内容类型判断:",
      data.startsWith("<!DOCTYPE html>") || data.startsWith("<html>") ? "是HTML" : "不是HTML",
    );
  });
});

req.on("error", (e) => {
  console.error("请求失败:", e.message);
});

req.end();
