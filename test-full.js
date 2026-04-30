const { spawn } = require('child_process');
const http = require('http');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function postJson(url, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
    });
    req.on('error', reject);
    req.write(JSON.stringify(data));
    req.end();
  });
}

function testEndpoint(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

async function main() {
  console.log('=== 阶段 6 完整测试 ===\n');

  // 启动服务器
  console.log('1. 启动服务器...');
  const server = spawn('node', ['server/app.js'], {
    cwd: 'K:\\workspaces\\github\\yapi-plus',
    stdio: 'pipe'
  });

  server.stdout.on('data', (data) => console.log('  [stdout]', data.toString().trim()));
  server.stderr.on('data', (data) => console.log('  [stderr]', data.toString().trim()));

  await sleep(3000);

  // 测试配置状态
  console.log('\n2. 测试配置状态 API...');
  const status = await testEndpoint('http://localhost:3000/api/config/status');
  console.log('  Status:', status.status);
  console.log('  Body:', status.body);

  // 保存配置
  console.log('\n3. 保存配置...');
  const saveResult = await postJson('http://localhost:3000/api/config/save', {
    db: { servername: '127.0.0.1', port: 27017, DATABASE: 'yapi', authSource: 'admin' },
    adminAccount: 'admin@test.com',
    adminPassword: 'test123456'
  });
  console.log('  Status:', saveResult.status);
  console.log('  Body:', JSON.stringify(saveResult.body));

  // 停止服务器
  server.kill();
  console.log('\n服务器已停止');

  // 检查文件
  console.log('\n4. 检查生成的文件...');
  const fs = require('fs');
  console.log('  init.lock exists:', fs.existsSync('K:\\workspaces\\github\\yapi-plus\\init.lock'));
  console.log('  config.json:', fs.readFileSync('K:\\workspaces\\github\\yapi-plus\\config.json', 'utf-8'));

  console.log('\n=== 阶段 6 完成 ===');
}

main().catch(console.error);