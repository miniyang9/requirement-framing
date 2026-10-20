# requirement-framing

把一个"种子"（几句话的需求）展开成可审查的规格，**在任何人开始拆任务之前**设一道门。同时兼容单人（单 agent）与多人（多 agent）场景。

这也是一份 **DSH skill-only plugin** 的最小范例：插件里没有功能代码，只有一个 skill 目录和几行注册胶水。

## 它解决什么

用户用几句话描述一个工程，agent 常常直接分解成几个小任务——于是框架、方案、非功能、运维这些层面从未被讨论。这个 skill 强制先做**展开**（横切面判定 + 隐含工作包 + 决策点 + 三档规模 + 失败预演），再**分档**决定要不要走后续的架构、契约、骨架、切片。

三条门禁：

1. 没有通过的 frame 文档 → 不许 plan、不许切任务、不许写代码
2. 展开阶段出现任务列表 → 本轮作废
3. 派发时发现契约不足 → 停下报告，不许自行扩展契约

## 结构

```
requirement-framing/
├── package.json          # npm 身份 + dsh.bundle.patch 指向 patch 文件
├── cordis.patch.yml      # 插入一个 filesystem skill provider，指向 ./skills
├── lib/index.js          # 仅用于解析 skills/ 根目录，无运行逻辑
├── skills/
│   └── requirement-framing/
│       ├── SKILL.md              # 主干：信条 + 分流 + L0–L7 + 铁律
│       └── references/
│           ├── cross-sections.md # L1 的 17 项横切面判定表
│           ├── contracts.md      # L3 契约 / L5 骨架判据 / L6 任务卡 / L7 派发
│           └── modes.md          # S 档 vs M 档、升降级信号、单人六死法
├── CHANGELOG.md
├── LICENSE
└── README.md
```

`SKILL.md` 故意保持短，重内容按分支读 `references/`——避免一次塞满上下文。

## 两种用法

### A. 当 skill 用（不安装）

skill 的本质是"一个被发现的目录"。把 `skills/requirement-framing/` 放到 harness 已扫描的 skills 目录下即可生效；或者更土的办法——把 `SKILL.md` 内容粘给任何 agent 当指令。

优点：零安装、零权限、跨 harness 可移植（Claude Code / Codex / 其他支持 Agent Skills 的宿主都能读）。

### B. 当 plugin 用（安装）

本仓库同时是一个 npm 包的形状，可以按 DSH 插件的方式安装：

```bash
# 在 DSH profile 目录下
npm install <path-to-this-repo>    # 或 npm link / 私有 registry
```

安装后 `cordis.patch.yml` 会插入一个 `@deepseek-ai/dsh-skill-filesystem` 提供者，把 `bundledSkillDir` 指向本包的 `skills/`，从而让这个 skill 出现在会话的 skill 目录里。

优点：可版本化、可更新、可一键启用/停用、能进 marketplace。
代价：失去跨 harness 可移植性（`cordis.patch.yml` 是 DSH 特有的），并且引入一个安装依赖。

## skill 与 plugin 的区别

| 维度 | skill | plugin |
|---|---|---|
| 载体 | 一个文件夹（`SKILL.md` + 资源） | 一个安装单元（npm 包 + patch） |
| 生效方式 | 放进已发现目录即生效 | 安装 + patch 注册 + 重载 |
| 能否执行代码 | **不能** | 能（Node 模块入口） |
| 能否挂事件 / 工具 / MCP | **不能** | 能 |
| 版本与更新 | 无内建机制（靠 git / 复制） | `package.json` version + 包管理器 |
| 分发 | 复制、git、gist | npm / marketplace |
| 跨 harness 可移植 | **强**（Agent Skills 标准） | 弱（patch 是宿主特有配置） |
| 权限面 | 零 | 运行代码即有权限面 |
| 上下文成本 | 目录里只有 name+description，正文按需加载 | 同左，另加启动时加载模块 |

一句话：**plugin 不改变 skill 的能力，只改变它的"到达方式"。** 纯内容的 skill 包装成 plugin，插件里就只有注册胶水，没有功能代码——本仓库即如此。

## 版本

0.2.0 · draft · 2026-10-20

## 许可

MIT
