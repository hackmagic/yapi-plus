const http = require('http');

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

async function main() {
  console.log('=== 保存配置并测试正常模式 ===\n');

  // Test: 保存完整配置
  console.log('1. 保存配置...');
  const saveResult = await postJson('http://localhost:3000/api/config/save', {
    db: { servername: '127.0.0.1', port: 27017, DATABASE: 'yapi', authSource: 'admin' },
    adminAccount: 'admin@test.com',
    adminPassword: 'test123456'
  });
  console.log('  Status:', saveResult.status);
  console.log('  Body:', JSON.stringify(saveResult.body));
  console.log('');

  if (saveResult.body.errcode === 0) {
    console.log('配置已保存，请重启服务测试正常模式');
  }
}

main().catch(console.error);