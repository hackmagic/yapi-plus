# 打包与发布

## 一键打包

使用 `npm run package` 命令自动打包当前平台的 YAPI Plus 分发包。

### 打包流程

```
[1/4] Building frontend...  →  Vite 构建前端到 static/prd/
[2/4] Assembling package... →  复制 server/ common/ exts/ 等运行所需文件
[3/4] Installing deps...     →  npm install --production 安装生产依赖
[4/4] Creating archive...    →  生成压缩包到 release/ 目录
```

### 输出

| 平台 | 命令 | 输出文件 |
|------|------|---------|
| Windows | `npm run package` | `release/yapi-plus-v{version}-win-x64.zip` |
| Linux | `npm run package` | `release/yapi-plus-v{version}-linux-x64.tar.gz` |
| macOS | `npm run package` | `release/yapi-plus-v{version}-darwin-x64.tar.gz` |

### 分发包内容

```
yapi-plus-v{version}-{platform}/
├── server/              # Koa 后端
├── common/              # 前后端共享代码
├── exts/                # 内置插件
├── static/
│   ├── prd/             # 构建后的前端静态文件
│   ├── iconfont/
│   └── image/
├── node_modules/        # 预安装的生产依赖
├── package.json
├── package-lock.json
├── plugin.json
├── config_example.json  # 配置模板
├── .npmrc
├── README.md
├── LICENSE
├── start.bat            # Windows 启动脚本
└── start.sh             # Linux/macOS 启动脚本
```

## 发布到 GitHub Releases

### 方式一：自动发布（推荐）

推送 git tag 即可触发 GitHub Actions 自动打包并发布：

```bash
npm run release
```

该命令会自动创建 `v{version}` 标签并推送到远程仓库。

### 方式二：手动发布

```bash
git tag v1.11.0
git push origin v1.11.0
```

### CI 工作流程

推送到 GitHub 的 `v*` 标签后，GitHub Actions 自动执行：

1. **矩阵构建**：同时在 ubuntu-latest / windows-latest / macos-latest 三个 runner 上并行打包
2. **安装依赖**：`npm ci`
3. **构建前端**：`npm run build-client`
4. **打包**：`npm run package`
5. **上传产物**：所有平台的压缩包上传到 workflow artifacts
6. **创建 Release**：自动创建 GitHub Release，生成发布说明，上传 3 个平台的压缩包

工作流定义文件：`.github/workflows/release.yml`

## 部署

从 Release 下载对应平台的压缩包后：

1. 解压到部署目录
2. 在解压目录的**父目录**创建 `config.json`（可参考 `config_example.json`）
3. 启动服务：

```bash
# Linux/macOS
./start.sh

# Windows
start.bat

# 或直接使用 node
node server/app.js
```

> **注意**：`server/yapi.js` 中配置文件的读取路径为 `../../config.json`，因此 `config.json` 需要放在解压目录的**父目录**中。目录结构如下：
> ```
> /path/to/deploy/
> ├── config.json          # 配置文件
> └── yapi-plus-v{version}-linux-x64/
>     ├── server/
>     ├── static/
>     ├── start.sh
>     └── ...
> ```

### PM2 管理（推荐）

```bash
npm install -g pm2
pm2 start server/app.js --name yapi-plus
pm2 save
pm2 startup
```
