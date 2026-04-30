const http = require('http');

function testEndpoint(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('=== 阶段 6 端到端测试 ===\n');

  // Test 1: 配置状态 API
  console.log('Test 1: GET /api/config/status');
  const status = await testEndpoint('http://localhost:3000/api/config/status');
  console.log('  Status:', status.status);
  console.log('  Body:', status.body);
  console.log('');

  // Test 2: 测试数据库连接（空参数）
  console.log('Test 2: POST /api/config/test-db (empty)');
  const testDbEmpty = await new Promise((resolve, reject) => {
    const req = http.request('http://localhost:3000/api/config/test-db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.write('{}');
    req.end();
  });
  console.log('  Status:', testDbEmpty.status);
  console.log('  Body:', testDbEmpty.body);
  console.log('');

  // Test 3: 测试数据库连接（有效配置）
  console.log('Test 3: POST /api/config/test-db (valid)');
  const testDbValid = await new Promise((resolve, reject) => {
    const req = http.request('http://localhost:3000/api/config/test-db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.write(JSON.stringify({ servername: '127.0.0.1', port: 27017, DATABASE: 'yapi' }));
    req.end();
  });
  console.log('  Status:', testDbValid.status);
  console.log('  Body:', testDbValid.body);
  console.log('');

  // Test 4: 根路径
  console.log('Test 4: GET /');
  const root = await testEndpoint('http://localhost:3000/');
  console.log('  Status:', root.status);
  console.log('  Body length:', root.body ? root.body.length : 0);

  console.log('\n=== 测试完成 ===');
}

runTests().catch(console.error);