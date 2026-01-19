import { dirtyGuard } from "../core/DirtyGuard";

/**
 * 接入浏览器 window beforeunload 守卫
 */
export function setupBeforeUnloadGuard() {
  window.addEventListener("beforeunload", (e) => {
    if (!dirtyGuard.hasDirty()) return;
    e.preventDefault();
    e.returnValue = "";
  });
}
