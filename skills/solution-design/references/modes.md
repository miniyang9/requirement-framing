# Execution mode: S vs M

The execution mode was settled at L1; here you only consume it — **it decides which column the later levels take**.

## How to decide (and re-check L1)

**Do not judge by size. Judge by whether parallel fronts exist.**

| Test | Leans |
|---|---|
| Only one writer (you, or one agent) | **S** |
| ≥2 fronts that can start at once and be accepted independently | **M** |
| Everyone edits the same executable body | **S** — multiple writers on one pipeline only add coordination cost |
| Someone only reviews / accepts, writes no code | still **S** — review is not a parallel front |

In one line: **parallel fronts ≥ 2, each independently acceptable → M is worth it; otherwise S.**

Large ≠ needs M. A three-day single-threaded pipeline (fetch → rank → render → send) is a textbook S.

⚠️ **Multiple people on the product side ≠ multiple people on the execution side**:

- **Product side**: how many users, do we need roles and permissions → L1 cross-section #2
- **Execution side**: how many writers, how to split → this section

## Level by level (L2–L5)

| Level | S mode | M mode |
|---|---|---|
| L2 architecture | 1–3 views, fitting on one screen | layering, data ownership, failure isolation |
| L3 contracts | **types in code** | document + version + sole writer |
| L4 decisions | five-column log (ID / date / decision / rationale / rejected) | ADR (including rejected options) |
| L5 skeleton | thinnest vertical slice | end-to-end shell, all interfaces wired |

L6 slicing and L7 dispatch belong to C; this skill does not expand them.

## The cost of judging wrong

- **M judged as S**: two writers share one executable body, each invents interfaces, and the mismatch surfaces at merge time
- **S judged as M**: a full multi-writer apparatus (contract documents, version numbers, task cards) for one writer — pure overhead, and it slows the first delivery

**The signal**: if during design you find you "must write a contract document before starting" while you are the only person writing — you judged wrong. Go back to L1 and change the frame; do not force it here.
