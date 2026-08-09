# 地球 Online 测试中心 · 全站 UI 高级化重构

**设计师**：UI Designer（像素君）
**日期**：2026-07-26
**主题**：地球Online 赛博/HUD 科幻风（保持不变）

## 做了什么
识别了整站当前的界面设计与主题，并将所有页面的视觉语言统一、升级为更精致、更一致的高级质感。**题目与文案未做任何修改**（用户硬性约束）。

## 核心改动
1. **设计系统收口（src/style.css）**
   - 新增 HUD 设计令牌（CSS 变量）：统一面板/描边/辉光/圆角/缓动。
   - 精修 `.hud-panel`：玻璃拟态 + 柔和外发光 + 顶部内高光，层次更立体。
   - `.hud-corner` 切角括号加霓虹辉光。
   - 新增共享 `.back-btn`，替换三处内联拼凑的返回按钮。
   - 补全局 `:focus-visible` 焦点环（无障碍）+ `prefers-reduced-motion` 降级 + 按钮 disabled 态。

2. **两套答题页统一**
   - `AttributeTestPage.vue` 原本自写 `.question-card/.option-btn/.progress-bar/.confirm-btn` + 灰色扁平配色，与 `TestPage.vue` 割裂 → 全部改用全局 `.hud-panel/.option-card/.progress-hud/.btn-game`，视觉与交互完全对齐。

3. **消除重复与漂移**
   - `AttributeResultPage.vue` 删除了 scoped 里对 `.hud-panel/.hud-corner/.btn-game` 等的重复定义，复用全局类；属性条加按色辉光。
   - 新建 `src/utils/radar.ts` 共享雷达图（辉光网格 / 渐变多边形 + 外发光 / 顶点发光），替换 `ResultPage` 与 `ProfilePage` 各抄的一份 ~90 行绘制代码 → 视觉升级 + 零漂移。

4. **一致性收尾**
   - `HomePage.vue` 返回按钮改用共享 `.back-btn`；首页、结果页、属性面板随全局类升级整体提升。

## 验证
- `npm run build`（vue-tsc -b && vite build）：**0 错误**。
- 本地预览：`http://localhost:5173/Driver-Based-Testing/`（dev server 已启动）。

## 设计原则回顾
- 主题不动，只升级质感与一致性。
- 设计令牌集中管理，避免组件各自为政导致的视觉碎片化。
- 无障碍（键盘焦点、reduced-motion）默认内置。
