# Contract details (L3)

## Six common contracts (examples, not doctrine)

| Contract | Defined by | Consumed by | Key content |
|---|---|---|---|
| World / domain snapshot | architecture | every module that reads state | state ID, key quantities, available actions, confidence |
| State / vocabulary | architecture | recognition, control | **closed set** + mutual-exclusion rules |
| Action / command primitives | architecture | control, execution | primitive set + timeout semantics |
| Asset / config format | recognition | consumers, hot reload | version, thresholds, organization |
| Event / log | architecture | everything | structured schema |
| Parameter schema | architecture | policy, operations | parameters, defaults, units |

**"Closed set" is the point**: the vocabulary must be a finite list a signature can confirm. Leave it open and parallel units each add to it, until nobody knows the whole set.

**Every contract needs exactly one writer.** It is the only structural defence against "eagerly rewriting each other's interfaces".

Fewer contracts is not laziness: n units negotiating pairwise is **n(n−1)/2** conversations; converging on k shared contracts is **O(n)**, and a new unit joins without renegotiating. **Finding the minimal sufficient shared set is the whole job at this level.**

## Stubs: a contract must be executable, not merely declared

Freezing documents alone **still blocks**. Three conditions, all required:

| Condition | What happens without it |
|---|---|
| ① Narrow interface (few contracts) | negotiation cost returns to quadratic |
| ② **An executable stub** | downstream still waits for the real implementation, just more politely |
| ③ **An independent acceptance fixture per unit** | you cannot tell whether a unit is done until integration |

② and ③ are the substance of "not blocking": **replace "waiting for someone else's output" with "building and accepting against a frozen stub".**

Hence the definition of a deliverable unit — **not "the smallest unit of work", but "the smallest unit that can be independently accepted"**. The two are often far apart.

## Solo equivalents

A solo worker has no "parallel units", but has **context resets** — and every reset is a handoff to a successor with amnesia.

| M-mode concept | S-mode equivalent |
|---|---|
| Contract document | **type definitions in code** (documents rot, types are enforced) |
| Stub | a fixed input fixture |
| Task card | a slice with a completion criterion (granularity = one context) |
| Two-stage review | re-reading in a fresh context: hand the artifact to a clean session and ask only "does it meet the spec, what is wrong" |
| Integration | the per-slice closing ritual |

S mode only needs the **3–4 contracts that are genuinely touched repeatedly** written as types — no need to fill all six.
