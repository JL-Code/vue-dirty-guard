import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import CustomerEdit from "@/pages/CustomerEdit.vue";
import { dirtyGuard } from "vue-dirty-guard";

describe("autosave success", () => {
  it("clears dirty after autosave success", async () => {
    const wrapper = mount(CustomerEdit);

    // mock 成功的 API（而不是组件方法）
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as any);

    await wrapper.find("input").setValue("changed");
    expect(dirtyGuard.hasDirty()).toBe(true);

    // 等 autosave debounce
    await new Promise((r) => setTimeout(r, 600));

    expect(dirtyGuard.hasDirty()).toBe(false);
  });
});
