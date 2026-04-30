const { spawn } = require('child_process');

const mongod = spawn('D:\\SystemSoftware\\mongodb-win32-x86_64-windows-8.2.7\\bin\\mongod.exe', [
  '--dbpath', 'K:\\workspaces\\github\\yapi-plus\\mongo-data',
  '--port', '27017'
], {
  stdio: 'pipe'
});

mongod.stdout.on('data', (data) => {
  console.log('[MongoDB]', data.toString());
});

mongod.stderr.on('data', (data) => {
  console.error('[MongoDB错误]', data.toString());
});

mongod.on('close', (code) => {
  console.log(`MongoDB进程退出，代码: ${code}`);
});

setTimeout(() => {
  console.log('MongoDB已启动');
  process.exit(0);
}, 5000);
