import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import { nextTick } from "vue";
import ElementPlus from "element-plus";

import { dirtyGuard } from "../../src/core/DirtyGuard";
import { setupDirtyRouterGuard } from "../../src/integrations/router";

// ⚠️ 注意这里：直接使用 playground 的页面
import CustomerEdit from "../../../../playground/pages/CustomerEdit.vue";

vi.useFakeTimers();

describe("integration: playground dirty lifecycle", () => {
  let router: ReturnType<typeof createRouter>;

  beforeEach(() => {
    // 每个 case 前清空 dirty 状态
    dirtyGuard.resetAll();

    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: "/", component: CustomerEdit },
        {
          path: "/other",
          component: {
            template: "<div>Other Page</div>",
          },
        },
      ],
    });

    setupDirtyRouterGuard(router, {
      confirm: vi.fn().mockResolvedValue(false),
    });
  });

  it("blocks route when dirty, allows after autosave", async () => {
    const wrapper = mount(CustomerEdit, {
      global: {
        plugins: [router, ElementPlus],
      },
    });

    // 初始化路由
    await router.push("/");
    await router.isReady();

    /* --------------------------------
     * 1. 修改表单 → Dirty
     * -------------------------------- */
    const inputs = wrapper.findAll("input");
    await inputs[0].setValue("Alice");

    expect(dirtyGuard.hasDirty()).toBe(true);

    /* --------------------------------
     * 2. 路由跳转 → 被拦截
     * -------------------------------- */
    await router.push("/other");
    await nextTick();

    expect(router.currentRoute.value.path).toBe("/");

    /* --------------------------------
     * 3. 自动保存
     * -------------------------------- */
    vi.advanceTimersByTime(2000);
    await nextTick();

    expect(dirtyGuard.hasDirty()).toBe(false);

    /* --------------------------------
     * 4. 再次跳转 → 放行
     * -------------------------------- */
    await router.push("/other");
    await nextTick();

    expect(router.currentRoute.value.path).toBe("/other");
  });
});
