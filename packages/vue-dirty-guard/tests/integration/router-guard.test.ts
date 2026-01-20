import { mount } from "@vue/test-utils";
import { createRouter, createMemoryHistory } from "vue-router";
import { describe, it, expect } from "vitest";
import CustomerEdit from "@/pages/CustomerEdit.vue";
import { dirtyGuard, setupDirtyRouterGuard } from "vue-dirty-guard";

describe("router guard - dirty block", () => {
  it("blocks navigation when form is dirty", async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/customer-edit", component: CustomerEdit },
        { path: "/other", component: { template: "<div>Other Page</div>" } },
      ],
    });

    setupDirtyRouterGuard(router, {
      confirm: () => false,
    });

    await router.push("/customer-edit");
    await router.isReady();

    const wrapper = mount(CustomerEdit, {
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
