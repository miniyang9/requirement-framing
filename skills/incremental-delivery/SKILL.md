---
name: incremental-delivery
description: "Turn signed design documents into verified increments: pick the next slice, build it, verify it against the design, and record what happened. Use when `docs/arch/` already has 01-architecture, 02-contracts and 03-decisions for a signed requirement, and the user wants to start building, resume building, or asks what to do next. 当设计三件套已完成、要开始或继续按片实现时使用。Solo (single writer) is implemented; multi-writer dispatch is not. 缺设计三件套就退回 solution-design。"
license: MIT
metadata:
  version: "0.2.0"
  status: draft
---

# Incremental Delivery

Upstream is `solution-design` (B); the input is 01 / 02 / 03.
This skill turns the design into **a sequence of independently acceptable increments**, recording one ledger entry per slice finished.

**It is not a dispatch skill.** Dispatch is only its multi-writer half; this version implements solo mode only.

## Gate: three documents, frozen, and the mode re-checked

1. `docs/arch/` holds 01 / 02 / 03
2. 02 starts with a freeze line: `Frozen: <date>    Frozen by: <role>`
3. **Re-check the execution mode**: read `Execution mode` **from the frame header** (it has exactly one source; do not read it from 01), then look at how many writers actually exist.

| Reality | The frame says | Action |
|---|---|---|
| one writer | S | continue |
| multiple writers | M | unsupported in this version → **stop**, say C's M mode is unimplemented |
| multiple writers | S | **stop** — back to `requirement-framing`, fix the frame, then rerun B |
| one writer | M | **stop** — same as above; never downgrade on your own |

**Miss any one and go back to B; never start writing in place.** Starting with an incomplete design hands the gap to your future self.

## The core loop (five steps)

```
select → build → verify → close → convergence check
```

**One slice per round.** Only after finishing one may you look at the next.

### 1 Select

The criterion is **"independently acceptable"**, not "smallest amount of work".

- One slice = **as much as one context can hold**; if it does not fit, cut again
- Priority: whatever can falsify the design first (the skeleton), then completion work
- If 01 says L5 merges into the first slice, **the first slice is that skeleton**

Never pick two slices to "do together while you are at it".

### 2 Build

You write it yourself. Three rules:

- **Never change a contract** — the sole writer, closed sets and invariants in 02. **Allowed**: writing the implementation, adding implementation-internal fields, updating `pending` to `landed → file:line`
- A contract is insufficient → **stop**, note it, go back to B; never widen it in place
- Never "helpfully" add something on 01's "not doing" list

### 3 Verify

Run the acceptance criteria written in 01 / 02 — **not "it looks right"**.

- If there is a fixture, run the fixture
- If there is a command, run the command
- For a skeleton slice: what is verified is "does the design hold", not "are the features complete"

### 4 Close

**Append** to `docs/build/<slug>.md`:

```
## <slice> · <date>
done:
not done:
next:
evidence: <command / fixture / log field run, one line of result>
rework: none / <one of seven classes + one sentence>
```

The seven classes: understanding / assumption / untestable acceptance / slicing lost a constraint / context lost / implementation drifted / **crossed a line (started before signature)**.

**The rework reason is a hard field.** Without it, three months from now you will not know which hop your deviations usually happen at.

**Which contract did this slice land?** If any → edit that row in `02-contracts.md` from `pending` to `landed → file:line`. This is the only moment you touch a design document; do not let it accumulate — accumulated, it is always forgotten.

S-mode review lives here: hand the artifact plus the verification result to a **clean session** and ask only "does it meet the spec? what is wrong?"

**The order is review → ledger, never the reverse.** Reversed, the ledger records "what I did" rather than "what someone verified". The review's conclusion and evidence go into that `evidence:` line.

### 5 Convergence check

Tick off 01's five questions one by one:

- Does every question have corresponding code plus acceptance evidence?
- Does every contract in 02 have a sole writer, and is that true in the code?
- **Has every `pending` in 02 become `landed → file:line`?** (a stale pointer means the document is lying)
- Is 01's "not doing" list violated anywhere?

A gap → back to B to patch the design (not to A, and never edited in place).

All four pass → write one section at the end of the ledger and **declare delivery**:

```
## Delivered · <date>
scope: <the frame's scope plan>
not done: <explicit list, or  none>
```

**Without that section there is no "done" state** — no participant knows where to stop.

## S / M differences

| Step | S mode (implemented) | M mode (not implemented) |
|---|---|---|
| select | one slice per context | one task card per slice |
| build | you write it | dispatch: task card + sole writer + no contract changes |
| verify | run acceptance | run acceptance + contract-conformance check |
| review | re-read in a clean session | two stages: spec conformance → code quality |
| close | five-line ledger | five lines + **merge only one at a time** |
| convergence | tick 01 item by item | star DAG all green + end-to-end shell |

**M mode is not a stricter S.** What it adds is the apparatus that keeps multiple writers from colliding (task cards, conformance checks, merge rhythm). For a single writer that is pure overhead.

## Iron rules

- **During execution, never change an agreement — only update a pointer.** Sole writer / closed sets / invariants: hands off. `pending → landed`: update every slice. A gap goes back to B; a changed requirement goes back to A.
- **One slice at a time.** Two in parallel means neither was verified.
- **Always write the rework reason.** If there was no rework, write "none".

## Artifact

```
docs/build/<slug>.md    # append-only ledger, one section per slice
```

Code and tests land wherever 01's "on-disk shape" says — this skill defines no directory layout of its own.

## Red flags

| What you are thinking | Reality |
|---|---|
| "The contract is one field short, I'll just add it" | That is a design gap; go back to B |
| "Doing these two slices together is faster" | Two in parallel means neither was verified |
| "It runs, so it passed acceptance" | Running ≠ meeting the spec; only ticking 01 item by item counts |
| "I'll fill in the rework reason later" | Anything filled in later is not a reason, it is rationalization |
