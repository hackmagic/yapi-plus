const { spawn } = require('child_process');
const http = require('http');

console.log('启动服务器...');
const serverProcess = spawn('node', ['server/app.js', 'dev'], {
  cwd: 'K:\\workspaces\\github\\yapi-plus',
  shell: true
});

let testStarted = false;

// 等待服务器启动
serverProcess.stdout.on('data', (data) => {
  const str = data.toString();
  console.log('[服务器]', str.trim());
  
  // 检测服务器是否启动完成
  if ((str.includes('服务已启动') || str.includes('配置模式服务器已启动')) && !testStarted) {
    console.log('\n检测到服务器已启动，3秒后开始测试...\n');
    setTimeout(runTests, 3000);
    testStarted = true;
  }
  
  // 如果进入配置模式
  if (str.includes('配置模式') && !testStarted) {
    console.log('\n服务器进入配置模式，3秒后测试...\n');
    setTimeout(runTests, 3000);
    testStarted = true;
  }
});

serverProcess.stderr.on('data', (data) => {
  console.error('[错误]', data.toString());
});

function runTests() {
  console.log('='.repeat(50));
  console.log('测试 1: 访问根路径 /');
  console.log('='.repeat(50));
  
  testHttpRequest('http://127.0.0.1:3000/', '/', (result) => {
    console.log('\n测试 2: 访问 /dev.html');
    console.log('='.repeat(50));
    testHttpRequest('http://127.0.0.1:3000/dev.html', '/dev.html', (result2) => {
      console.log('\n测试 3: 访问 /index.html');
      console.log('='.repeat(50));
      testHttpRequest('http://127.0.0.1:3000/index.html', '/index.html', () => {
        // 所有测试完成，关闭服务器
        console.log('\n\n所有测试完成，关闭服务器...');
        serverProcess.kill('SIGTERM');
        process.exit(0);
      });
    });
  });
}

function testHttpRequest(url, label, callback) {
  console.log(`URL: ${url}`);
  const urlObj = require('url').parse(url);
  
  const req = http.request({
    hostname: urlObj.hostname,
    port: urlObj.port,
    path: urlObj.path,
    method: 'GET'
  }, (res) => {
    console.log(`状态码: ${res.statusCode}`);
    console.log(`响应头:`);
    console.log(`  Content-Type: ${res.headers['content-type']}`);
    console.log(`  Content-Length: ${res.headers['content-length']}`);
    console.log(`  Content-Disposition: ${res.headers['content-disposition'] || '无'}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log(`\n响应内容前150字节:`);
      console.log(data.substring(0, 150));
      console.log(`\n内容类型判断:`);
      if (data.startsWith('<!DOCTYPE') || data.startsWith('<html') || data.startsWith('<!doctype')) {
        console.log(`  ✓ 这是HTML文档`);
      } else if (data.startsWith('{') || data.startsWith('[')) {
        console.log(`  ✓ 这是JSON数据`);
      } else {
        console.log(`  ✗ 未知内容类型: ${data.substring(0, 50)}`);
      }
      callback && callback();
    });
  });
  
  req.on('error', (e) => {
    console.error(`请求失败: ${e.message}`);
    callback && callback();
  });
  
  req.end();
}

// 30秒超时
setTimeout(() => {
  console.log('\n超时，强制退出');
  serverProcess.kill('SIGTERM');
  process.exit(1);
}, 30000);
