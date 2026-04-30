@echo off
echo ========================================
echo 开始完整测试流程
echo ========================================

echo.
echo [步骤1] 停止所有 node.exe 和 mongod.exe 进程...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM mongod.exe 2>nul
echo 完成

echo.
echo [步骤2] 删除 mongod.lock...
powershell -Command "if (Test-Path 'K:\workspaces\github\yapi-plus\mongo-data\mongod.lock') { Remove-Item 'K:\workspaces\github\yapi-plus\mongo-data\mongod.lock' -Force; echo '已删除 mongod.lock' } else { echo 'mongod.lock 不存在' }"
echo 完成

echo.
echo [步骤3] 启动 MongoDB...
start "MongoDB" /B "D:\SystemSoftware\mongodb-win32-x86_64-windows-8.2.7\bin\mongod.exe" --dbpath "K:\workspaces\github\yapi-plus\mongo-data" --port 27017
echo 完成

echo.
echo [步骤4] 等待3秒并检查MongoDB...
powershell -Command "Start-Sleep -Seconds 3; if (Test-NetConnection -ComputerName 'localhost' -Port 27017 -InformationLevel Quiet) { echo 'MongoDB 运行正常 (端口 27017 开放)' } else { echo '错误: MongoDB 未启动' }"
echo 完成

echo.
echo [步骤5] 启动 YAPI Plus 服务器...
cd /d "K:\workspaces\github\yapi-plus"
start "YAPI" /B node server/app.js dev
echo 完成

echo.
echo [步骤6] 等待YAPI启动...
powershell -Command "$maxWait = 30; $elapsed = 0; $started = $false; while($elapsed -lt $maxWait -and -not $started) { Start-Sleep -Seconds 2; $elapsed += 2; try { $resp = Invoke-WebRequest -Uri 'http://127.0.0.1:3000/' -UseBasicParsing -TimeoutSec 2; if ($resp.StatusCode -eq 200) { $started = $true; echo 'YAPI 已启动 (状态码 200)' } } catch { } }; if (-not $started) { echo '错误: YAPI 启动超时' }"
echo 完成

echo.
echo [步骤7] 测试URL...
powershell -ExecutionPolicy Bypass -File "K:\workspaces\github\yapi-plus\test_urls_detailed.ps1"
echo 完成

echo.
echo ========================================
echo 测试完成
echo ========================================
echo.
echo [步骤8] 停止所有进程...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM mongod.exe 2>nul
echo 完成

pause
