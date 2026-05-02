# Sinkendlessly Blog

> Code · Basketball · Life · Growth

一个个人数字空间，记录关于编程、篮球与生活的成长轨迹。

## 预览

- 全屏滚动（FullPage Scroll）翻页体验
- 3D 视差背景（Three.js）
- 多模块展示：个人介绍、编程技能、篮球热爱、生活记录

## 技术栈

- **HTML / CSS** — 纯原生，无框架依赖
- **JavaScript (ES6)** — 交互动画与逻辑
- **[GSAP](https://gsap.com/)** — 滚动/入场动画
- **[Lenis](https://lenis.studiofreight.com/)** — 平滑滚动
- **[Three.js](https://threejs.org/)** — 3D 背景粒子效果
- **[Vite](https://vitejs.dev/)** — 开发服务器（可选）

## 开发

```bash
# 安装依赖
npm install

# 启动本地服务（默认 8080 端口）
npm run dev

# 或直接使用任何静态服务器
npx serve . -p 8080
```

## 项目结构

```
personal-blog/
├── index.html              # 主页面
├── css/
│   └── style.css           # 全部样式
├── js/
│   └── main.js             # 脚本逻辑
├── assets/
│   ├── images/             # 图片资源
│   │   ├── 个人/           # 个人照片
│   │   ├── 头像/           # Avatar 表情
│   │   ├── 编程/           # 技能卡片背景
│   │   ├── 篮球/           # 篮球模块图片
│   │   ├── 生活/           # 生活模块图片
│   │   ├── 组件/           # UI 组件图标
│   │   ├── 渐进式/         # 各模块渐进式背景
│   │   └── audio/          # 背景音乐
│   ├── fonts/              # 自定义字体
│   └── textures/           # 材质纹理
└── package.json
```

## 页面模块

| 模块 | 说明 |
|------|------|
| Hero | 首页 + 动态 Avatar（4 种表情切换） |
| About | 个人介绍 + 数据统计 |
| Code | 编程技能轮播（3D 卡片） |
| Ball | 篮球板块（Quote + Team card） |
| Life | 生活六宫格（音乐/旅行/阅读/动漫/摄影/健身） |
| Footer | 社交链接 + 版权信息 |

## 功能亮点

- 全屏逐页滚动（Section Snap）
- 自定义鼠标指针
- 3D Tilt 视差交互
- 背景音乐播放器
- 多语言切换（中/英）
- 暗色渐变背景 + 图片蒙版
- 响应式适配（PC / 平板 / 手机）

## 许可证

MIT © 2026 Sinkendlessly
