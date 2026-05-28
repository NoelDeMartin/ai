# Playwriter

Playwriter controls the user's Chrome browser via Playwright snippets, and runs in an isolated sandbox with persisted session state.

## 1. CLI Usage & Session Management

Always pass `-s <id>` to preserve your `state` between calls. Use single quotes (`'...'`) or heredoc for `-e` to prevent bash expansion of JS code.

- **Create Session:** `vp exec playwriter session new` _(Outputs Session ID)_
- **List Sessions:** `vp exec playwriter session list`
- **Reset Session:** `vp exec playwriter session reset <sessionId>`
- **Execute Code (Single line):** `vp exec playwriter -s 1 -e 'await state.page.goto("https://example.com")'`
- **Execute Code (Multiline):**
    ```bash
    vp exec playwriter -s 1 -e "$(cat <<'EOF'
    const title = await state.page.title();
    console.log(title);
    EOF
    )"
    ```

## 2. Context Variables & Setup

- `state`: Object persisted across calls _within your session_. **Use this to store your page.**
- `context`: Browser context. Pages are shared across _all_ sessions via `context.pages()`.
- `require`: Load Node.js modules (ESM `import` unavailable).

**Crucial First Step (Page Initialization):**
Always get or create your own page on the first call to avoid interfering with other agents.

```javascript
state.page = context.pages().find((p) => p.url() === 'about:blank') ?? (await context.newPage());
await state.page.goto('https://example.com', { waitUntil: 'domcontentloaded' });
```

## 3. The Interaction Loop

Every interaction must follow: **Observe → Act → Observe**. Do not chain multiple actions blindly.

1. **Act:** `await state.page.locator('...').click();`
2. **Wait:** `await waitForPageLoad({ page: state.page, timeout: 5000 });`
3. **Observe:** `console.log(state.page.url()); await snapshot({ page: state.page });`

## 4. Core Utilities (Observe & Inspect)

- **`snapshot({ page: state.page, search?: /regex/, showDiffSinceLastCall?: boolean })`**
    - _Primary inspection tool._ Returns interactive elements with exact Playwright locators.
    - Always use locators _exactly_ as outputted by the snapshot.
    - To scope to a specific area: `snapshot({ locator: state.page.locator('main') })`
- **`screenshotWithAccessibilityLabels({ page: state.page })`**
    - Use for complex visual layouts/grids where spatial context is needed.
- **`getLatestLogs({ page: state.page, search?: /error/i })`**
    - Retrieves browser console logs.
- **`waitForPageLoad({ page: state.page })`**
    - Smart wait that ignores analytics/ads. Use instead of `waitForTimeout`.
- **`getCleanHTML({ locator: state.page.locator('...') })`**
    - Returns stripped HTML for precise data extraction.
- **`getPageMarkdown({ page: state.page })`**
    - Returns article/content stripped of navigation (Readability).

## 5. Strict Rules & Anti-Patterns

- **DO NOT use `page.evaluate()` to read the DOM.** Use `snapshot()`. Reserve `evaluate()` for extracting media URLs, file downloads, or modifying `localStorage`.
- **DO NOT invent CSS selectors.** Use the exact locators provided by `snapshot()`. If multiple match, use `.first()`, `.last()`, or `.nth(N)`.
- **DO NOT blindly paste or upload.** Clipboard paste can fail. Prefer `locator.setInputFiles('path')`.
- **DO NOT chain actions.** Verify every click or type with a new `snapshot()` to ensure the UI actually changed.
- **DO NOT close the browser.** Never call `browser.close()` or `context.close()`.
- **DO NOT force clicks.** If a click times out, an overlay/modal is blocking it. Take a `snapshot()` to find and dismiss the modal. Do not use `{ force: true }` or `dispatchEvent`.

## 6. Advanced Handlers

**Popups & Auth Flow:**
Popups automatically become new tabs. If you click an OAuth login, check `context.pages()` for the new tab.

```javascript
const pages = context.pages();
const loginPage = pages[pages.length - 1];
```

**Network Interception (Scraping SPAs):**

```javascript
state.responses = [];
state.page.on('response', async (res) => {
    if (res.url().includes('/api/')) state.responses.push(await res.json().catch(() => ({})));
});
// Execute action, then read state.responses
```

**Modals & Dialogs:**

```javascript
state.page.on('dialog', async (dialog) => await dialog.accept());
```
