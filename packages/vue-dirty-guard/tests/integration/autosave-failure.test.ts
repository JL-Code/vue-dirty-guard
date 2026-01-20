import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import CustomerEdit from "@/pages/CustomerEdit.vue";
import { dirtyGuard } from "../../src/core/DirtyGuard";

describe("autosave failure", () => {
  it("keeps dirty when autosave fails", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("fail"));

    const wrapper = mount(CustomerEdit);

    await wrapper.find("input").setValue("changed");
    expect(dirtyGuard.hasDirty()).toBe(true);

    await new Promise((r) => setTimeout(r, 600));

    expect(dirtyGuard.hasDirty()).toBe(true);
  });
});
