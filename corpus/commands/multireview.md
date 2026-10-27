---
description: Run multiple review iterations.
---

Invoke a subagent and send it the instructions from the /review slash-command in a new context to review the changes. Then, address the points in the review that you think have some merit, and do another review until nothing is left to address. Do this up to 5 times. Don't feel the need to address all the "nice-to-haves" from the review, only the ones you think actually improve the implementation.

Also tell the subagent not to run any of the expensive checks (E2E tests, type checking, the test suite, etc.). We'll assume that when this multireview is launched, all the tests and lints are already passing; so let's avoid duplicating work in every new subagent.

## Additional instructions

<arguments />
