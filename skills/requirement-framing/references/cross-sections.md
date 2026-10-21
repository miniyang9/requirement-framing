# Cross-sections (17 items)

The core move of L1. No free association — **judge every item**.

## Four states

| State | Meaning | Requirement |
|---|---|---|
| **present** | the user said it, or it is already decided | cite the basis |
| **open** | needs the user, or depends on another decision | must state "depends on what" |
| **not applicable** | this system simply has no such layer | must state why |
| **not doing** | it exists, but was deliberately cut | state why + who cut it |

**"Not applicable" and "not doing" must stay separate.** Not applicable never comes back; not doing does — a later review needs to know which one it was. Merging them deletes a cut requirement permanently.

**Never merge, never skip.** How many items end up "not applicable / not doing" depends on the system: a system where almost every layer exists (game automation, say) may only yield two or three. **The only signal of boilerplate is zero items — not fewer than three.**

## The 17

| # | Layer | Question you must be able to answer | Symptom when missed |
|---|---|---|---|
| 1 | Goals / non-goals | What must be true at the end? What is explicitly out of scope? What counts as "built correctly, need failed"? | Scope creep; a pile nobody asked for |
| 2 | Users / roles / permissions | Who uses it? Do role differences change behavior of the same feature? | A permission model discovered late; every endpoint reworked |
| 3 | Domain model and data lifecycle | What are the core entities? Who creates them, how long are they kept, who deletes? | Wrong structure — the most expensive class of rework |
| 4 | System boundary and external dependencies | Which external services? What happens when they fail, change, or rate-limit? | Integration wired last; protocol or quota does not fit |
| 5 | Architecture and module split | How many layers? Who owns what? How does data cross layers? | Structural drift, cyclic dependencies, no second person can take over |
| 6 | Key flows and state machine | Which main states? Which transitions are legal? And the boundary states? | State scattered across conditionals; boundary states undefined |
| 7 | Non-functional: performance / capacity / concurrency | Order of magnitude for latency, throughput, data volume, concurrency? | Refactor forced at load-test time |
| 8 | Security, privacy, compliance | Any explicit prohibition? What is the worst outcome of failing? | Blocked before launch, and unchangeable |
| 9 | Observability | When something breaks, what tells you it is working? | Broken with no way to look — just guessing |
| 10 | Deployment and environment | Where does it run? How is it started, upgraded, rolled back? | "Works on my machine" |
| 11 | Data migration and compatibility | Existing data or callers? How do versions coexist? (If none — what is the equivalent?) | Launch needs downtime, or every old client breaks |
| 12 | Error handling and degradation | Which errors are retryable, degradable, fatal? | One external timeout takes the whole chain down |
| 13 | Test strategy and acceptance | How do you prove it is right? Can it be re-run? | No regression net; every change breaks something |
| 14 | Release / canary / rollback | Who gets it first? How do you take it back? | Only a full rollback is possible |
| 15 | Cost and resources | Money, compute, licenses, human time — who pays? | The bill or the budget surprises you |
| 16 | Evolution and phase two | Which decisions block the next phase? | Phase one walls off phase two |
| 17 | **Handover / documentation** | Can you — or the next agent — run it from the docs alone, three months from now? | System state depends on one person's memory |

## The two most often missed

**#7 (non-functional)** never appears in a feature description: the user is thinking "what it does", not "how fast, how stable, how large". It has the highest "open" rate.

**#17 (handover)** gets treated as "write a doc at the end". It is not documentation work — **if you cannot write the handover doc, the system state still depends on someone's memory.** Its reader is usually the author three months later, so the form is a runbook (environment prep / parameter meanings / failure-handling table / where the logs are), not a user manual.

## The migration trick for #11

Many projects claim "no existing data" and mark this item not applicable. Ask first: **what is the equivalent here?**

- External clients or callers → it is version compatibility
- Interface recognized via screenshots or selectors → it is "assets invalidated when the UI changes"
- Depends on a third-party data table → it is "source shifts with their version"

**"No existing data" usually renames the migration problem rather than removing it.**

## Second pass: five roles

The first pass scans **layers**, guaranteeing no whole block is missing; the second scans **roles**, guaranteeing no viewpoint is missing. Both must finish.

The layer list answers "what faces does the system have"; the role list answers "who will think this is wrong". The same thing may be caught once in each pass — that is cross-validation, not duplication.

| Role | What they keep pressing on | Typical output |
|---|---|---|
| **Product / PM** | Why build it? For whom? What if we don't? What counts as success? | goals and non-goals, priorities, trade-offs |
| **Design / UX** | What does the user see? What on error? Empty, first-run, loading? | key flows, error/empty/loading states, copy |
| **Backend** | Where does data come from, who mutates it, concurrency and consistency, how does it recover? | data model, boundaries, error handling, idempotency |
| **Frontend / client** | Where does state live? What about offline? Slow network, retries, multi-client consistency? | interaction state, caching, degradation |
| **QA** | How do you prove it right? What is certainly wrong? Can it be replayed? | acceptance cases, regression fixtures, boundaries and negatives |

How to use:

1. For each role list 3–5 questions that role will certainly ask, tagged `present / open / not applicable`
2. Keep only items that **change the implementation**; fold the rest into the 17
3. When two items conflict (UX wants instant feedback, backend wants async confirmation), the conflict itself is a decision point — write it into the decision list

## Self-check

After both passes, answer four questions:

1. How many items were judged "not applicable"? **Zero means you are writing boilerplate.**
2. Does every "open" say "depends on what"? If not, you have not thought it through.
3. Can you cite the user's own words for every "present"? If not, you decided it for them.
4. Did the five roles contribute at least one thing the 17 did not already contain? **If none did, the role pass just restated the layer list.**
