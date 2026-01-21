# vue-dirty-guard

> 🛡️ A unified dirty-state guard solution for Vue 3 applications.
>
> Prevent users from accidentally losing unsaved changes across **forms, dialogs, routes, and page unloads**.

---

## ✨ Features

- 🔐 **Central Dirty Registry** – manage all dirty sources in one place
- 🧩 **Composable-first API** – designed for Vue 3 Composition API
- 🧭 **Router Guard Integration** – block navigation when unsaved changes exist
- 🪟 **Dialog Guard Support** – protect modal/dialog close actions
- 🌐 **BeforeUnload Protection** – browser-level leave confirmation
- 💾 **Auto Save Helper** – debounce-based auto-save with error state
- 🧪 **Well Tested** – unit + integration tests included
- 🏗️ **Framework Friendly** – Element Plus integration out of the box

---

## 📦 Packages

This repository is a **pnpm monorepo**:

```
.
├── packages/
│   └── vue-dirty-guard   # Core SDK (published to npm)
├── playground/           # Demo app (Vue 3 + Element Plus)
```

---

## 🚀 Installation

```bash
pnpm add vue-dirty-guard
```

or

```bash
npm install vue-dirty-guard
```

---

## 🧠 Basic Concept

`vue-dirty-guard` is built around three ideas:

1. **DirtyAdapter** – describes _how to know something is dirty_
2. **DirtyGuard** – central registry that manages all adapters
3. **Integrations** – router, dialog, browser, UI frameworks

Once registered, **any dirty state can block leaving the current context**.

---

## ✍️ Quick Example

### 1️⃣ Track a form

```ts
import { reactive } from "vue";
import { useDirtyForm, dirtyGuard } from "vue-dirty-guard";

const form = reactive({ name: "" });
const { isDirty, reset } = useDirtyForm(form);

dirtyGuard.register({
  id: "customer-form",
  isDirty: () => isDirty.value,
  reset,
});
```

---

### 2️⃣ Protect route navigation

```ts
import { setupDirtyRouterGuard } from "vue-dirty-guard";

setupDirtyRouterGuard(router);
```

---

### 3️⃣ Auto save

```ts
import { useAutoSave } from "vue-dirty-guard";

useAutoSave(isDirty, async () => {
  await api.save(form);
  reset();
});
```

---

## 🧩 Element Plus Integration

```ts
import { useElDialogDirtyGuard } from "vue-dirty-guard";

const handleClose = useElDialogDirtyGuard(() => {
  dialogVisible.value = false;
});
```

---

## 🧪 Testing Strategy

- **Unit tests**: core logic & composables
- **Integration tests**: router + dialog + autosave
- **Playground-driven**: real demo flows are tested

Run tests:

```bash
pnpm test
```

---

## 📘 Demo Playground

The `playground/` folder contains a runnable demo app:

```bash
pnpm --filter playground dev
```

Demo covers:

- Route leave blocking
- Dialog close blocking
- Auto save success / failure
- Version conflict simulation

> 🎯 New contributors can understand the full lifecycle in ~10 minutes.

---

## 🚦 API Stability

This project follows **Semantic Versioning**.

- Stable APIs are frozen for v1
- No breaking changes without a major release

📄 See: [docs/API_STABILITY.md](docs/API_STABILITY.md)

---

## 🤝 Contributing

Contributions are welcome!

- Open an issue for discussion
- Submit PRs with tests
- Follow existing code style

(Contribution guide coming soon)

---

## 📄 License

MIT © vue-dirty-guard
