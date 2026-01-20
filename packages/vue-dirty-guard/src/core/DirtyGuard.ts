import type { DirtyAdapter } from "./DirtyAdapter";
export class DirtyGuard {
  private adapters = new Map<string, DirtyAdapter>();

  register(adapter: DirtyAdapter) {
    this.adapters.set(adapter.id, adapter);
  }

  unregister(id: string) {
    this.adapters.delete(id);
  }

  hasDirty(): boolean {
    for (const adapter of this.adapters.values()) {
      if (adapter.isDirty()) return true;
    }
    return false;
  }

  getDirtyAdapters(): DirtyAdapter[] {
    return [...this.adapters.values()].filter((a) => a.isDirty());
  }

  resetAll() {
    this.adapters.forEach((a) => a.reset());
  }

  clear() {
    this.adapters.clear();
  }
}

export const dirtyGuard = new DirtyGuard();
