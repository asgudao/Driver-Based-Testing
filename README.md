# Driver-Based-Testing（地球 Online · 驱动力测试中心）

> 基于 Vue 3 + TypeScript + Three.js 的赛博朋克风格人格 / 驱动力测试 Web 应用

## 项目简介

**地球 Online** 是一款带有 **HUD / 赛博朋克视觉风格** 的在线驱动力测试应用。用户完成一份包含 9 种人格维度的测试题后，系统会根据加权计分给出：

- **主驱动力（Primary Driver）** —— 你的核心人格定位
- **副驱动力（Secondary Driver）** —— 你的次要人格
- **属性值面板** —— 九个维度的详细得分
- **职业 / 玩法建议** —— 基于驱动力组合的个性化建议

整个项目以「地球 Online」游戏化为包装，把传统的人格测试做成了一个**带 3D 旋转地球背景、HUD 数据流光、可交互面板**的 Web 产品。

适合作为：
- Vue 3 + TypeScript + Vite 工程实践
- Three.js 在 Vue 组件中集成的参考实现
- Tailwind 自定义主题（赛博朋克 / HUD 风格）的样式范本
- 心理 / 测评类 Web 产品的可复用模板

## 技术栈

| 类别         | 技术 / 版本                          |
| ------------ | ------------------------------------ |
| 框架         | Vue **3.4**                          |
| 语言         | TypeScript 5.3                       |
| 构建工具     | Vite 5                               |
| 路由         | Vue Router 4                         |
| 3D 渲染      | **Three.js 0.185**                   |
| 样式         | **Tailwind CSS 3.4**（自定义主题）   |
| 图标         | lucide-vue-next                      |
| 工具         | clsx / tailwind-merge                |
| 路径别名     | @ → src                              |
| Node         | ≥ 20                                 |

## 项目结构

```
Driver-Based-Testing/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── postcss.config.js
├── public/
│   ├── favicon.svg
│   └── favicon.png
└── src/
    ├── main.ts
    ├── App.vue
    ├── style.css                # 全局样式 + Tailwind 主题
    ├── router/
    │   └── index.ts             # 5 条路由
    ├── pages/
    │   ├── MainHomePage.vue     # 主页（3D 地球 + HUD 入口）
    │   ├── HomePage.vue         # 测试介绍页
    │   ├── TestPage.vue         # 答题页
    │   ├── ResultPage.vue       # 结果页（属性面板）
    │   └── ProfilePage.vue      # 个人属性面板
    ├── components/
    │   ├── Earth3D.vue          # 3D 地球组件
    │   └── Empty.vue
    ├── data/
    │   └── questions.ts         # 题目 + 9 种驱动力定义
    ├── lib/
    │   └── utils.ts
    ├── types/
    │   └── index.ts             # Question / DriverType / TestResult
    └── utils/
        └── scoreCalculator.ts   # 得分计算 + 排序
```

## 核心功能

- 🌍 **3D 旋转地球** 背景（Three.js）
- 🎮 **HUD 风格 UI** —— 赛博朋克主题（霓虹光、数据流、动态角标）
- 🧠 **驱动力测试** —— 9 种人格维度：学者 / 实干者 / 纨绔子弟 / 领导者 / 社交家 / …
- 📊 **得分计算** —— 投票加权 → 主/副驱动力 → 属性面板
- 👤 **个人中心** —— 已测试用户的属性档案展示
- 📱 **响应式** —— 支持 PC / 移动端
- 🧩 **数据驱动** —— 题库与维度定义集中在 `src/data/questions.ts`

## 环境要求

- Node.js **20.19+** 或 **22.12+**
- npm / pnpm / yarn 任一

## 快速开始

### 1. 克隆 & 安装
```bash
git clone https://github.com/asgudao/Driver-Based-Testing.git
cd Driver-Based-Testing
npm install
```

### 2. 本地开发
```bash
npm run dev
# 浏览器访问 http://localhost:5173
```

### 3. 生产构建
```bash
npm run build       # 类型检查 + Vite 构建，输出 dist/
npm run preview     # 本地预览生产产物
```

### 4. 类型检查 / Lint
```bash
npm run check       # vue-tsc 类型检查
npm run lint        # ESLint
npm run lint:fix    # 自动修复
```

## 路由说明

| 路径           | 名称          | 页面             |
| -------------- | ------------- | ---------------- |
| `/`            | main-home     | 主入口（3D 地球）|
| `/test/intro`  | test-intro    | 测试介绍         |
| `/test`        | test          | 答题页           |
| `/result`      | result        | 结果页           |
| `/profile`     | profile       | 个人属性面板     |

> ⚠️ 路由基路径固定为 `/Driver-Based-Testing/`，如需部署到根域名请修改 `src/router/index.ts` 中的 `createWebHistory` 第一个参数。

## 设计理念

- **主题色** —— 霓虹青（#22d3ee）+ 紫（#a855f7） + 深蓝背景
- **HUD 元素** —— 角标、扫描线、动态进度条、数据流文字
- **字体** —— Orbitron（标题）+ Noto Sans SC（正文）
- **3D 地球** —— 暗色地球 + 青色高光，慢速自转

## 后续可扩展方向

- [ ] 对接后端 API 持久化用户测试结果
- [ ] 引入更多测试量表（MBTI / 大五人格 / 霍兰德职业兴趣）
- [ ] 引入 ECharts / D3.js 绘制雷达图
- [ ] i18n 多语言支持（中 / 英）
- [ ] 服务端渲染（Nuxt 3）以提升 SEO

## License

本项目以 **MIT License** 发布，详见根目录 `LICENSE`。
