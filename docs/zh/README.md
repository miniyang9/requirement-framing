# 中文快照（仅供人阅读）

**权威版本是英文**：`skills/<name>/SKILL.md` 及其 `references/`。

- 机器读英文，人读这里。
- 本目录**不安装**——不在 `~/.dsh/skills/` 里，agent 不会把它当 skill 加载。
- 同步规则：英文改一次，这里跟着改一次；**冲突时以英文为准**，并回来修这里。

## 为什么分成两份

| | 英文（`skills/`） | 中文（`docs/zh/`） |
|---|---|---|
| 读者 | agent | 人 |
| 是否安装 | 是 | 否 |
| 是否可改 | **唯一改动入口** | 跟随同步，不作为源 |

中文版存在的理由是**人能审阅**：规则的措辞、判据的取舍、边界的划法，需要人来判断。让它同时当"第二份源"，就是我们反复踩过的双份漂移。

## 现状（2026-10-21）

| 文件 | 对应英文 | 备注 |
|---|---|---|
| `requirement-framing/SKILL.zh.md` | 0.11.0 | 已按减重后的英文重写 |
| `requirement-framing/questioning.zh.md` | 0.11.0 | 从 git 取原文 |
| `requirement-framing/cross-sections.zh.md` | 0.11.0 | 从 git 取原文 |
| `requirement-framing/red-flags.zh.md` | 0.11.0 | 删了「交接块」那条（该机制已废） |
| `solution-design/SKILL.zh.md` | 0.3.0 | 已同步（四条→五条自检、一页图→1–3 视图） |
| `solution-design/contracts.zh.md` | 0.3.0 | 从 git 取原文 |
| `solution-design/modes.zh.md` | 0.3.0 | 从 git 取原文（L2 一行同步为 1–3 视图） |
| `incremental-delivery/SKILL.zh.md` | 0.2.0 | 已同步（四行台账→五行） |

## 体积说明

英文字节比中文大约 11%（语言特性），**这不算膨胀**。本轮真正的收益在结构：删掉了三处重复内容（详见 `.tmp/skill-edit-log.md` 的「更正」一节，那里有实测数字）。
