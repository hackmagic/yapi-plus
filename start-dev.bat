@echo off
echo ======================================
echo   YAPI Plus 启动脚本
echo ======================================
echo.

REM 检查 MongoDB 是否运行
echo [1/3] 检查 MongoDB 状态...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✓ MongoDB 正在运行
) else (
    echo ✗ MongoDB 未运行，正在启动...
    start /B "" "D:\SystemSoftware\mongodb-win32-x86-x64-windows-8.2.7\bin\mongod.exe" --dbpath "D:\SystemSoftware\mongodb-win32-x86_64-windows-8.2.7\data" --port 27017
    timeout /t 3 /nobreak >nul
    echo ✓ MongoDB 已启动
)

echo.
echo [2/3] 检查依赖...
if not exist "node_modules\" (
    echo 安装依赖...
    call npm install
)

echo.
echo [3/3] 启动 YAPI Plus...
echo.
echo ======================================
echo   正在启动开发服务器...
echo   后端: http://127.0.0.1:3000
echo   前端: http://localhost:4000
echo ======================================
echo.
echo 按 Ctrl+C 停止服务
echo.

REM 启动开发服务器（前后端）
call npm run dev

pause
