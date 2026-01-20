## 🧪 Testing Strategy

vue-dirty-guard focuses on **behavior correctness**, not UI rendering.

### Test Layers

| Layer | Purpose | Tools |
|---|---|---|
| Unit Test | Core logic correctness | Vitest |
| Integration Test | User flow & side effects | Vitest + Vue Test Utils |
| Playground | Manual verification | Vite |

### What We Test

- Dirty state detection
- Router navigation blocking
- Dialog close blocking
- Auto-save success / failure behavior

### What We Do NOT Test

- Element Plus UI rendering
- CSS / animations
- Browser native dialogs

---

### Running Tests

```bash
pnpm test
```

Run a specific integration test:
```bash
pnpm vitest tests/integration/router-guard.test.ts
```


---

## 📘 CONTRIBUTING.md（Testing Rules）

```md
# Contributing Guide

## Testing Rules

### 1. One Integration Test = One User Decision

❌ Bad:
- Modify form → autosave → conflict → router → dialog

✅ Good:
- Dirty → router blocked

---

### 2. Never Assert UI Details

❌ No:
- Dialog visible
- Button color

✅ Yes:
- Dirty state
- Navigation allowed / blocked

---

### 3. Always Mock Human Interaction

Must mock:
- window.confirm
- autoSave API

Never rely on:
- Real dialogs
- Network requests

---

### 4. Reset Global State Between Tests

`dirtyGuard` is a singleton and **must be reset** in `beforeEach`.

---

### 5. Prefer Behavior Over Implementation

Test:
- "What happens"

Not:
- "How it's implemented"
