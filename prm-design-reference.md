# PRMO Inc. 网站设计参考文档

> 来源：https://www.prm.ooo/  
> 爬取时间：2026-04-30

---

## 一、网站概览

### 基本信息
- **网站类型**: 创意工作室企业官网
- **技术栈**: Nuxt.js (Vue 3) + WebGL + Sanity CMS
- **设计风格**: 极简主义、动态交互、3D 视觉效果
- **特色**: 滚动驱动动画、WebGL 3D 场景、音乐可视化

### 整体结构
```
├── Loading Screen (加载动画)
├── Header (固定导航)
│   ├── 站点 Logo
│   ├── News Ticker (新闻轮播)
│   ├── 音频可视化器
│   └── 设置/菜单按钮
├── Main Content
│   ├── Hero Section (首屏大字)
│   ├── About Section (关于)
│   ├── Service Section (服务)
│   ├── Portfolio/Works Section (作品集)
│   ├── Company Section (公司信息)
│   └── Contact Section (联系)
└── Footer
    ├── 页脚导航
    ├── 精选作品列表
    ├── 设置 (语言/音效)
    └── 社交媒体链接
```

---

## 二、设计系统

### 2.1 色彩系统

#### 主色调
| 用途 | 颜色值 | 说明 |
|------|--------|------|
| 主题色 | `#ffc400` (金色) | 品牌主色，Logo、强调元素 |
| 背景色 | `#ffffff` (白色) | 默认背景 |
| 文字色 | `#000000` (黑色) | 主要文字 |
| 辅助色 | `rgba(255,255,255,0.3)` | 半透明分割线 |

#### 项目主题色 (作品集)
每个作品都有不同的强调色：
- **SHUEISHA GAMES**: #0c0c0c (深黑)
- **ATTACK SUPER FIT BOTTLE**: #afd1d8 (薄荷蓝)
- **KUROMI**: #150234 (深紫) + #a291ff (亮紫)
- **STYLY**: #272c37 (深蓝灰)
- **THE NORTH FACE**: #ffffff (白)
- **NEWS**: #00ff00 (荧光绿)
- **Hoshino Resorts**: #c8bca0 (暖灰)
- **TomorroWater**: #e8eaeb (浅灰)
- **YES**: #0019ff (蓝色)

### 2.2 字体系统

#### 字体家族
- **主字体**: Neue Helvetica Pro 系列
  - `NeueHelveticaPro93ExtendedBlack` - 标题粗体
  - `NeueHelveticaPro65Medium` - 中等粗细
  - `NeueHelveticaPro55Roman` - 常规文字

#### 字体规格
| 元素 | 字体 | 大小 | 字重 | 样式 |
|------|------|------|------|------|
| 主标题 (Hero) | ExtendedBlack | 超大 (视口单位) | 900 | 大写 |
| 章节标题 | ExtendedBlack | 大 | 900 | 大写 |
| 正文 | Roman | 16px | 400 | 正常 |
| 导航链接 | Medium | 14px | 500 | 大写 |
| 小标签 | Roman | 12px | 400 | 大写/小写 |

### 2.3 间距系统

#### 布局间距
- **容器最大宽度**: 100% (全宽设计)
- **内容区边距**: 响应式 (移动端 20px, 桌面端 40px+)
- **章节间距**: 100vh (全屏滚动)
- **元素间距**: 8px 基准倍数

#### 组件间距
- **按钮内边距**: 12px 24px
- **卡片内边距**: 24px
- **列表项间距**: 16px

---

## 三、页面章节详解

### 3.1 Loading Screen (加载动画)

**视觉特点**:
- 白色背景
- 中心 Logo 动画 (四个方块组成 PRMO 字样)
- 每个方块包含 SVG Logo 片段
- 旋转和缩放动画效果

**CSS 关键样式**:
```css
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100lvw;
  height: 100lvh;
  background: #ffffff;
  z-index: 10;
}

.loading-screen__box {
  width: 50px;
  height: 50px;
  position: absolute;
}

.loaderlogo-svg path {
  fill: #ffc400;
}
```

### 3.2 Hero Section (首屏)

**内容**:
- 大标题: "SHAPING THE NORMAL."
- 副标题描述公司理念

**样式特点**:
- 全屏高度 (100vh)
- 超大字号标题，逐字符动画
- 居中对齐

**文字动画效果**:
- 每个字符独立动画
- 逐字淡入效果
- `data-animate-word` 属性标记

### 3.3 About Section (关于)

**内容**:
- 公司名称和简介
- 粘性定位 (sticky) 效果

**交互**:
- 滚动时文字逐词高亮
- 装饰性强调元素 (accent dots)

### 3.4 Service Section (服务)

**内容**:
- 标题: "SERVICE"
- 服务描述
- 底部滚动提示: "Scroll to explore featured projects."
- 圆形进度指示器

**样式特点**:
- 大标题大写
- 文字逐字符动画
- 底部字符逐个淡入效果
- SVG 圆形进度条

### 3.5 Portfolio Section (作品集)

**布局**:
- 网格布局展示 9 个项目
- 每个项目独立区块
- 锚点定位便于导航

**项目数据结构**:
```javascript
{
  title: "项目名称",
  description: "项目描述",
  backgroundColor: "#xxxxxx",
  accentColor: "#xxxxxx",
  media: [图片数组],
  links: [链接数组],
  credit: "制作人员"
}
```

### 3.6 Company Section (公司信息)

**内容**:
- Instagram 链接区 (MORE)
- 公司信息列表
- 街景地图嵌入

**信息列表样式**:
```
Company Name    PRMO Inc.
Capital         ¥1,000,000
Established     December 12, 2018
CEO             Shoichiro Ashida
Access          [地址链接]
Awards          [获奖列表]
```

### 3.7 Contact Section (联系)

**内容**:
- 邮箱: hello@prm.ooo
- 联系表单
  - Name
  - Email
  - Message
  - Privacy Policy 同意框
  - Send Message 按钮

**表单样式**:
- 底部边框输入框
- 浮动标签效果
- 虚线边框按钮
- 深色背景主题

---

## 四、交互与动画

### 4.1 滚动驱动动画
- 使用 GSAP ScrollTrigger
- 视差滚动效果
- 章节切换过渡动画

### 4.2 3D WebGL 效果
- Three.js 驱动的背景
- 鼠标跟随效果
- 球体几何图形动画

### 4.3 音频可视化
- 顶部音频可视化面板
- 波形和频谱显示
- 可开关的音效系统

### 4.4 菜单系统
- 全屏覆盖式菜单
- 链接交错动画
- 语言切换 (JA/EN)
- 设置项 (Sound, Haptic, 3D Sensor)

### 4.5 悬停效果
```css
.sound:hover, .haptic:hover {
  /* 声音和触觉反馈 */
}

.menu-link:hover {
  /* 文字高亮效果 */
}

.foot-link:hover {
  /* 下划线动画 */
}
```

---

## 五、组件库

### 5.1 按钮组件

**主按钮**:
```css
.submit-button {
  border: 1px dashed currentColor;
  background: transparent;
  padding: 12px 24px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

**链接按钮**:
- 纯文本样式
- 悬停下划线动画

### 5.2 表单组件

**输入框**:
```css
.form-input {
  border: none;
  border-bottom: 1px solid currentColor;
  background: transparent;
  padding: 8px 0;
}
```

**复选框**:
- 自定义样式
- 标签内联

### 5.3 卡片组件

**作品卡片**:
- 大图展示
- 悬停遮罩
- 项目信息叠加

### 5.4 导航组件

**页脚导航**:
- 网格布局
- 分类标题
- 链接列表

---

## 六、响应式设计

### 断点
| 断点 | 宽度 | 说明 |
|------|------|------|
| Mobile | < 768px | 移动端 |
| Tablet | 768px - 1024px | 平板 |
| Desktop | > 1024px | 桌面端 |

### 移动端适配
- 汉堡菜单
- 简化动画
- 单列布局
- 触摸友好的交互

---

## 七、技术实现参考

### 7.1 核心技术
- **框架**: Nuxt 3
- **UI 框架**: 自定义 CSS
- **3D 渲染**: Three.js + WebGL
- **动画**: GSAP + ScrollTrigger
- **CMS**: Sanity.io
- **字体**: Google Fonts + 自定义字体

### 7.2 关键 CSS 变量
```css
:root {
  --theme-color: #ffc400;
  --portfolio-accent-color: #FFC400;
  --portfolio-accent-text-color: #000000;
  --bg-transition-duration: 1.5s;
  --light-section-bg: rgb(14, 13, 15);
  --light-section-text: rgb(211, 211, 211);
  --light-section-line: rgba(255, 255, 255, 0.3);
}
```

### 7.3 性能优化
- CSS 异步加载
- 图片懒加载
- 字体预加载
- WebGL 性能优化

---

## 八、可借鉴的设计元素

### 8.1 适用于个人博客的元素

1. **极简导航**
   - 固定顶部导航
   - 全屏菜单覆盖
   - 简洁的链接样式

2. **首屏大字设计**
   - 大标题 + 简短描述
   - 逐字动画效果
   - 全屏视觉冲击力

3. **作品集展示**
   - 网格布局
   - 图片为主
   - 悬停信息显示

4. **联系表单**
   - 浮动标签设计
   - 极简边框样式
   - 虚线按钮

5. **页脚设计**
   - 多列网格布局
   - 精选内容展示
   - 社交媒体链接

6. **滚动体验**
   - 平滑滚动
   - 章节过渡动画
   - 进度指示器

### 8.2 配色建议 (个人博客版本)

**方案一: 简约黑白**
- 主色: #000000
- 背景: #ffffff
- 强调: 自定义色

**方案二: 暖色调**
- 主色: #ffc400 (金色)
- 背景: #fafafa
- 文字: #1a1a1a

**方案三: 深色模式**
- 背景: #0a0a0a
- 文字: #ffffff
- 强调: #00ff88

---

## 九、资源文件

### 已下载文件
- `page_1.html` - 完整 HTML 页面
- `page_1.txt` - 提取的文本内容
- `page_1_styles.css` - 内联样式
- `summary.json` - 资源汇总

### CSS 资源链接
```
/_nuxt/entry.B8i6zTnY.css
/_nuxt/HeadSection.B5DjEpf8.css
/_nuxt/HeroSection.tAicoVbR.css
/_nuxt/Container.dQZ79vib.css
/_nuxt/AboutSection.DeOvt7cv.css
/_nuxt/ServiceSection.Bfy3RkRx.css
/_nuxt/PortfolioSection.DcGEoTlj.css
/_nuxt/CompanySection.4_E3GQaa.css
/_nuxt/ContactSection.D_vJ-8p2.css
/_nuxt/PhotoSection.B0fP_N6O.css
/css/loading-keyframes.min.css
```

### 字体资源
```
/fonts/NeueHelveticaPro93ExtendedBlack/font.woff2
/fonts/NeueHelveticaPro55Roman/font.woff2
/fonts/NeueHelveticaPro65Medium/font.woff2
```

---

## 十、开发建议

### 10.1 技术选型建议
1. **静态站点生成**: Astro / Next.js / Nuxt.js
2. **样式方案**: Tailwind CSS + 自定义 CSS
3. **动画库**: GSAP + ScrollTrigger
4. **字体**: Inter / JetBrains Mono / 自定义字体

### 10.2 实现优先级
1. **P0 - 核心页面结构**
   - 导航、Hero、关于、作品、联系

2. **P1 - 视觉增强**
   - 动画、过渡效果、悬停状态

3. **P2 - 高级功能**
   - WebGL 效果、音频可视化

### 10.3 注意事项
- 保持代码简洁可维护
- 优化移动端体验
- 关注性能指标 (Lighthouse)
- 确保可访问性 (A11y)

---

## 附录: 获奖记录

- **Awwwards**: HONORABLE MENTION, Mobile Excellence
- **CSS Design Awards**: WEBSITE OF THE DAY, SPECIAL KUDOS, BEST UI, BEST UX, BEST INNOVATION
- **FWA**: FWA OF THE DAY
- **DesignAwards.Asia**: DOTD, DOTM
- **CSS Winner**: Site of the Day
- **CSS Light**: Featured of the Day
- **CSS REEL**: WINNER OF THE DAY
- **Best CSS**: Site of The Day
- **YOUNG CANNES LIONS Japan**: Silver, Bronze
- **YOUNG SPIKES**: Representation of Japan
- **KOUKOKUDENTSUSHO**: Digital communication Silver
- **ACC TOKYO CREATIVITY AWARDS**: Media creative Silver

---

*文档生成时间: 2026-04-30*  
*基于 https://www.prm.ooo/ 网站爬取分析*
