---

# API Stability Policy

> This document describes the API stability guarantees for **vue-dirty-guard**.

`vue-dirty-guard` follows **Semantic Versioning (SemVer)**.

- **MAJOR** version: breaking changes
- **MINOR** version: backward-compatible feature additions
- **PATCH** version: backward-compatible bug fixes

---

## 1. Stability Levels

Each exported API falls into one of the following stability levels:

### 🟢 Stable

- API is **frozen**
- No breaking changes in **minor or patch** releases
- Breaking changes only allowed in **major** releases

### 🟡 Soft Stable

- API is **safe to use**
- Signature will remain stable in **minor versions**
- Behavior may evolve with better defaults or additional options

### 🔴 Experimental

- API may change at any time
- No stability guarantees

---

## 2. Stable APIs (v1 Frozen)

The following APIs are **stable** and guaranteed not to change before the next major release.

### Core

#### `DirtyAdapter`

```ts
export interface DirtyAdapter {
  id: string;
  isDirty(): boolean;
  reset(): void;
  description?: string;
}
```

- Represents a single dirty source
- Must be side-effect free
- Used internally by `DirtyGuard`

---

#### `DirtyGuard`

```ts
export class DirtyGuard {
  register(adapter: DirtyAdapter): void;
  unregister(id: string): void;
  hasDirty(): boolean;
  getDirtyAdapters(): DirtyAdapter[];
  resetAll(): void;
  clear(): void;
}
```

- Central registry for all dirty adapters
- Deterministic behavior
- No implicit async or framework coupling

---

#### `dirtyGuard` (Singleton)

```ts
export const dirtyGuard: DirtyGuard;
```

- Global singleton instance
- Used by all composables and integrations by default

> ℹ️ The singleton nature of `dirtyGuard` is intentional and considered stable.

---

### Router Integration

#### `setupDirtyRouterGuard`

```ts
export function setupDirtyRouterGuard(
  router: Router,
  options?: {
    confirm?: () => boolean | Promise<boolean>;
    shouldCheck?: () => boolean;
  },
): void;
```

- Official Vue Router integration
- Supports synchronous and asynchronous confirmation
- Fully customizable decision logic

---

### Browser Integration

#### `setupBeforeUnloadGuard`

```ts
export function setupBeforeUnloadGuard(): void;
```

- Integrates with `window.beforeunload`
- Prevents accidental page unload when dirty state exists

---

### Composables

#### `useDirtyForm`

```ts
export function useDirtyForm<T extends object>(
  form: T,
): {
  isDirty: ComputedRef<boolean>;
  reset(): void;
  snapshot: Ref<T>;
};
```

- Snapshot-based dirty detection
- Uses deep comparison
- Explicit reset control

---

#### `useDirtyDialog`

```ts
export function useDirtyDialog(onClose: () => void): () => void;
```

- Minimal dialog dirty guard
- Uses browser-native `window.confirm`
- Intended for simple dialog scenarios

---

## 3. Soft Stable APIs (May Evolve)

The following APIs are **safe to use**, but may gain additional capabilities in future **minor versions**.

### Auto Save

#### `useAutoSave`

```ts
export function useAutoSave(
  isDirty: Ref<boolean>,
  saveFn: () => Promise<void>,
  delay?: number,
): {
  saving: Ref<boolean>;
  error: Ref<Error | null>;
};
```

**Guarantees:**

- Function signature will remain stable
- Existing behavior will not break

**May evolve:**

- Additional return fields (e.g. lastSavedAt)
- Retry or conflict-handling hooks
- Optional integration with `DirtyGuard`

> ⚠️ This API is opinionated by design.
> Future enhancements will be additive and backward compatible.

---

### UI Framework Integration

#### `useElDialogDirtyGuard`

```ts
export function useElDialogDirtyGuard(onClose: () => void): () => Promise<void>;
```

- Element Plus dialog integration
- Wraps `ElMessageBox.confirm`
- Provides basic dirty confirmation behavior

**Notes:**

- UI appearance and wording are not considered API-stable
- Integration behavior may improve over time

---

## 4. Experimental APIs

Currently, there are **no experimental APIs** in the public surface.

Future experimental APIs will be clearly documented and prefixed as such.

---

## 5. What Is NOT Considered API

The following are **not covered** by stability guarantees:

- Internal utility functions
- Private methods or non-exported symbols
- Implementation details
- Error message wording
- UI text content
- Demo / playground code

---

## 6. Versioning Commitment

- Breaking changes will **only** be introduced in **major** versions
- Deprecations will be announced in advance
- Stable APIs will remain backward compatible

---

## 7. Feedback & Evolution

`vue-dirty-guard` is designed to evolve with real-world usage.

If you have suggestions or need additional flexibility:

- Open an issue
- Propose an RFC
- Share your usage scenario

---

**Thank you for using `vue-dirty-guard`.**

---
