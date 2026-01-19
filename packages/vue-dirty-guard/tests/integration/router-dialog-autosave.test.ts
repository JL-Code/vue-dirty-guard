import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { reactive, nextTick } from "vue";
import { createRouter, createMemoryHistory } from "vue-router";

// 导入全局 dirtyGuard 实例
import { dirtyGuard } from "../../src/core/DirtyGuard";
import { useDirtyForm } from "../../src/composables/useDirtyForm";
import { useAutoSave } from "../../src/composables/useAutoSave";
import { setupDirtyRouterGuard } from "../../src/integrations/router";

describe("integration: router + dialog + autoSave", () => {
  // 使用全局 dirtyGuard 实例而不是创建新实例
  let guard = dirtyGuard;

  beforeEach(() => {
    // 使用假计时器
    vi.useFakeTimers();
    
    // 清理之前的适配器
    guard.clear();
    
    // 模拟 window.confirm，让用户确认离开
    vi.stubGlobal("confirm", vi.fn(() => true));
  });

  afterEach(() => {
    // 恢复真实计时器
    vi.useRealTimers();
    
    // 恢复所有 mock
    vi.unstubAllGlobals();
  });

  it("should block navigation, autosave, then allow navigation", async () => {
    /**
     * 1️⃣ 准备响应式表单
     */
    const form = reactive({
      name: "initial",
    });

    const { isDirty, reset } = useDirtyForm(form);

    guard.register({
      id: "form",
      isDirty: () => isDirty.value,
      reset,
      description: "Test Form",
    });

    /**
     * 2️⃣ mock 自动保存 API
     */
    const saveApi = vi.fn().mockResolvedValue(true);

    useAutoSave(isDirty, async () => {
      await saveApi();
      reset();
    });

    /**
     * 3️⃣ 创建 router
     */
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/", component: {} },
        { path: "/next", component: {} },
      ],
    });

    setupDirtyRouterGuard(router);

    /**
     * 4️⃣ 初始进入首页
     */
    await router.push("/");
    await router.isReady();

    /**
     * 5️⃣ 修改表单 → dirty
     */
    form.name = "changed";
    await nextTick();

    expect(isDirty.value).toBe(true);

    /**
     * 6️⃣ 触发路由跳转（应被 guard 拦截）
     */
    const navigation = router.push("/next");

    // 等待防抖延迟
    await vi.runAllTimersAsync();

    await navigation;

    /**
     * 7️⃣ 自动保存被调用
     */
    expect(saveApi).toHaveBeenCalledOnce();

    /**
     * 8️⃣ dirty 已被 reset
     */
    expect(isDirty.value).toBe(false);

    /**
     * 9️⃣ 路由最终成功跳转
     */
    expect(router.currentRoute.value.path).toBe("/next");
  });
});