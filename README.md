# 需求框架三件套 · requirement-framing / solution-design / incremental-delivery

把几句话的需求展开成可审查的规格，**在任何人开始拆任务之前**设一道门。

**三个 skill 各管一段**：`requirement-framing` 做 L1 立项（从一句话到一份签字的 frame）；`solution-design` 做 L2–L5（架构 / 契约 / 决策 / 骨架判据）；`incremental-delivery` 做 L6–L7 执行（选片 / 写 / 验 / 收尾 / 收敛）。

一个纯内容的 skill：只有指令和参考文档，没有可执行代码，没有安装依赖。

## 适用范围（第 0 步就会判断）

**只用于会重复运行的产物**——它会被执行不止一次，而不是一次性回答。

| 需求 | 是否启用 |
|---|---|
| 脚本 / 服务 / 工具 / agent / 改造存量代码库 | ✅ 启用 |
| 定时推送 / 日报 / 监控 / 机器人 | ✅ 启用——哪怕实现只是一条调度器条目 |
| 一次性脚本，跑完就丢 | ❌ 退化，不立项（与 SKILL 第 0 步一致）|
| 一次性回答 / 方案 / 调研 / 汇报 / 文章 / 活动策划 | ❌ 退化，不启用 |
| 混合（"产品含技术方案 + 运营方案"） | ⚠️ 只对软件部分启用，其余回正常沟通 |

**退化 ≠ 敷衍**：不建档、不判体量档、不设门禁，但仍按正常对话澄清目标、给建议，并明确说一句"这不是重复运行的产物，我不启用立项展开"——让用户知道你**选择**了不启用，而不是漏了它。

## 它解决什么

用户用几句话描述一个工程，agent 常常直接分解成几个小任务——于是框架、方案、非功能、运维这些层面从未被讨论。这个 skill 强制先**展开**（体量判定 / 隐含工作包 / 两遍扫描 / 决策点 / 三种范围方案 / 失败预演 / 验收标准 共七项），把没说的展开出来，再让用户签字。

三条门禁：

1. 领域闸门未通过 → 全程不介入
2. 没有签字的 frame → 不许创建任何**可执行产物或工程结构**（代码 / 脚手架 / 部署脚本 / 目录 / 依赖）。**frame 本身不在此列**——它是提问与签字的载体，必须先写
3. 展开阶段出现任务列表 → **越线**；回第 2 步把步骤改写成能力与责任，不要带下去

## 流程一览

```
第 0 步  领域闸门      会重复运行吗？不是 → 退化
第 1 步  定体量档      T0 直接做 / T1 一页五问 / T2 走完 L1
第 2 步  L1 展开       展开清单（七项）+ ≤5 个问题（禁止任务列表）
第 3 步  人审签字      划掉 / 纠正 [推断] / 答问 / 选范围方案
第 4 步  检查交付物    frame 的 §0 承重事实是否写全
第 5 步  交棒          指向下游：已签的 frame 就是输入
```

## 结构

```
requirement-framing/
├── skills/requirement-framing/   # A：L1 立项
│   ├── SKILL.md              # 主干：信条 + 门禁 + 领域判定 + 体量档 + L1 + 交棒 + 指针
│   └── references/           # 细则，按需读取
│       ├── questioning.md    # 提问纪律：三分类 / 一题一问 / 质量门 / 周期五问
│       ├── cross-sections.md # 17 项横切面 + 五角色第二遍
│       ├── provenance.md     # §0 写法：推论 / 锚点 / 四类来源
│       └── red-flags.md      # L1 侧 10 条红旗
├── skills/solution-design/   # B：L2–L5 架构 / 契约 / 决策 / 骨架判据
│   ├── SKILL.md              # 门禁（读已签 frame）+ 五个架构问题 + 契约判据 + 交棒
│   └── references/
│       ├── contracts.md      # 六个契约 / 桩 / 02 索引规则
│       ├── diagrams.md       # 视图选择 + 可重建路径
│       └── change-propagation.md  # 变更传播 / 解冻 / 交付前三查
├── skills/incremental-delivery/  # C：执行（选片/写/验/收尾/收敛）
│   ├── SKILL.md
│   └── references/
│       ├── workmode.md       # 串行 / 派发 逐环节对照
│       └── dispatch.md       # 派发：任务卡 / 星形 DAG / 契约符合性检查 / 合并
├── scripts/check.mjs         # 仓库自检：BOM / frontmatter / 指针 / 孤儿 / 行尾 / 计数
├── CHANGELOG.md
├── LICENSE
└── README.md
```

## 交棒

| 级 | 谁做 |
|---|---|
| L1 立项 | **`requirement-framing`** |
| L2 架构 · L3 契约 · L4 决策 · L5 骨架 | **`solution-design`** |
| 执行（串行或派发） | **`incremental-delivery`** |
| L6 切片 · L7 执行 | **`incremental-delivery`**（切片判据来自 L2/L3，见 `solution-design`） |

**为什么拆**：需求展开和架构设计的**触发时机不同**——"我还没想清楚要做什么" vs "我知道要做什么，不知道该怎么拆"。一个 skill 只有一个 description，混在一起会让两类场景都半准不准。

**为什么派发不单独成 skill**：新建 skill 要过四条判据（触发时机不同 · 产物能独立验收 · 签字主体不同 · 内容量撑得起）。派发那一段前三条过、第四条不过，所以它在 `incremental-delivery` 里实现，不另立门户。

## 为什么主干短、细则外置

两个原因，一个是工程上的，一个是认知上的。

**工程上**：skill 的目录（name + description）改了下个模型步就刷新，但**正文是"加载即固化"**——已经加载过的那份留在对话历史里，改文件不会替换它，也不会通知模型"正文变了"。把易变的规则放进 `references/`，下次读取就是新内容，不用新开会话。

**认知上**：实测的两次失败（提前建目录、根本没加载）都是**遵循失败**，不是覆盖不足。这类问题上，加长正文是负收益——规则越多，每条被稀释得越厉害。

## 与现有方法的关系

- L1 ↔ BMAD 的 brief/PRD 层、OpenSpec 的 `explore`（"never writes code"）
- 提问纪律 ↔ grill / ouroboros interview（一次一题、附建议答案、能查的不问）
- 两遍扫描的角色那一遍 ↔ requirement-gap-finder（PM / UX / 后端 / 前端 / QA 各扫一遍）

## 怎么用

skill 的本质是"一个被发现的目录"，所以有三种用法，都没有安装步骤：

1. **拷进宿主的 skills 目录**：把 `skills/` 下三个目录整体复制过去（它们互相引用，单拷一个会让交棒指针落空），目录名与各自 `SKILL.md` 里的 `name` 一致即可
2. **当指令粘**：把 `SKILL.md` 的内容直接粘给任何 agent
3. **当仓库引用**：让 agent 读 `skills/requirement-framing/SKILL.md` 再按流程走

跨 harness 可移植：同一份 `SKILL.md`，凡支持 Agent Skills 的宿主都能读。

## 为什么不做成 plugin

plugin 的价值是**投递与生命周期**（npm 版本、一键启用/停用、marketplace、可执行钩子）；这个 skill 是纯内容，一项都用不上。做成 plugin 反而会把一份可移植的文档锁进宿主专属的 manifest 与 patch 里。

## 版本

`requirement-framing` 0.13.0 · `solution-design` 0.5.0 · `incremental-delivery` 0.3.1 · draft · 2026-10-21

## 许可

MIT
