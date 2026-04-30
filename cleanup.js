const fs = require('fs');
const path = require('path');

// 定义要删除的文件和目录
const filesAndDirsToDelete = [
  'debug_start.log',
  'server.log',
  'server_full.log',
  'yapi_stderr.log',
  'yapi_stdout.log',
  'test_output.txt',
  'config.json.backup',
  'init.lock',
  'mongo-data',
  'release'
];

console.log('开始清理垃圾文件...');

filesAndDirsToDelete.forEach(item => {
  const fullPath = path.join(__dirname, item);
  
  if (fs.existsSync(fullPath)) {
    try {
      if (fs.lstatSync(fullPath).isDirectory()) {
        // 删除目录及其内容
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`已删除目录: ${item}`);
      } else {
        // 删除文件
        fs.unlinkSync(fullPath);
        console.log(`已删除文件: ${item}`);
      }
    } catch (error) {
      console.error(`删除 ${item} 时出错: ${error.message}`);
    }
  } else {
    console.log(`未找到: ${item}`);
  }
});

console.log('清理完成！');