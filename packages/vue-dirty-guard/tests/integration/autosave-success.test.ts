import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import CustomerEdit from "@/pages/CustomerEdit.vue";
import { dirtyGuard } from "vue-dirty-guard";

describe("autosave success", () => {
  it("clears dirty after autosave success", async () => {
    vi.useFakeTimers();

    const wrapper = mount(CustomerEdit);

    // mock 成功的 API（而不是组件方法）
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as any);

    
    await wrapper.find('[data-test="name-input"]').setValue("changed");
    expect(dirtyGuard.hasDirty()).toBe(true);

    // 跑完所有与 autosave 相关的定时器（debounce + 模拟保存耗时）
    await vi.runAllTimersAsync();

    expect(dirtyGuard.hasDirty()).toBe(false);
  });
});
