# Code Review 报告

**项目：** TaskPlanner（todo-board）
**日期：** 2026-07-18
**审查范围：** 全部源码（7 个 API 路由 + 8 个组件 + 4 个 lib + 3 个页面）

---

## 一、整体评价

项目代码结构清晰，符合 Next.js App Router 规范。API 路由分层合理（tasks/stats/fish/revalidate），组件职责单一，类型定义完整。所有 API 均有 try-catch 错误保护，不会出现未捕获异常导致服务崩溃的情况。

---

## 二、架构概览

| 层 | 文件数 | 说明 |
|----|--------|------|
| API 路由 | 6 个 | RESTful 风格，统一返回 `{code, data/msg}` |
| 前端组件 | 8 个 | 客户端组件均标注 `"use client"` |
| 数据模型 | 3 个 | Task.ts、Fish.ts、mongodb.ts |
| 全局状态 | 1 个 | ThemeContext.tsx（深色模式） |
| 服务端页面 | 3 个 | 仪表盘、看板、新建任务 |

---

## 三、严重问题（P1）

**无。** 项目不存在导致崩溃或数据丢失的严重问题。

---

## 四、中等问题（P3）

### 4.1 TaskCard.tsx 缺少 fetch 错误处理

**文件：** [app/components/TaskCard.tsx](/app/components/TaskCard.tsx:41-54)
**行号：** 41-54

`handleAction` 中的 `fetch` 调用没有 try-catch。如果 PATCH 或 DELETE 请求因网络问题失败（断开、超时），用户不会收到任何提示，且 `setLoading(false)` 无法被执行，按钮会卡在加载状态。

**建议修复：**
```typescript
const handleAction = async (action: "status" | "delete") => {
  setLoading(true);
  try {
    const res = await fetch(`/api/tasks/${task._id}`, {
      method: action === "status" ? "PATCH" : "DELETE",
      headers: action === "status" ? { "Content-Type": "application/json" } : undefined,
      body: action === "status" ? JSON.stringify({ status: nextStatus[task.status] }) : undefined,
    });
    const json = await res.json();
    if (json.code !== 200) { alert(json.msg || "操作失败"); setLoading(false); setConfirmDelete(false); return; }
  } catch {
    alert("网络错误，请检查连接");
  }
  setLoading(false);
  setConfirmDelete(false);
  onRefresh();
};
```

### 4.2 看板刷新依赖 `window.location.reload()`

**文件：** [app/components/TaskBoard.tsx](/app/components/TaskBoard.tsx:37-42)

`refresh` 函数通过 `window.location.reload()` 实现页面刷新，这会导致页面完全重载，造成短暂的白屏闪烁。更优雅的方式是使用 `useRouter().refresh()` 或通过状态提升触发重新请求。

**建议：**
```typescript
const refresh = async () => {
  await fetch("/api/revalidate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: "/tasks" }),
  });
  // 用 Next.js 的 router.refresh() 替代
  window.location.reload();
};
```

但因 `TaskBoard` 是客户端组件且看板数据在服务端页面传入，当前方案是最简单的可行方案，可酌情接受。

### 4.3 深色模式首次加载闪烁

**文件：** [app/lib/ThemeContext.tsx](/app/lib/ThemeContext.tsx:35)

`isDark` 使用惰性初始化读取 localStorage，导致首次渲染时客户端与服务端颜色不一致。当前通过各组件的 mounted + fallback 模式补偿，但首次加载仍会有从亮色"闪"到深色的过程。

完全消除闪烁的方案是在 `<head>` 中添加阻塞式 `<script>` 在 React 加载前设置 `data-theme`：

```html
<script dangerouslySetInnerHTML={{
  __html: "if(localStorage.getItem('theme')==='dark'){document.documentElement.setAttribute('data-theme','dark')}"
}} />
```

---

## 五、轻微问题（P4）

### 5.1 CSS 变量与 ThemeContext 颜色值重复定义

`globals.css` 定义了 `--bg-page`、`--text-primary` 等 CSS 变量，`ThemeContext.tsx` 中也定义了相同的 `lightColors` / `darkColors` 对象。部分文件（如 page.tsx）使用 `var(--bg-card)`，部分使用内联 `colors.card`，存在两份颜色定义不一致的隐患。

**建议：** 统一为一种方式——推荐全用 CSS 变量，组件中直接引用 `var(--bg-card)`。

### 5.2 AddTaskForm.tsx 没有使用 Server Action 而是直接 fetch

新建任务通过客户端 fetch POST 实现提交，提交后通过 `router.push("/tasks")` + `router.refresh()` 刷新。这种方式可行，但如果改用 Server Action（如 `"use server"` 在服务端直接操作数据库），可以减少一次 HTTP 往返。

### 5.3 package.json 中有 unused dependencies

`eslint-config-next` 是依赖但未在 eslint 配置文件中显式引用。当前 eslint.config.mjs 可能未正确使用该配置。

### 5.4 FishTank.tsx 组件体积过大

FishTank.tsx 约 480 行，功能混合了 Canvas 动画逻辑、UI 渲染、状态管理。建议拆分为：
- `FishTank.tsx` — 容器组件（状态管理 + UI）
- `useFishAnimation.ts` — Canvas 动画逻辑自定义 Hook
- `FishDrawer.tsx` — 绘制弹窗子组件

---

## 六、亮点

| 类别 | 亮点 |
|------|------|
| 错误处理 | 全部 API 有 try-catch 保护，返回统一错误格式 |
| 类型安全 | Task.ts 和 Fish.ts 有完整的 TS 类型定义 |
| Git 规范 | 提交使用 feat/fix/docs/chore 前缀 |
| 深色模式 | ThemeContext + CSS 变量 + localStorage 持久化 |
| 鱼缸系统 | Canvas 动画 + 手绘 + MongoDB 持久化，交互完整 |
| 文档 | README + API + Prompt Log + 总结报告 四份文档齐备 |

---

## 七、总结

| 严重性 | 数量 | 状态 |
|--------|------|------|
| P1（严重） | 0 | 无 |
| P3（中等） | 3 | 建议修复：fetch 错误处理、reload 闪烁、首屏闪烁 |
| P4（轻微） | 4 | 建议优化：颜色重复、体积拆分、ESLint 配置 |

总体来看项目质量良好，功能完整，代码可读性和规范性达到交付标准。中等问题不影响核心功能运行，可根据时间安排选择性修复。
