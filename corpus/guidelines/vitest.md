---
stack: vitest
---

# Vitest Best Practices

## Setup and Teardown

- Reset state in `beforeEach` hooks instead of cleaning up in `afterEach`, so every test starts from a known state even if the previous one failed.
- Put resets that apply to every test in the global testing setup, instead of duplicating them in each test file.
- Don't repeat in a test file what the global setup already does (e.g. creating default instances or clients). If tests need a reference to something created there, expose it from a testing helper.

## File Organization

- Split test files that grow too large into multiple files grouped by topic.
- Name test files `{filename}.test.ts` when there is only one for a module, and `{filename}-{descriptor}.test.ts` when there are several (e.g. `UserService-permissions.test.ts`, `UserService-notifications.test.ts`). The main file can keep the plain name if its tests don't share a clear descriptor.
- Avoid nested `describe()` blocks; split them into separate files instead.
- When flattening nested groups, rename tests that relied on the group name for context (e.g. `handles errors` inside `describe('uploads')` → `handles upload errors`).

## Test File Structure

- Keep everything inside the `describe()` body; only imports should live at the module level.
- Inside `describe()`, declare `const`/`let` variables first, then hooks, then tests.
- Declare helper functions at the end of the `describe()` block, after the tests.

## Helpers, Fixtures, and Stubs

- Extract helpers duplicated across test files (or too similar to each other) into a helpers file in a `testing/` folder next to the module under test (e.g. `src/payments/testing/helpers.ts`). Use the global `testing/` folder for helpers shared across modules.
- Put test fixtures in a `testing/fixtures/` folder next to the module under test.
- Move classes defined at the `describe()` level (fakes, test doubles, subclasses, etc.) into their own files in a `testing/stubs/` folder, following the conventions of existing stubs. Classes that are specific to a single test can stay inside that `it()`.
- If stubs need any global setup (such as registering them), do it once in the global testing setup instead of in each test file.

## What to Test

- Don't write tests whose only purpose is checking that a guard clause throws (e.g. `fails when...`, `requires...`).
- Keep failure tests that do more than that: checking that nothing was written or changed, that external responses are mapped to the right errors, or that errors propagate through non-trivial logic.

## Arrange, Act, Assert

- Separate the phases of each test with `// Arrange`, `// Act`, and `// Assert` comments.
- `// Act` marks the operation under test. Reading results to assert on them belongs in `// Assert`.
- Use `// Act & Assert` when the operation runs inside the assertion (e.g. `expect(() => ...).toThrow()`).
- Use suffixes for tests with multiple phases (e.g. `// Act - Retry` and `// Assert - Retry`).
- Skip these comments in small tests that don't have a clear distinction between phases, where they would be more noise than help.
