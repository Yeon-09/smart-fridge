# 冰箱信号灯 🚦❄️

> 一款帮助你管理冰箱食材、追踪保质期、减少食物浪费的单页 PWA 工具。
> 深色毛玻璃风格，支持**中韩双语**，可**安装到桌面离线使用**。

---

## ✨ 功能一览

### 🔴🟡🟢 信号灯系统
- **绿灯 🟢** — 食材状态安全，保质期充足
- **黄灯 🟡** — 剩余 ≤ 3 天，快过期提醒
- **红灯 🔴** — 已过期，尽快处理
- 顶部主信号灯根据整体状态自动变色，一眼掌握全局

### 🥬 食材管理
- **添加/编辑食材** — 名称、分类、入库日期、保质期天数，全表单可编辑
- **6 大分类** — 蔬菜 / 肉类 / 乳制品 / 水果 / 调料 / 其他，每个分类自带 emoji 和专属配色

### ❄️ 存储位置
- 每个食材可选择 **冷藏 / 冷冻 / 室温** 三种存储位置
- 切换分类 + 存储位置时，保质期天数会自动联动为该场景的预设天数（手改后不再自动覆盖）
- 卡片上带位置胶囊标签，颜色区分

### 🔎 筛选与搜索
- 状态筛选 — 全部 / 快过期 / 已过期
- 分类筛选 — 按 6 大分类单独查看
- 位置筛选 — 冷藏 / 冷冻 / 室温
- 关键词搜索 — 实时按食材名称过滤
- 排序 — 按剩余天数 / 入库日期切换

### 🛒 购物清单
- 勾选食材卡片一键加入购物清单
- 底部折叠/展开清单面板，已购项标记与清除
- 购物清单独立 localStorage 持久化

### 📊 统计分析面板（Chart.js 4 图表）
点击标题栏可折叠，默认展开：
1. **分类占比饼图** — 6 分类配色统计
2. **存储位置环形图** — 环形中心显示食材总数
3. **浪费率数字卡片** — >30% 红 / 10-30% 黄 / <10% 绿
4. **近 7 天过期趋势折线图**

### 💾 数据导入导出
设置菜单可一键：
- **导出**：食材 + 购物清单打包为 JSON 文件
- **导入**：选择 JSON 文件覆盖（导入前确认提示）

### 🇨🇳🇰🇷 中韩双语
- 顶部切换按钮一键在中文 / 한국어 之间切换（带淡出过渡动画）
- 所有 UI 文字、标签、提示、统计均支持双语

### 📱 PWA 支持
- `manifest.json` + `sw.js` 完整实现
- 顶部可关闭安装提示条："📱 安装到桌面，离线也能用"
- 安装后以独立窗口形态运行（standalone）
- Service Worker **Cache First** 策略，页面和静态资源全部离线可用
- 缓存版本号 `v1`，升级时自动清理旧缓存

---

## 📁 项目结构

```
冰箱信号灯/
├── index.html        # 单文件主程序（HTML + CSS + 内联 JS 16 个模块）
├── manifest.json     # PWA 清单文件 + 192/512 SVG 信号灯图标
└── sw.js             # Service Worker（Cache First，版本化缓存）
```

### index.html 内模块划分
| 模块 | 职责 |
|------|------|
| Module 1 | i18n 中韩双语文案字典 |
| Module 2 | 分类配置 + 存储位置保质期预设表 |
| Module 3 | 状态管理 + localStorage 读写 |
| Module 4 | DOM 引用集中管理 |
| Module 5 | 日期、信号灯状态计算工具 |
| Module 6 | 应用 i18n 文案到 data-i18n 节点 |
| Module 7 | Dashboard / 列表 / 清单渲染 |
| Module 7A | PWA SW 注册 + 安装提示条逻辑 |
| Module 7B | Chart.js 四图表创建与更新 |
| Module 8 | 添加 / 编辑弹窗逻辑（位置联动保质期） |
| Module 9 | 删除（带淡出动画） |
| Module 9B | 购物清单功能 |
| Module 9C | JSON 导入 / 导出 |
| Module 10 | 语言切换（带淡出过渡） |
| Module 11 | 全部事件绑定 |
| Module 12 | 初始化入口 |

---

## 🚀 本地运行

项目为纯静态 HTML，无需构建。Service Worker 需要通过 HTTP 协议访问（不能直接 `file://` 打开）：

```bash
# 方法 1：Python
python -m http.server 8080

# 方法 2：Node.js (npx)
npx serve .

# 方法 3：VS Code Live Server 插件
```

然后浏览器打开 `http://localhost:8080`。

### 验证 PWA
1. Chrome 打开地址栏，若支持 PWA 会看到右上角"安装应用"图标，或页面顶部出现蓝色安装提示条
2. `F12 → Application 面板` 可查看：
   - **Manifest**：检查图标/名称/主题色等配置
   - **Service Workers**：查看 sw.js 注册状态、Offline 测试
   - **Storage → Cache Storage**：查看预缓存资源与运行时缓存

---

## 🗃️ localStorage 键位约定

| Key | 用途 | 格式 |
|-----|------|------|
| `fridge_items` | 食材数组（含 location 字段） | JSON |
| `fridge_shoppingList` | 购物清单数组 | JSON |
| `fridge_lang` | 当前语言 `zh` / `ko` | string |
| `fridge_filter` | 状态筛选 | `all` / `expiring` / `expired` |
| `fridge_catFilter` | 分类筛选 | `all` / `vegetable` / ... |
| `fridge_locFilter` | 存储位置筛选 | `all` / `fridge` / `freezer` / `room` |
| `fridge_sort` | 排序方式 | `remaining` / `addedDate` |
| `fridge_search` | 搜索关键词 | string |
| `fridge_shopCollapsed` | 购物清单是否折叠 | `0` / `1` |
| `fridge_statsCollapsed` | 统计面板是否折叠 | `0` / `1` |
| `fridge_pwaDismissed` | PWA 安装条是否被关闭 | `0` / `1` |

---

## 🗂️ 分类 + 存储位置保质期预设参考

| 分类 | 冷藏 ❄️ | 冷冻 🧊 | 室温 🌡️ |
|------|:---:|:---:|:---:|
| 🥬 蔬菜 | 3 天 | 30 天 | 1 天 |
| 🥩 肉类 | 2 天 | 90 天 | ⚠️ 不推荐（0 天） |
| 🥛 乳制品 | 7 天 | ⚠️ 不推荐（-1） | 1 天 |
| 🍎 水果 | 5 天 | 30 天 | 3 天 |
| 🧂 调料 | 30 天 | 30 天 | 30 天 |
| 🥚 其他 | 7 天 | 30 天 | 3 天 |

> 用户手动修改保质期天数后，再次切换分类/位置时**不会再被自动覆盖**。
> 编辑已有食材时同样保留原保质期，防止联动覆盖用户数据。

---

## 🎨 设计

- 深色毛玻璃风格：`#0f172a → #1e293b` 渐变背景 + `backdrop-filter: blur(12px)` 半透明卡片
- 主色：`#38bdf8` 天蓝色（信号灯绿 `#4ade80` / 黄 `#facc15` / 红 `#f87171`）
- 圆角 16px，过渡 0.3s，全站响应式，手机端自动堆叠布局
- 所有卡片、弹窗、按钮、表格、图表均适配深色模式

---

## 🔧 自定义扩展建议

1. **升级缓存版本**：修改 `sw.js` 顶部 `CACHE_VERSION = 'v1'` 为 `v2`，所有用户自动清理旧缓存并拉新资源。
2. **新增分类**：在 `index.html` 的 `CATEGORIES` 对象加一项，并在 i18n 字典的 `zh`/`ko` 各补 `category_xxx` key。
3. **新增图表**：在 HTML `.sa-grid` 里加一个 `.sa-chart-box`，在 `renderStatsAnalysis()` 中新增 Chart 实例即可（记得 destroy 重建逻辑）。
4. **保质期提醒通知**：可在 `init()` 中加 `Notification.requestPermission()`，然后在 `renderDashboard()` 统计到过期数 >0 时触发通知。

---

## 📝 License

MIT. Enjoy and don't let your food go bad 🍅✨
