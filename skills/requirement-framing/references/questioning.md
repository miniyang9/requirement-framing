# Asking discipline

Read this when L1 expansion reaches "time to ask the user". Lose any one of the three disciplines and this degrades into a questionnaire.

## 1. Classify before deciding whom to ask

Every open point gets a class first:

| Class | Test | Action |
|---|---|---|
| **Self-checkable fact** | reachable via files / code / git / read-only commands | **look it up; never ask** |
| **Fact the user holds** | absent from the repo, only they know (site conditions, external system behavior, unwritten constraints) | ask; may attach "I'd guess X" |
| **Decision** | trade-off, preference, priority, business judgement | ask — only the user can settle it |

Two symmetric mistakes, unequal cost:

- **Asking the user something you could look up** → the fastest way to lose trust. They instantly know you never opened the repo.
- **Filling in a decision as if it were a fact** → the most expensive line to cross. Three weeks later they find it is not what they wanted.

## 2. One question at a time

Ask one, wait, ask the next. **Never throw four or five at once.**

The reason is information quality, not politeness: give five at once and the user answers the easy ones, silently delegating the rest to "you decide" — those quietly become your assumptions, and nobody remembers they were never confirmed.

⚠️ **This constrains asking, not the signing submission.** At Step 3, presenting the scope plan, the execution mode and the struck items **all at once** is correct — that is a submission, not a question. Cramming three decisions into one question and then calling it a violation confuses the two interactions.

## 3. Quality gate: every question must be answerable in one sentence

And it must carry a **committed recommendation**.

| ❌ Fails | ✅ Passes |
|---|---|
| "We should consider security" | "If the same order is submitted twice, does the second one get blocked in the frontend or made idempotent in the backend? **Recommend: idempotency key from `client_request_id` in the backend, plus disabling the button in the frontend**" |
| "We need to think about performance" | "What P95 for first paint? **Recommend: under 2s, measured on 4G**" |
| "Better add error handling" | "When the third party times out, retry or fail outright? **Recommend: 2 retries with exponential backoff, then degrade to the cached result**" |

Write a recommendation as "recommend A because B". Writing "depends on your needs" is not a recommendation.

## Budget and stopping condition

**Five questions is a budget ceiling, not a stopping condition.** The real stopping condition is: no high-leverage open points remain.

- Asked, and cleared → stop, go to human review
- Budget spent but high-leverage points remain → **say which remain, why you did not ask, and the risk of each**; never pretend coverage
- An answer arrives that makes another question pointless → drop it, do not pad the count

## The fixed five for recurring outputs

For anything that "produces the same kind of conclusion every day" — scheduled push / daily digest / monitor / bot — the five are fixed:

1. **Definition** — what exactly counts as "hot / active / anomalous" (growth? volume? popularity? daily stars?)
2. **Sources and failure alerting** — where from; and when it is unavailable, silence or an explicit error
3. **Delivery channel** — where it goes; what that channel constrains
4. **Timezone and trigger** — which timezone, and will the machine be online then
5. **Idempotency and re-runs** — does running twice in one day send two messages

**The definition always comes first.** Get it vague and the other four, however well built, produce one wrong answer every day, on time.
