import type { Router } from "vue-router";
import { dirtyGuard } from "../core/DirtyGuard";

/**
 * 路由守卫配置项
 */
interface RouterGuardOptions {
  /** 自定义 confirm 弹窗 */
  confirm?: () => boolean | Promise<boolean>;
  /** 自定义是否检查 dirty */
  shouldCheck?: () => boolean;
}

/**
 * 接入路由守卫
 * @param router - Vue Router 实例
 * @param options - 路由守卫配置项
 */
export function setupDirtyRouterGuard(
  router: Router,
  options: RouterGuardOptions = {},
) {
  const {
    confirm = () => window.confirm("You have unsaved changes, leave anyway?"),
    shouldCheck = () => true,
  } = options;

  router.beforeEach(async () => {
    // 1️⃣ 是否启用 dirty 检测
    if (!shouldCheck()) return true;

    // 2️⃣ 是否真的 dirty
    if (!dirtyGuard.hasDirty()) return true;

    // 3️⃣ 交给用户自定义 confirm
    const allowLeave = await confirm();

    // 4️⃣ 用户确认离开 → reset
    if (allowLeave) {
      dirtyGuard.resetAll();
      return true;
    }

    // 5️⃣ 用户取消
    return false;
  });
}
