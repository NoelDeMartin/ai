---
description: Review changes in the staging area.
---

The user has staged changes in the current repository. Review the staged diff and confirm whether it is ready to commit.

This is a **review-only** task: analyze the staged changes and report your findings. Never modify the codebase, suggest fixes in your response instead.

## What to review

Focus on the **staged** changes (what will be committed) and check for:

- **Correctness & safety**: likely bugs, edge cases, error handling, backwards compatibility, and surprising behavior changes.
- **Scope & cohesion**: the commit is focused on a single feature or bug fix; avoid overly complicated or unrelated changes.
- **Project conventions**: naming, structure, patterns, style, and existing abstractions are followed.
- **Tests**: appropriate tests exist or were updated; they match the behavior change. If tests are missing, recommend concrete cases.
- **Clean code**: better naming, smaller functions, clearer conditionals, YAGNI (remove dead code), etc.

If there aren't any changes in the staging area, simply tell the user and don't review anything.

## Output format

- **Verdict**: “Ready to commit” or “Not ready”.
- **What changed (1–3 bullets)**: only the most important deltas.
- **Must-fix issues**: only real blockers (bugs, security, broken tests, wrong scope).
- **Nice-to-have improvements**: small, high-signal suggestions only.
- **Suggested tests**: specific test cases (inputs/outputs/behavior), not generic advice.

If everything looks good, keep the response short: state “Ready to commit” and add at most 1–2 optional improvements (or none).

# Additional instructions

{{args}}
