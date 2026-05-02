# PRMO 网站视觉效果与背景参考

> 基于 Firecrawl 截图和 HTML 分析

---

## 一、页面背景类型

### 1.1 首屏背景 (Hero Section)

**特点**:
- 纯白色背景 (`#ffffff`)
- 顶部有轻微渐变/阴影效果
- WebGL 3D 场景叠加 (动态球体)

**CSS 样式**:
```css
.hero-section {
  background-color: #ffffff;
  min-height: 100vh;
  position: relative;
}

/* WebGL Canvas 叠加层 */
.webgl-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
```

### 1.2 作品集背景 (Portfolio Sections)

每个作品都有独立的背景色，实现章节切换效果：

| 项目 | 背景色 | 文字色 | 类型 |
|------|--------|--------|------|
| SHUEISHA GAMES | `#0c0c0c` (近黑) | `#ffffff` | 深色 |
| ATTACK SUPER FIT BOTTLE | `#afd1d8` (薄荷蓝) | `#272c37` | 浅色 |
| KUROMI | `#150234` (深紫) | `#ffffff` | 深色 |
| STYLY | `#d6e3ed` (淡蓝灰) | `#272c37` | 浅色 |
| THE NORTH FACE | `#ffffff` (白) | `#000000` | 浅色 |
| NEWS | `#ffffff` (白) | `#00ff00` | 浅色+荧光绿 |
| Hoshino Resorts | `#c8bca0` (暖灰) | `#ffffff` | 中色 |
| TomorroWater | `#e8eaeb` (浅灰) | `#000000` | 浅色 |
| YES | `#d6e3ed` (淡蓝) | `#272c37` | 浅色 |

**背景切换动画**:
```css
.content-section {
  transition: background-color 1.5s cubic-bezier(0.16, 1, 0.3, 1);
}
```

### 1.3 联系区域背景 (Contact Section)

**特点**:
- 深色背景: `rgb(14, 13, 15)` (#0e0d0f)
- 浅色文字: `rgb(211, 211, 211)` (#d3d3d3)
- 分割线: `rgba(255, 255, 255, 0.3)`

**CSS 变量**:
```css
:root {
  --light-section-bg: rgb(14, 13, 15);
  --light-section-text: rgb(211, 211, 211);
  --light-section-line: rgba(255, 255, 255, 0.3);
}
```

### 1.4 照片区域背景 (Photo Section)

**特点**:
- 使用 Canvas 绘制动态照片背景
- 随滚动变化的照片切换
- 模糊效果叠加

```css
.photo-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.background-color-blur {
  backdrop-filter: blur(10px);
  transition: opacity 0.3s;
}
```

---

## 二、动态视觉效果

### 2.1 WebGL 3D 背景

**技术**: Three.js

**元素**:
- 球体几何图形
- 线框渲染
- 鼠标跟随旋转
- 轻微浮动动画

**实现参考**:
```javascript
// 简化的 Three.js 场景设置
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

// 球体
const geometry = new THREE.IcosahedronGeometry(1, 2);
const material = new THREE.MeshBasicMaterial({ 
  color: 0xffc400, 
  wireframe: true,
  transparent: true,
  opacity: 0.3
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);
```

### 2.2 滚动驱动效果

**背景色过渡**:
- 每个章节触发背景色变化
- 使用 Intersection Observer 或 ScrollTrigger
- 过渡时长: 1.5s，缓动: cubic-bezier(0.16, 1, 0.3, 1)

```javascript
// GSAP ScrollTrigger 示例
gsap.to('.background-color', {
  backgroundColor: '#0c0c0c',
  scrollTrigger: {
    trigger: '.portfolio-section',
    start: 'top center',
    end: 'bottom center',
    scrub: true
  }
});
```

### 2.3 文字动画

**逐字动画**:
- 每个字符独立包裹在 `<span>` 中
- `data-animate-word` 属性标记
- 滚动触发淡入效果

```html
<h2 class="hero-title">
  <span data-animate-word>S</span>
  <span data-animate-word>h</span>
  <span data-animate-word>a</span>
  <!-- ... -->
</h2>
```

```css
[data-animate-word] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s, transform 0.5s;
}

[data-animate-word].visible {
  opacity: 1;
  transform: translateY(0);
}
```

### 2.4 加载动画

**Loading Screen**:
- 白色背景
- 四个方块组成的 Logo 动画
- 旋转 + 缩放效果
- 加载完成后淡出

```css
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100lvw;
  height: 100lvh;
  background: #ffffff;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-screen__stage {
  width: 1000px;
  height: 1000px;
  transform: translate(-552px, 50px) scale(calc(7.33lvh / 50px));
}
```

### 2.5 悬停效果

**链接悬停**:
```css
.foot-link {
  position: relative;
}

.foot-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: currentColor;
  transition: width 0.3s ease;
}

.foot-link:hover::after {
  width: 100%;
}
```

**按钮悬停**:
```css
.submit-button {
  border: 1px dashed currentColor;
  background: transparent;
  transition: background 0.3s, color 0.3s;
}

.submit-button:hover {
  background: currentColor;
  color: var(--bg-color);
}
```

---

## 三、光影效果

### 3.1 渐变叠加

**Hero 区域顶部渐变**:
```css
.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200px;
  background: linear-gradient(to bottom, rgba(0,0,0,0.05), transparent);
  pointer-events: none;
}
```

### 3.2 模糊效果

**背景模糊**:
```css
.blur-overlay {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
```

---

## 四、个人博客实现建议

### 4.1 简化版背景方案

如果你不想使用 WebGL，可以用 CSS 实现类似效果：

```css
/* 渐变背景动画 */
.animated-background {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

### 4.2 章节背景切换 (简化版)

```html
<section class="section" data-bg-color="#ffffff">
  <!-- 内容 -->
</section>
<section class="section" data-bg-color="#0c0c0c">
  <!-- 内容 -->
</section>
```

```javascript
// 使用 Intersection Observer
const sections = document.querySelectorAll('.section');
const body = document.body;

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bgColor = entry.target.dataset.bgColor;
      body.style.backgroundColor = bgColor;
    }
  });
}, { threshold: 0.5 });

sections.forEach(section => observer.observe(section));
```

### 4.3 纯 CSS 3D 效果 (替代 WebGL)

```css
.css-3d-sphere {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 2px solid #ffc400;
  opacity: 0.3;
  animation: rotate 20s linear infinite;
  transform-style: preserve-3d;
}

@keyframes rotate {
  from { transform: rotateY(0deg) rotateX(0deg); }
  to { transform: rotateY(360deg) rotateX(360deg); }
}
```

---

## 五、已保存的视觉资源

| 文件 | 说明 |
|------|------|
| `prm-website-screenshot.png` | 完整页面截图 (长图) |
| `branding-info.json` | 品牌色彩和字体信息 |
| `page_1.html` | 完整 HTML 结构 |

---

## 六、关键视觉特点总结

1. **极简主义** - 大量留白，聚焦内容
2. **动态背景** - 章节切换时背景色变化
3. **金色主题** - #ffc400 作为品牌强调色
4. **3D 元素** - WebGL 球体增加空间感
5. **流畅过渡** - 1.5s 的背景色过渡动画
6. **滚动交互** - 滚动驱动的文字和背景动画

---

*文档更新时间: 2026-04-30*
