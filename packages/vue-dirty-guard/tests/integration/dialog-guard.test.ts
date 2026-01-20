import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import OrderDialog from "@/pages/OrderDialog.vue";
import { dirtyGuard } from "../../src/core/DirtyGuard";

describe("dialog guard", () => {
  it("blocks dialog close when dirty", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);

    const wrapper = mount(OrderDialog, {
      props: { modelValue: true },
    });

    // 修改表单
    await wrapper.find("input").setValue("changed");
    expect(dirtyGuard.hasDirty()).toBe(true);

    // 触发关闭（模拟用户）
    await wrapper.find('[data-test="close"]').trigger("click");

    // dialog 应该仍然打开
    expect(wrapper.emitted("update:modelValue")).toBeFalsy();
  });
});
