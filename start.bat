@echo off
echo ======================================
echo   YAPI Plus 生产环境启动脚本
echo ======================================
echo.

REM 检查 MongoDB 是否运行
echo [1/3] 检查 MongoDB 状态...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✓ MongoDB 正在运行
) else (
    echo ✗ MongoDB 未运行，正在启动...
    start /B "" "D:\SystemSoftware\mongodb-win32-x86_64-windows-8.2.7\bin\mongod.exe" --dbpath "D:\SystemSoftware\mongodb-win32-x86_64-windows-8.2.7\data" --port 27017
    timeout /t 3 /nobreak >nul
    echo ✓ MongoDB 已启动
)

echo.
echo [2/3] 检查构建...
if not exist "static\prd\index.html" (
    echo 构建前端...
    call npm run build
)

echo.
echo [3/3] 启动生产服务器...
echo.
echo ======================================
echo   正在启动生产服务器...
echo   地址: http://127.0.0.1:3000
echo ======================================
echo.
echo 按 Ctrl+C 停止服务
echo.

REM 启动生产服务器
call npm start

pause
