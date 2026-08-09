# 项目记忆 · Test_Kinds_Of_People（地球Online 测试中心）

## 项目约定（必须遵守）
- **题目/选项文字不可修改**：用户硬性要求。所有界面/主题改动只动 CSS、组件模板结构、设计令牌；绝不改 `src/data/questions.ts` 与 `src/data/attributes.ts` 的题干与选项文案。
- 设计系统唯一来源：`src/style.css`（全局类 .hud-panel/.hud-corner/.option-card/.progress-hud/.btn-game/.btn-secondary/.badge-hud/.data-stream/.back-btn）。新增页面/组件应复用这些类，不要在 scoped 里重复定义。
- 雷达图统一用 `src/utils/radar.ts` 的 `drawRadar(canvas, labels, rawScores)`，不要再各页手抄。

## 技术栈
- Vue 3 + TypeScript + Vite 5；Vue Router 4，history base `/Driver-Based-Testing/`。
- Three.js 地球背景：`src/components/Earth3D.vue`。
- 主题：地球Online 赛博/HUD 风（深空 #020208、霓虹青/蓝/紫、Orbitron/Rajdhani/Noto Sans SC、扫描线、辉光、切角 HUD 面板）。

## 历史
- 2026-07-26：全站 UI 高级化重构（统一两套答题页、抽取共享雷达、补无障碍与节制动效）。见当日日志。
