## 1. Architecture Design

```mermaid
flowchart LR
    A[用户] -->|浏览器| B[Vue 3 前端]
    B --> C[路由层]
    C --> D[首页]
    C --> E[测试页]
    C --> F[结果页]
    E --> G[问题数据]
    E --> H[状态管理]
    F --> I[结果计算]
```

## 2. Technology Description

- **Frontend**: Vue 3 + TypeScript + Tailwind CSS 3 + Vite
- **Initialization Tool**: vite-init (vue-ts template)
- **Backend**: None (纯静态网站)
- **State Management**: Vue 3 Composition API (ref/reactive)
- **Chart**: Canvas API (雷达图)

## 3. Route Definitions

| Route | Purpose |
|-------|---------|
| / | 首页 - 测试介绍 |
| /test | 测试页 - 问答流程 |
| /result | 结果页 - 测试结果展示 |

## 4. Project Structure

```
src/
├── components/
│   ├── HeroSection.vue      # 首页英雄区域
│   ├── QuestionCard.vue     # 问题卡片组件
│   ├── ProgressBar.vue      # 进度条组件
│   ├── ResultRadar.vue      # 结果雷达图
│   └── ResultCard.vue       # 结果分析卡片
├── views/
│   ├── Home.vue             # 首页
│   ├── Test.vue             # 测试页
│   └── Result.vue           # 结果页
├── data/
│   └── questions.ts         # 问题数据定义
├── utils/
│   └── scoreCalculator.ts   # 分数计算工具
├── types/
│   └── index.ts             # 类型定义
├── App.vue
├── main.ts
└── style.css
```

## 5. Data Model

### 5.1 Question Type

```typescript
interface Option {
  label: string;
  scores: number[];  // 对应的驱动类型代码数组
}

interface Question {
  id: string;
  text: string;
  options: Option[];
  condition?: {
    questionId: string;
    optionLabels: string[];
  };
}
```

### 5.2 Driver Type

```typescript
interface DriverType {
  code: number;
  name: string;
  description: string;
  color: string;
}
```

### 5.3 Result Type

```typescript
interface TestResult {
  scores: Record<number, number>;  // 各驱动类型得分
  primaryDriver: number;           // 主要驱动类型
  secondaryDriver: number;         // 次要驱动类型
}
```

## 6. Question Flow Logic

```mermaid
flowchart TD
    Q1[问题1: 空闲时间] -->|选择A-玩游戏| Q1A[问题1a: 玩游戏原因]
    Q1 -->|选择G-看电影| Q1B[问题1b: 看电影原因]
    Q1 -->|其他选项| Q2[问题2: 工作偏好]
    Q1A --> Q2
    Q1B --> Q2
    Q2 --> Q3[问题3: 主动学习]
    Q3 --> Q4[问题4: 学习满足感]
    Q4 --> Q5[问题5: 完成任务满足感]
    Q5 --> Q6[问题6: 娱乐不空虚]
    Q6 --> Q7[问题7: 安排他人满足感]
    Q7 --> Q8[问题8: 疲惫时寻求他人]
    Q8 --> Q9[问题9: 帮助他人满足感]
    Q9 --> Q10[问题10: 参观展览安定]
    Q10 --> Q11[问题11: 景观建筑美]
    Q11 --> Q12[问题12: 探索新地方]
    Q12 --> Q13[问题13: 探索未知领域]
    Q13 --> Q14[问题14: 尝试新领域]
    Q14 --> Result[计算结果]
```

## 7. Score Calculation

1. 初始化各驱动类型得分为0
2. 根据用户选择的选项，将对应分数累加到各驱动类型
3. 每个选项可能对应多个驱动类型（如问题2-A对应3和9）
4. 计算完成后，找出得分最高的驱动类型作为主要类型
5. 第二高的作为次要类型

## 8. Styling

- 主题色：深紫色 #1a0a2e, 深蓝色 #16213e
- 强调色：金色 #f4d03f
- 背景：星空粒子效果
- 动画：问题切换淡入淡出、选项悬停发光、进度条渐变
