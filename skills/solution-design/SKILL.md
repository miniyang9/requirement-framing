---
name: solution-design
description: "Design the shape of a signed-off requirement: architecture, contracts, decision records, and the cheapest skeleton that could disprove the design. Use when a `docs/frame/<slug>.md` is signed (Status: signed) and the user asks how to structure it — layering, module boundaries, interfaces, data ownership, tech choice, or what to build first. 当需求已签字、需要定架构 / 分层 / 模块边界 / 接口契约 / 技术选型 / 第一个垂直切片时使用。Requires a signed frame; without one, go back to requirement-framing. Not for writing feature code and not for task dispatch."
license: MIT
metadata:
  version: "0.3.0"
  status: draft
---

# Solution Design (L2–L5)

Upstream is `requirement-framing` (A); the input is **a signed frame**.
Downstream is execution (C), which receives the architecture, the contracts and the decision records.
**This skill writes no feature code and cuts no task cards.**

## Gate: find the signed frame, then inspect it

1. Find `docs/frame/*.md`, read the `Status:` line
2. More than one signed → **ask the user which one**; never guess by modification time
3. Read `## 0. Load-bearing facts` first, then the whole file

**Only `signed` gets in.** `open` / `pending` → send it back to A with one line; never fill in requirements on the spot.

### Frame inspection (five checks, any miss sends it back)

| # | Check | If it fails |
|---|---|---|
| 1 | `Status: signed` | back to A for signature |
| 2 | `## 0. Load-bearing facts` has at least one entry, each anchored | back to A to complete §0 |
| 3 | All four header lines present: `Status` / `Size tier` / `Scope plan` / `Execution mode`, **and none still says "(to be confirmed)"** | back to A |
| 4 | Every "not doing" item carries a reason | back to A for the reason |
| 5 | **No unclosed `UPSTREAM-xx`** | resolve it; never design on top of it |

**A hand-written frame must pass the same five checks.** "Looks complete" is not a pass condition — A's Step 4 self-check is A's promise, not your acceptance; both sides do it once.

### Upstream dissent: what to do when A judged wrong

At L2 you may find the upstream ruling is wrong (two writers in practice, so the execution mode should be M).

- **Never edit the frame** (it is A's artifact, signed by a different party)
- Record `UPSTREAM-01` in `03-decisions.md`: which ruling, the evidence, the suggested correction
- **Tell the user explicitly on delivery**: "this one needs re-signing in `requirement-framing`"
- If the dissent would change 01's structure (boundaries, contract count, order) → **resolve it before continuing**; never design on top of it

**With no frame**: do not "discuss the architecture first". Even if the user asks "how should this be layered", send it back to L1 — otherwise you are designing an architecture for a verbal request.

**Exception**: if the user says this is conceptual consultation only, never to be recorded, answer as consultation — no process, no `docs/arch/`.

## Reuse the three axes; never redefine them

Size tier, scope plan and execution mode were settled at L1. Here you only **consume** them:

- **Execution mode** decides which column the later levels take (S: 1–3 views / code types; M: layered documents / contract versions)
- **Size tier** decides how much to run (T1 usually runs only part of this skill)
- Want to change an axis → go back to A and change the frame; never adjust it quietly here

## Step 1: L2 architecture — five questions

Each answer states **which option you chose and why**. No tutorials.

| # | Question | What breaks if it is unsettled |
|---|---|---|
| 1 | **What is the boundary cut along?** Rate of change / data ownership / team — pick one primary criterion | You cut by file type, and every requirement then spans every module |
| 2 | **Is there exactly one shape of cross-layer data?** (world snapshot / event / model) | Each layer invents its own; the seam turns out to be a translation layer |
| 3 | **At which layer is failure isolated?** How far can one external timeout pierce | One third-party hiccup stalls the whole chain |
| 4 | **What are the contracts?** Anything two or more units read and write | No single writer; anyone edits it and nobody notices |
| 5 | **How thin can the skeleton be?** Thin enough only to falsify the contracts | The skeleton swells into half a product and cannot be changed |

Output: **1–3 diagrams** plus one sentence per question.

### One diagram is not enough — but more is not better either

Architecture is not an object; it is a set of views. No single diagram explains modules, timing and state at once. But "draw more" is not the answer either: **every view has to be maintained**.

The only selection criterion: **can this view answer the kind of question that is most likely to go wrong this time?**

| View | Required when | archify type |
|---|---|---|
| **Modules and data flow** | always | `architecture` |
| **State machine** | ≥3 explicit modes with conditional transitions (village/battle/result; open/pending/signed) | `lifecycle` |
| **Sequence** | ≥3 components interacting asynchronously, or timeout/retry semantics | `sequence` |
| **Deployment topology** | not a single process, or multiple machines/clients | `architecture` (different layout) |

**Cap: 1–3.** More diagrams does not mean you thought it through; it means you have not decided what to look at. One JSON source per view, one shared renderer.

**Counter-example**: a system with one serial pipeline whose failure mode is always "stuck" (a daily digest) needs only a data-flow diagram — adding a state machine duplicates it. Conversely, game automation ("many modes + conditional transitions + clicks that time out") **needs both the state machine and the sequence diagram**; a data-flow diagram alone omits exactly the part most likely to break.

**Every diagram needs a rebuildable path = source + renderer + command.**

- **Source**: `docs/arch/diagrams/<slug>/<view>.json` (one per view, diffable)
- **Renderer**: `docs/arch/diagrams/<slug>/render.*` or an explicit command — **never under `.tmp/`** (that is for one-off probes)
- **Outputs**: `<view>.png` embedded in 01, `<view>.html` for interaction

Miss any of the three and you do not have a source. A hand-drawn diagram equals no diagram — it cannot be rebuilt, it will contradict the prose, and nobody knows which one is right.

## Step 2: L3 contracts

One criterion:

> **Anything two or more units read and write together must be a contract; everything else must not be.**

**Separate two words first**: a *contract* is the agreement; a *contract document* is the file recording it. **S mode still defines contracts** — they simply live in code. It is not "no definition needed".

Three hard rules:

- **One writer per contract**, everyone else read-only — the only structural defence against "eagerly rewriting each other's interfaces"
- **S mode: write them as code types** (the compiler guards you); **M mode: documents plus version numbers** (nobody guards you)
- **Freeze timing**: before the first consumer starts work, not "after the design is complete"

**02 is written as an index from day one — no field definitions.** The file must start with a freeze line:

```
Frozen: <YYYY-MM-DD>    Frozen by: <role>
```

Without that line, the execution side cannot tell whether it may start. Then one row per contract, where the shape column is already a pointer:

| Contract | Shape | Sole writer | Why frozen |
|---|---|---|---|
| `Repo` | pending → `core/models.py` | Fetcher (the two implementations are exclusive) | pipeline entry shape |

On landing you change one cell: `pending` → `landed → core/models.py:31`.

**Who writes the shape**: the implementer, when it first lands, writes the type into code — **not B, and not the contract owner**. But it must satisfy that row's constraints (sole writer, closed set, invariants); **adding an implementation-internal field is not a contract change**.

**There is no "one day we rewrite 02 as pointers" action** — that task is always forgotten, and nobody is responsible for detecting the moment of landing. Who does it: the execution side, at each slice's close (C's job; only it knows where the code landed).

What code cannot express — **sole writer, invariants, freezing rationale, error-code mapping** — stays in 02 permanently.

Six common contracts, stub requirements, solo equivalents: read `references/contracts.md`.

## Step 3: L4 decision records

One row per decision, **five columns**: `ID / Date / Decision / Rationale / What was rejected`.

**The ID is mandatory**: without it, "append only, never delete" cannot be executed — you cannot write "supersedes ADR-07".

**"What was rejected" is not optional** — it stops you, six weeks later, from re-proposing the option you already killed.

No stories, no background prose.

## Step 4: L5 skeleton criterion

> **The skeleton is the acceptance test for L2/L3, not the start of implementation.** Its output is the judgement "does this architecture hold", not features.

Whether it stands as its own level depends on **how expensive or irreversible the first end-to-end verification point is**:

| Cost of being wrong | L5 shape |
|---|---|
| Cheap (re-runnable, reversible) | **Merged**: L5 coincides with the first slice, no separate level |
| Moderate (real side effects, survivable) | **Normal**: run the thinnest path in the real environment |
| Expensive or irreversible (money, production data, external commitments) | **Moved earlier, different environment**: run in a simulation/sandbox first, and make it a hard gate before touching the real environment |

Consequence: **L5's position is not fixed.** The more irreversible the outcome, the earlier it moves — for a trading system, the backtest skeleton sits before the contracts are even drafted.

**01 must reserve a section for L5 and one for acceptance**, or the execution side has nothing to read and "verify" degrades into self-certification:

```
## Skeleton (L5)
S1 … S4: one line each on what is verified + a pass threshold (number or boolean)

## Acceptance
What evidence each of the five questions maps to (command / fixture / log field)
```

**Without those two sections, 01 is not complete.**

## Four hard constraints

- **Sole writer**: one writer per contract, everyone else read-only
- **The skeleton is an acceptance test**: if it does not pass, go back to L2/L3; do not proceed
- **Every diagram has a rebuild path**: source + renderer + command; miss one and it is not an output
- **A dependency chain means a missing contract**: if a later step must wait for an earlier one's real output, that output should have been a frozen artifact, not a runtime dependency

## Handoff

| Level | Who | Deliverable |
|---|---|---|
| L2–L5 | **this skill** | architecture page + contracts + decision records |
| Execution (select / build / verify / close) | `incremental-delivery` (C) | a four-line ledger entry per slice |
| Multi-writer dispatch | C's M mode (**unimplemented**) | task cards |

**This skill produces no task cards.** When the user says "break it into tasks", that is the signal to enter C.

## Design-side red flags

| What you are thinking | Reality |
|---|---|
| "I'll add the architecture once the code is written" | Architecture is not refinement; it is the precondition for parallelism |
| "This is just a few independent tasks" | Then you can draw a star-shaped DAG; if you cannot, a contract is missing |
| "Let me scaffold the code first" | The skeleton's output is a judgement, not features |

## Change propagation

Change one thing and you must change the others, or the three documents contradict each other.

| What changed | Must also change | Recorded by |
|---|---|---|
| frame §0 load-bearing facts | the five answers in 01 may be void | **back to A for re-signing**, never edited in B |
| 01's boundaries / data shapes | contracts added/removed in 02; diagrams re-rendered (edit JSON, re-render) | B |
| a contract field in 02 | one row in 03; downstream acceptance fixtures | B |
| a decision in 03 is overturned | **never delete the old row**; add a new one saying why | B |
| a design gap found during execution | back to B to patch 01/02 — **not to A, and never edited in place** | C → B |
| **the user adds a requirement during L2/L3** | back to A, edit the frame **and re-sign**; never widen scope in B | A |

Two iron rules:

- **Decisions append, never delete.** Delete them and nobody knows what was once rejected; six weeks later it gets re-proposed.
- **Diagram changes go through JSON only.** PNG / HTML are outputs; hand-editing them manufactures a second truth.

### Unfreezing procedure

Freezing is not a one-way door, but unfreezing has a bill:

1. Record in `03`: who asked, which contract, why
2. Edit that row in `02` (keep the old value, add "unfrozen on X")
3. Notify the execution side: **any slice already accepted that depends on this contract must be re-verified**

An unfreeze without step 3 quietly detaches accepted code from its contract.

## Three checks before delivery

The three documents are the easiest place to contradict yourself. Check before handing over:

| Check | A mismatch means |
|---|---|
| 01's contract list vs 02's sole-writer table | a contract with no writer, or two writers |
| 02's fields / closed sets vs the relevant decisions in 03 | a decision says it changed, the document did not follow |
| 03's rejected options vs 01's "not doing" list | a rejected option reappeared in the design |

**Any mismatch: fix it before delivery.** Three mutually contradictory documents are worse than one — downstream does not know what to believe.

## Artifacts

```
docs/arch/01-architecture.md            # the five answers + embedded diagrams
docs/arch/02-contracts.md               # contract index: shape (pointers once landed) + agreements (permanent)
docs/arch/03-decisions.md               # one row each, with ID and rejected options
docs/arch/diagrams/<slug>/<view>.json   # one source per view (diffable)
docs/arch/diagrams/<slug>/render.*      # renderer (never under .tmp)
docs/arch/diagrams/<slug>/<view>.png    # output, embedded in 01
docs/arch/diagrams/<slug>/<view>.html   # output, interactive
```

All three must be independently readable — they are C's input.
