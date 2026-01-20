import { mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import { describe, it, expect, vi } from "vitest";
import App from "@/App.vue";
import { routes } from "@/router";
import { dirtyGuard } from "../../src/core/DirtyGuard";

describe("router guard - dirty block", () => {
  it("blocks navigation when form is dirty", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);

    const router = createRouter({
      history: createWebHistory(),
      routes: routes,
    });

    router.push("/customer-edit");
    await router.isReady();

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    });

    // 修改表单 → dirty
    await wrapper.find('[data-test="name-input"]').setValue("Alice");

    expect(dirtyGuard.hasDirty()).toBe(true);

    // 尝试跳转
    await router.push("/other");

    // 仍然停留在 form
    expect(router.currentRoute.value.path).toBe("/customer-edit");
  });
});
