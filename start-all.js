const { spawn } = require('child_process');

console.log('启动 MongoDB...');
const mongod = spawn('D:\\SystemSoftware\\mongodb-win32-x86_64-windows-8.2.7\\bin\\mongod.exe', [
  '--dbpath', 'K:\\workspaces\\github\\yapi-plus\\mongo-data',
  '--port', '27017'
]);

mongod.stdout.on('data', (data) => {
  const msg = data.toString();
  if (msg.includes('waiting for connections')) {
    console.log('MongoDB 已启动，正在监听端口 27017');
    startYapi();
  }
});

mongod.stderr.on('data', (data) => {
  console.error('[MongoDB错误]', data.toString().trim());
});

mongod.on('error', (err) => {
  console.error('启动MongoDB失败:', err.message);
});

function startYapi() {
  console.log('\n启动 YAPI Plus...\n');
  const yapi = spawn('node', ['server/app.js', 'dev'], {
    cwd: 'K:\\workspaces\\github\\yapi-plus',
    shell: true,
    stdio: 'pipe'
  });

  yapi.stdout.on('data', (data) => {
    const str = data.toString();
    console.log('[YAPI]', str.trim());
    
    if (str.includes('✓ 配置模式服务器已启动') || str.includes('✓ 服务已启动')) {
      console.log('\nYAPI 服务器启动成功！');
      console.log('等待2秒后测试...\n');
      setTimeout(() => runTests(yapi), 2000);
    }
  });

  yapi.stderr.on('data', (data) => {
    console.error('[YAPI错误]', data.toString());
  });

  yapi.on('close', (code) => {
    console.log(`\nYAPI 进程退出，代码: ${code}`);
    mongod.kill('SIGTERM');
    process.exit(code);
  });
}

function runTests(yapiProcess) {
  const http = require('http');
  const tests = [
    { url: '/', name: '根路径' },
    { url: '/dev.html', name: 'dev.html' }
  ];
  let current = 0;
  
  function next() {
    if (current >= tests.length) {
      console.log('\n所有测试完成，5秒后关闭服务器...');
      setTimeout(() => {
        yapiProcess.kill('SIGTERM');
        mongod.kill('SIGTERM');
        process.exit(0);
      }, 5000);
      return;
    }
    
    const test = tests[current];
    console.log(`测试 ${current + 1}/${tests.length}: ${test.url}`);
    const req = http.request({
      hostname: '127.0.0.1',
      port: 3000,
      path: test.url,
      method: 'GET',
      timeout: 5000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`  状态码: ${res.statusCode}`);
        console.log(`  Content-Type: ${res.headers['content-type']}`);
        console.log(`  Content-Disposition: ${res.headers['content-disposition'] || '无'}`);
        console.log(`  内容前100字节: ${data.substring(0, 100)}`);
        console.log(`  是否为HTML: ${data.startsWith('<!DOCTYPE') || data.startsWith('<html') ? '是 ✓' : '否 ✗'}`);
        console.log('');
        current++;
        next();
      });
    });
    
    req.on('error', (e) => {
      console.log(`  请求失败: ${e.message}`);
      current++;
      next();
    });
    
    req.on('timeout', () => {
      console.log('  请求超时');
      req.destroy();
      current++;
      next();
    });
    
    req.end();
  }
  
  next();
}

// 30秒超时
setTimeout(() => {
  console.log('\n总超时，强制退出');
  process.exit(1);
}, 30000);
