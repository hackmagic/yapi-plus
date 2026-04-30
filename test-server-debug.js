const http = require('http');
const { spawn } = require('child_process');

// 启动服务器
const serverProcess = spawn('node', ['server/app.js', 'dev'], {
  cwd: 'K:\\workspaces\\github\\yapi-plus',
  shell: true
});

serverProcess.stdout.on('data', (data) => {
  console.log(`[服务器] ${data}`);
  // 等待服务器启动完成后进行测试
  if (data.toString().includes('服务已启动')) {
    console.log('\n服务器已启动，等待2秒后开始测试...');
    setTimeout(testServer, 2000);
  }
});

serverProcess.stderr.on('data', (data) => {
  console.error(`[错误] ${data}`);
});

// 测试函数
function testServer() {
  console.log('\n========== 测试服务器响应 ==========\n');
  
  const options = {
    hostname: '127.0.0.1',
    port: 3000,
    path: '/',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log('状态码:', res.statusCode);
    console.log('响应头:', JSON.stringify(res.headers, null, 2));
    console.log('Content-Type:', res.headers['content-type']);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('\n响应内容前200字节:');
      console.log(data.substring(0, 200));
      console.log('\n内容类型判断:', 
        data.startsWith('<!DOCTYPE') || data.startsWith('<html>') || data.startsWith('<!doctype') 
          ? '✓ 是HTML' 
          : '✗ 不是HTML'
      );
      
      // 测试静态文件
      testStaticFile();
    });
  });

  req.on('error', (e) => {
    console.error('请求失败:', e.message);
  });

  req.end();
}

function testStaticFile() {
  console.log('\n========== 测试静态文件 ==========\n');
  
  const options = {
    hostname: '127.0.0.1',
    port: 3000,
    path: '/dev.html',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log('请求 /dev.html');
    console.log('状态码:', res.statusCode);
    console.log('Content-Type:', res.headers['content-type']);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('响应内容前100字节:', data.substring(0, 100));
      console.log('是否为HTML:', data.includes('<!DOCTYPE') ? '✓ 是' : '✗ 否');
      
      // 关闭服务器
      console.log('\n========== 测试完成 ==========');
      serverProcess.kill('SIGTERM');
    });
  });

  req.on('error', (e) => {
    console.error('请求失败:', e.message);
  });

  req.end();
}

// 5秒后强制退出
setTimeout(() => {
  console.log('\n超时，强制退出');
  serverProcess.kill('SIGTERM');
  process.exit(0);
}, 30000);
