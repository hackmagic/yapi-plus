const http = require('http');
const { spawn } = require('child_process');

let serverProcess;

// 启动服务器
console.log('正在启动服务器...');
serverProcess = spawn('node', ['server/app.js', 'dev'], {
  cwd: 'K:\\workspaces\\github\\yapi-plus',
  shell: true,
  stdio: 'pipe'
});

serverProcess.stdout.on('data', (data) => {
  const str = data.toString();
  console.log('[服务器]', str.trim());
  
  // 检测服务器是否启动完成
  if (str.includes('✓ 配置模式服务器已启动') || str.includes('✓ 服务已启动')) {
    console.log('\n服务器启动成功，3秒后开始测试...\n');
    setTimeout(runTests, 3000);
  }
});

serverProcess.stderr.on('data', (data) => {
  console.error('[错误]', data.toString());
});

function runTests() {
  console.log('='.repeat(60));
  console.log('开始测试服务器响应');
  console.log('='.repeat(60));
  
  const tests = [
    { url: '/', name: '根路径' },
    { url: '/dev.html', name: 'dev.html' },
    { url: '/index.html', name: 'index.html' }
  ];
  
  let currentTest = 0;
  
  function nextTest() {
    if (currentTest >= tests.length) {
      console.log('\n' + '='.repeat(60));
      console.log('所有测试完成！');
      console.log('='.repeat(60));
      serverProcess.kill('SIGTERM');
      process.exit(0);
      return;
    }
    
    const test = tests[currentTest];
    console.log(`\n[测试 ${currentTest + 1}/${tests.length}] ${test.name} (${test.url})`);
    console.log('-'.repeat(60));
    testUrl(test.url);
  }
  
  function testUrl(path) {
    const options = {
      hostname: '127.0.0.1',
      port: 3000,
      path: path,
      method: 'GET',
      timeout: 5000
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`状态码: ${res.statusCode}`);
        console.log(`Content-Type: ${res.headers['content-type'] || '未设置'}`);
        console.log(`Content-Length: ${res.headers['content-length'] || '未知'}`);
        console.log(`Content-Disposition: ${res.headers['content-disposition'] || '无'}`);
        console.log(`\n响应内容前200字节:`);
        console.log(data.substring(0, 200));
        console.log(`\n内容分析:`);
        
        if (data.startsWith('<!DOCTYPE') || data.startsWith('<html') || data.startsWith('<!doctype')) {
          console.log('  ✓ 这是HTML文档（正确）');
        } else if (data.startsWith('{') || data.startsWith('[')) {
          console.log('  ✗ 这是JSON数据（错误：应该是HTML）');
        } else if (data.includes('attachment') || (res.headers['content-disposition'] && res.headers['content-disposition'].includes('attachment'))) {
          console.log('  ✗ 浏览器会下载此文件（Content-Disposition: attachment）');
        } else {
          console.log(`  ? 未知内容类型: ${data.substring(0, 50)}`);
        }
        
        currentTest++;
        nextTest();
      });
    });
    
    req.on('error', (e) => {
      console.log(`  ✗ 请求失败: ${e.message}`);
      currentTest++;
      nextTest();
    });
    
    req.on('timeout', () => {
      console.log('  ✗ 请求超时');
      req.destroy();
      currentTest++;
      nextTest();
    });
    
    req.end();
  }
  
  nextTest();
}

// 30秒超时
setTimeout(() => {
  console.log('\n超时，强制退出');
  if (serverProcess) serverProcess.kill('SIGTERM');
  process.exit(1);
}, 30000);

process.on('SIGINT', () => {
  if (serverProcess) serverProcess.kill('SIGTERM');
  process.exit(0);
});
