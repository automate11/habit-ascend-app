# GitHub Actions 部署步骤

## 一、第一次推送(5 分钟)

### 步骤 1:在 GitHub 上创建新仓库

1. 打开 https://github.com/new
2. 填 Repository name: `habit-ascend-app`
3. 选 Public(私有仓库 GitHub Actions 也有免费额度,但 Public 更简单)
4. **不要**勾选 Add a README / .gitignore(我们要自己控制文件)
5. 点 Create repository
6. 记下仓库 URL,例如:`https://github.com/你的用户名/habit-ascend-app.git`

### 步骤 2:在本地初始化 git 并推送

打开 PowerShell 或 Git Bash,执行以下命令:

```bash
cd "C:/Users/Olivia/WorkBuddy/2026-07-30-18-45-01/habit-ascend-app"

git init
git add .
git commit -m "init: Capacitor Android App wrapper with Haptics/StatusBar/LocalNotifications"

git branch -M main
git remote add origin https://github.com/你的用户名/habit-ascend-app.git
git push -u origin main
```

### 步骤 3:触发构建

推送后会自动触发一次构建。或者手动触发:

1. 打开 GitHub 仓库页面
2. 点上方 **Actions** 标签
3. 左侧选 **Build Android APK**
4. 右侧点 **Run workflow** → **Run workflow**(绿按钮)

### 步骤 4:等待构建 + 下载 APK

- 第一次构建约 10-15 分钟(下载 Android SDK + Gradle 依赖)
- 后续构建约 3-5 分钟(都缓存了)
- 构建完成后,在 Actions 页面底部 **Artifacts** 区域
- 下载 `habit-ascend-debug.apk`

---

## 二、安装到手机

1. 把 APK 通过微信文件传输助手 / 蓝牙 / 数据线传到手机
2. 手机 **设置** → **安全** → **允许安装未知来源应用**(可能叫"特殊应用权限")
3. 选你的文件管理器(或浏览器)允许
4. 点 APK 文件 → **安装**
5. 桌面会出现 **习惯进阶** 图标

---

## 三、后续更新

每次改完 `www/index.html` 后:

```bash
cd "C:/Users/Olivia/WorkBuddy/2026-07-30-18-45-01/habit-ascend-app"
git add .
git commit -m "fix: 改了什么"
git push
```

GitHub Actions 会自动重新构建 + 产出新 APK,你去 Actions 页面下载。

---

## 常见问题

**Q:Actions 跑失败了?**
A:点进失败的 run → 看红 X 步骤的日志,贴给我看。

**Q:APK 装不上,提示"未签名"?**
A:debug APK 自签名,需要允许"未知来源"。如果是 release 版需要先生成 keystore。

**Q:装好打开后是空白页?**
A:大概率 www/index.html 里 JS 出错。看手机 logcat 或在电脑用 Chrome DevTools(`chrome://inspect`)看 WebView 控制台。

**Q:震动没反应?**
A:手机系统需要允许震动权限(部分手机需要在系统设置里开启)。