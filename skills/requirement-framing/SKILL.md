---
name: requirement-framing
description: "Expand a few-sentence request into a reviewable project frame before any planning, task decomposition, or code. Use when the deliverable will run more than once — a script, service, tool, agent, scheduled push, daily digest, monitor, bot, or a change to an existing codebase — regardless of whether the implementation turns out to be code or a scheduler entry. 用于会重复运行的产物（脚本 / 服务 / 定时推送 / 每日简报 / 监控 / 机器人）的需求展开与立项梳理，即使用户没有说「写代码」。Scope: L1 only — ask, expand, sign. A signed frame is the artifact. Architecture, contracts and slicing belong downstream. Not for a one-off answer, plan, research report or article; not for a single obvious edit that one sentence already specifies."
license: MIT
metadata:
  version: "0.11.0"
  status: draft
---

# Requirement Framing

Turn a seed into a reviewable frame — **before anyone starts decomposing tasks**.

**This skill covers L1 only**: from one sentence to a signed frame. Architecture, contracts, slicing and dispatch are out of scope; see "Step 5: handoff".

## Three creeds

1. **The input is a seed, not a spec.** Those few sentences say what the thing is and roughly its shape — not something testable. The default move is to expand it, not to complete it.
2. **Expand first, ask second.** Walk the checklist to surface what you know and the user did not say; then ask only what you cannot judge. Asking first makes the user do your homework.
3. **The expansion must not take the form of a task list.** Anything shaped like a list will slide all the way down into tasks.

## HARD GATE

> **If `Status` is not `signed`, creating any executable artifact or project skeleton is forbidden.**

**The status field is the only authority** — not "I already asked", not "all three axes are chosen". When status and conditions disagree, trust the status.

**Covered**: code / scaffolding / tests / sample configs / deploy scripts; creating project directories; installing dependencies / initializing a repo / lockfiles.

**Not covered**: the frame file `docs/frame/<slug>.md` itself — it carries the questions and the signature and **must be written first**.

**Only exception**: read-only probing, and one-off scripts under `.tmp/`. **A probe must yield a conclusion, not code.**

No universal excuse holds:

> "This part is unrelated to the open questions, so I'll do it first."

### Signature states

The top of the frame file must carry `Status:`.

| Status | Allowed actions |
|---|---|
| **open** (待答) | read-only, ask questions |
| **pending** (待签) | read-only; may write back into this document |
| **signed** (已签) | may start work (within this skill: may deliver) |

**Seven conditions — all required:**

1. **The document exists ≠ it is signed** — a leftover `pending` from a previous round is not a signature
2. **A user question ≠ user approval** — they are asking you something, not granting work permission
3. **No `Execution mode` in the document = cannot sign**
4. **A signature authorizes only the scope written in the frame** — new requirements or wider scope are new unknowns: roll back first, discuss after
5. **Only a human can sign** — an agent must never sign on their behalf; treating another agent's acknowledgement as user approval is forgery
6. **Classify new unknowns first**: a *user decision* → reopen the question and roll back to `pending`; a *verifiable fact* (a probe can answer it) → record it under §0, and **do not block the signature**
7. **Changing a recommended answer requires rewriting everything** — rewrite every affected section before changing the status; editing only the decision row leaves two sets of truth

## First reply after loading

```
Size tier:  T0 / T1 / T2
Open:       Q1 … / Q2 … (never write "none")
Commitment: I will create no files until these are answered.
```

## Step 0: domain gate

This skill serves **artifacts that run repeatedly**. Test: will it execute more than once, or is it a one-off answer?

| Request | Verdict |
|---|---|
| Script / service / tool / agent / change to an existing codebase | yes |
| Scheduled push / daily digest / monitor / bot | **yes** — even if the implementation is one scheduler entry |
| One-off script, thrown away after it runs; one-off answer, plan, research, report, article, event plan | **degraded** — no framing |

Reason: repeated execution means any vague definition **produces a wrong answer every day**, not once. Ignore the implementation form (code / scheduler / spreadsheet / manual process); look only at whether it runs again.

**When unsure, ask one thing**: "Is the deliverable something that runs, or a document/proposal?"

**Degraded ≠ dismissive**: no frame, no size tier, no gate — but still clarify and advise, and say plainly "this does not run repeatedly, so I am not switching on framing". Let the user see that you **chose** not to.

## Step 1: size tier

**One criterion: how many independently verifiable units does this delivery span?**

| Input | Tier | Levels |
|---|---|---|
| Single-point change, 1 unit, **no new files, no new dependencies, no contract change** | **T0** | Do it directly, no process |
| 1 independently verifiable unit, < 1 day | **T1** | **Write a one-page frame (five questions) + sign it**, then work |
| Multiple independently verifiable units | **T2** | Run all of L1 (steps 0–5) |
| Already decomposing tasks, or asking for dispatch | **T2** | Roll back to L1 first |

"Engineering" or "platform" is not a criterion — it is a symptom of spanning many units. Narrow scope (single-point change) is a result the user already produced for you, not a second criterion.

**Print the verdict as an explicit line**, or you will drift to T2 by default.

T1's five questions: size / acceptance / non-goals / **biggest ambiguity** / what if it fails. T1 does not walk the 17 cross-sections — a deliberate reduction, not an omission.

**T1 reduces the expansion, not the authorization.** It still produces `docs/frame/<slug>.md` and still needs `Status: signed`; only the content shrinks from six parts to five questions, with no §0.

**Never downgrade yourself.** Judging a request to be T0/T1 is the model's move, and it decides whether a signature happens — so it must be **written into the frame header and confirmed by the signature**. A downgrade without a frame is a line crossed.

### Three axes, never mixed

One requirement has three things to settle. They are orthogonal and **settled by different parties**:

| Axis | Fixed term | Answers | Decided by |
|---|---|---|---|
| Size | **Size tier** T0 / T1 / T2 | How many independently verifiable units | Model judges, **written into the frame and confirmed with the signature** (T0 excepted) |
| Scope | **Scope plan** minimal / standard / platform | How much; what is given up, what is locked | **User chooses** |
| Execution | **Execution mode** S / M | **Parallel fronts ≥ 2 and each independently verifiable → M; otherwise S** (big ≠ M) | Model proposes, **user confirms** |

**No axis implies another**: platform scope can be S (one person, longer); a minimal build can be M (two people, front and back). "Chose platform" does not mean M; "chose minimal" does not mean no slicing.

Use only these three fixed terms in full. Any vague word like "scale" or "level" gets replaced by one of them.

## Step 2: L1 expansion (six parts)

Produce `docs/frame/<slug>.md`, starting with **four lines**:

```
Status:          open
Size tier:       T0 · T1 · T2
Scope plan:      minimal / standard / platform (to be chosen)
Execution mode:  S or M (to be confirmed)
```

Then a `## 0. Load-bearing facts` section. **No task lists, file paths, implementation steps or code this round.**

**These four lines are literally checkable fields**: `Scope plan` must occupy its own line, or downstream cannot verify "all three axes present"; a value still carrying "(to be confirmed)" does not count as settled.

1. **Size ruling** — tier + basis + the cost of being one tier wrong
2. **Implied work packages** — must do / maybe / recommend not; tag each `[inferred]` or `[you said]`. Write **capabilities and responsibilities** ("frame capture and coordinate normalization"), never **steps** ("write a `grab()` function") — steps are a task list and are forbidden this round
3. **Two passes** — layers first (17 items), then roles (5), per `references/cross-sections.md`; each item gets present / open (depends on what) / not applicable (why) / **not doing (reason + who cut it)**
4. **Decision points** — options / recommendation / reversibility / cost of deciding late / **attached constraints (consequences)**, sorted by cost of deciding late. That cost must carry a **type**: `rework` / `irreversible` / `opportunity cost` — never mixed in one ranking. **Decision points = the question pool; asking = taking the top five by impact × uncertainty**
5. **Three scope plans** — minimal / standard / platform, each with **what it gives up and what it locks**
6. **Failure rehearsal** — three ways it dies + earliest signal + response

**Read `references/questioning.md` before asking**: triage decides who to ask, one question at a time, every question carries a committed recommendation. Five questions maximum.

### Consequences get missed more easily than decisions

What the user approved is the **decision**, not its **consequences**. Example: decision = "use WeChat"; consequence = "the service-account template message cannot hold a 1.5 KB body, so the body must live behind a link". The user never approved that, yet it constrains everything downstream — miss it and you design as if WeChat carries long text.

**A consequence is not a requirement; it is what the requirement implies.** Write it on the decision row **and** as one short anchored line under `## 0. Load-bearing facts` — the first thing downstream reads.

Writing "premise → consequence" as one sentence is allowed (readability beats formal purity): "once we go black-box visual, the system has no widget identity → therefore every click must be preceded by a confidence-scored target decision". The premise is the first half; the constraint is the second. **Judge the second half: it must be an executable constraint, not an adjective.**

## Step 3: human review and contraction

The user does **five things**: strike inapplicable items, correct `[inferred]`, answer questions, **choose the scope plan**, **confirm the execution mode**.

**Signing is one submission, not three rounds of questions.** All five can be presented at once — "one question at a time" constrains **asking**, not **submitting**. Cramming three decisions into one question and then calling it a violation confuses the two interactions.

Per Step 1's table, the user settles **scope plan** and **execution mode** here; the size tier can be overturned but need not be re-chosen.

**Restate before contracting**: compress the goal into one sentence and ask "would a stranger reading only this line reach the same result?". Cheaper than a signature and harder to fake; if it fails, go back to Step 2.

After the user replies: write back the document + a signature block, then change the status.

```
Signed by: <human name or role>    Date: <YYYY-MM-DD>    Version: <n>
```

**The signature block is a hard field.** Without it, downstream cannot verify who signed which version when.

**Any edit after signing invalidates the signature** — including "just going back to Step 2 to add a line". The first step of editing a signed frame is **reverting the status to `pending`**, then re-signing. On seeing `pending`, downstream must stop — not reason that "the content is all there".

**If status is not `signed`, do not enter Step 4.**

## Step 4: check the artifact

After signing, do one thing: **confirm §0 of the frame is complete**. It is the only place downstream reads first.

Five checks:

- [ ] Every load-bearing fact is a **consequence**, not a decision ("channel = WeChat" is a decision; "the template message cannot hold the body" is a fact)
- [ ] Every one is anchored (`§4 D4`), not from memory
- [ ] Every "explicitly not doing" item carries a reason, so downstream will not add it back
- [ ] Every open item is either cleared or marked "defaulting to the recommendation, overturnable"
- [ ] **Cross-section consistency**: does an item in §2 "maybe" contradict a "given up" in some §5 plan? Does a decision revised in §4 still support its §0 anchor? Have the user's answers been written back into §1–§6?

If a check fails, go back to Step 2 — do not carry it downstream.

## Step 5: handoff

| Level | Who | What this skill provides |
|---|---|---|
| **L1 framing** | **this skill** | everything |
| L2 architecture · L3 contracts · L4 decisions | `solution-design` | **the signed frame** (read §0 first) |
| L5 skeleton | criteria in `solution-design`, execution in `incremental-delivery` | the same frame |
| L6 slicing / L7 execution | `incremental-delivery` (S mode only; M mode unimplemented) | acceptance criteria and execution mode from the frame |

**Handoff is not the end.** If downstream reports that the frame is missing something, go back to Step 2 — do not invent it in place.

**Cross-session needs no extra artifact**: re-reading the signed frame is the complete handoff. What must travel is **a decidable state** (`Status: signed`) and **a locatable input** (the slug) — not a copy of the content.

Both downstream skills exist. **Cross-skill references rot when the upstream changes** — if you rename or rescope a downstream skill, come back and sync this table.

## Artifact

```
docs/frame/<slug>.md    # the only artifact: four header lines + §0 + the six parts
```

Only this. `docs/arch/` and everything after belongs downstream.

**Examples must never live under `docs/frame/`** — the same path lets a later round mistake an example for a signed spec.

---

Detail index: `questioning.md` (asking discipline) · `cross-sections.md` (two passes) · `red-flags.md` (11 red flags)
