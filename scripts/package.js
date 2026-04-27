const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

const pkg = require('../package.json');
const version = pkg.version;
const ROOT = path.resolve(__dirname, '..');

const PLATFORM_MAP = {
  win32: 'win-x64',
  linux: 'linux-x64',
  darwin: 'darwin-x64'
};

function main() {
  const platform = PLATFORM_MAP[os.platform()];
  if (!platform) {
    console.error('Unsupported platform: ' + os.platform());
    process.exit(1);
  }

  const archiveBase = 'yapi-plus-v' + version + '-' + platform;
  const tempDir = path.join(ROOT, archiveBase);
  const releaseDir = path.join(ROOT, 'release');

  function copyDir(name) {
    const src = path.join(ROOT, name);
    if (fs.existsSync(src)) {
      fs.copySync(src, path.join(tempDir, name));
    }
  }

  // 1. Build frontend
  process.env.NODE_ENV = 'production';
  console.log('[1/4] Building frontend...');
  try {
    execSync('node node_modules/vite/bin/vite.js build', { cwd: ROOT, stdio: 'inherit' });
  } catch (e) {
    if (fs.existsSync(path.join(ROOT, 'static', 'prd'))) {
      console.log('  -> Build failed, but static/prd/ exists. Using existing build.');
    } else {
      console.error('  -> Build failed and no existing static/prd/ found.');
      process.exit(1);
    }
  }

  // 2. Assemble package directory
  console.log('[2/4] Assembling package...');
  if (fs.existsSync(tempDir)) fs.removeSync(tempDir);
  fs.ensureDirSync(tempDir);
  fs.ensureDirSync(releaseDir);

  copyDir('server');
  copyDir('common');
  copyDir('exts');

  fs.ensureDirSync(path.join(tempDir, 'static'));
  var staticDirs = ['prd', 'iconfont', 'image'];
  for (var i = 0; i < staticDirs.length; i++) {
    var s = path.join(ROOT, 'static', staticDirs[i]);
    if (fs.existsSync(s)) {
      fs.copySync(s, path.join(tempDir, 'static', staticDirs[i]));
    }
  }

  var files = ['package.json', 'plugin.json', 'config_example.json', '.npmrc', 'README.md', 'LICENSE'];
  for (var j = 0; j < files.length; j++) {
    var src = path.join(ROOT, files[j]);
    if (fs.existsSync(src)) {
      fs.copySync(src, path.join(tempDir, files[j]));
    }
  }

  // Create start scripts
  var startBat =
    '@echo off\r\n' +
    'chcp 65001 >nul\r\n' +
    'echo Starting YAPI Plus v' + version + '...\r\n' +
    'echo.\r\n' +
    'echo Make sure config.json exists in the parent directory.\r\n' +
    'echo If not, copy config_example.json to ../config.json and edit it.\r\n' +
    'echo.\r\n' +
    'node server/app.js\r\n' +
    'pause\r\n';
  fs.writeFileSync(path.join(tempDir, 'start.bat'), startBat);

  var startSh =
    '#!/bin/bash\n' +
    'echo "Starting YAPI Plus v' + version + '..."\n' +
    'echo ""\n' +
    'echo "Make sure config.json exists in the parent directory."\n' +
    'echo "If not, copy config_example.json to ../config.json and edit it."\n' +
    'echo ""\n' +
    'node server/app.js\n';
  fs.writeFileSync(path.join(tempDir, 'start.sh'), startSh);
  fs.chmodSync(path.join(tempDir, 'start.sh'), 0o755);

  // 3. Install production dependencies
  console.log('[3/4] Installing production dependencies...');
  execSync('npm install --production --legacy-peer-deps', { cwd: tempDir, stdio: 'inherit' });

  // 4. Create archive
  console.log('[4/4] Creating archive...');
  var isWin = os.platform() === 'win32';
  var ext = isWin ? '.zip' : '.tar.gz';
  var archivePath = path.join(releaseDir, archiveBase + ext);

  if (isWin) {
    execSync(
      'powershell -NoProfile -Command "Compress-Archive -Path \\"' +
        tempDir + '\\*\\" -DestinationPath \\"' + archivePath + '\\""',
      { stdio: 'inherit' }
    );
  } else {
    execSync('tar -czf "' + archivePath + '" -C "' + ROOT + '" "' + archiveBase + '"', {
      stdio: 'inherit'
    });
  }

  var stats = fs.statSync(archivePath);
  console.log('  -> ' + archivePath + ' (' + (stats.size / 1024 / 1024).toFixed(1) + ' MB)');

  // Cleanup
  fs.removeSync(tempDir);

  console.log('\nDone!');
}

main();
