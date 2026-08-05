# 习惯进阶 · Android App

游戏化习惯打卡 App,用 Capacitor 把 Web 代码包装成 Android APK。

## 项目结构

```
habit-ascend-app/
├── www/                      ← Web 源代码(HTML/CSS/JS)
│   ├── index.html            ← 主应用
│   ├── manifest.json         ← PWA 配置
│   ├── service-worker.js     ← 离线缓存
│   ├── hero.png              ← 角色立绘
│   ├── icon-192.png          ← App 图标(小)
│   └── icon-512.png          ← App 图标(大)
├── android/                   ← Capacitor 生成的 Android 项目
├── capacitor.config.json     ← Capacitor 配置
├── package.json              ← 依赖定义
├── .github/workflows/        ← GitHub Actions 云构建
│   └── build-android.yml
└── README.md
```

## 本地修改流程

```bash
# 1. 改 www/index.html 里的代码(HTML/CSS/JS)

# 2. 同步到 android 项目
npx cap sync android

# 3. 本地编译(需要本地有 Android SDK)
cd android && ./gradlew assembleDebug
```

## 怎么打出 APK(两种方式)

### 方式 A:GitHub Actions 云构建(推荐,无需本地 Android SDK)

1. 把代码 push 到 GitHub
2. 在 GitHub repo 页面 → Actions → 选 "Build Android APK" → Run workflow
3. 等待约 15 分钟
4. 在 Artifacts 区域下载 `habit-ascend-debug.apk`

### 方式 B:本地编译

需要先装 Android SDK + Java 17+ + Gradle 8.2+,然后:
```bash
npm ci
npx cap sync android
cd android && ./gradlew assembleDebug
```
APK 产出在 `android/app/build/outputs/apk/debug/app-debug.apk`

## 安装到手机

1. 把 APK 通过微信/QQ/数据线传到手机
2. 手机设置 → 安全 → 允许安装未知来源
3. 点 APK 文件安装

## 数据存储

- 数据存在 App 私有目录的 localStorage
- **换手机 = 重新开始**(自用版边界,不上云)
- 卸载 App = 数据清空(除非导出存档)

## 原生能力(仅在 App 内有效)

- 打卡震动反馈(中等震动)
- 通关奖励震动反馈(成功)
- 每日 21:00 本地通知提醒打卡
- 沉浸式状态栏(浅绿色背景)