@echo off
setlocal
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
    set "MONGOD_CMD=mongod"
    if not "%YAPI_MONGOD_PATH%"=="" (
        set "MONGOD_CMD=%YAPI_MONGOD_PATH%"
    )
    if "%YAPI_MONGOD_PATH%"=="" (
        where mongod >NUL 2>&1
        if not "%ERRORLEVEL%"=="0" (
            echo ✗ 未找到 mongod 命令。
            echo.
            echo 请先安装 MongoDB 并确保 mongod 在 PATH 中，或者设置环境变量:
            echo   set YAPI_MONGOD_PATH=C:\path\to\mongod.exe
            echo   set YAPI_MONGO_DBPATH=C:\path\to\mongodb-data
            echo.
            exit /b 1
        )
    )

    if "%YAPI_MONGO_DBPATH%"=="" (
        start "" /B "%MONGOD_CMD%" --port 27017
    ) else (
        start "" /B "%MONGOD_CMD%" --dbpath "%YAPI_MONGO_DBPATH%" --port 27017
    )
    timeout /t 3 /nobreak >nul
    tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
    if "%ERRORLEVEL%"=="0" (
        echo ✓ MongoDB 已启动
    ) else (
        echo ✗ MongoDB 启动失败，请检查路径与数据目录配置
        exit /b 1
    )
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
