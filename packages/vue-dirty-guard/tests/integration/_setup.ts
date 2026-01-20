import { config } from "@vue/test-utils";
import { beforeEach, vi } from "vitest";
import { dirtyGuard } from "../../src/core/DirtyGuard";

/**
 * 全局 stub Element Plus 组件
 * 👉 integration test 不测 UI，只测行为
 */
config.global.stubs = {
  "el-text": {
    template: `<input data-test="el-text" />`,
  },
  "el-header": {
    template: `<input data-test="el-header" />`,
  },
  "el-main": {
    template: `<input data-test="el-main" />`,
  },
  "el-container": {
    template: `<input data-test="el-container" />`,
  },
  "el-input": {
    props: ["modelValue"],
    emits: ["update:modelValue"],
    template: `
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        v-bind="$attrs"
      />
    `,
  },
  "el-input-number": {
    template: `<input data-test="el-input-number" />`,
  },
  "el-form": {
    template: `<form><slot /></form>`,
  },
  "el-form-item": {
    template: `<div><slot /></div>`,
  },
  "el-dialog": {
    props: ["modelValue"],
    emits: ["update:modelValue"],
    template: `
      <div v-if="modelValue" data-test="el-dialog">
        <slot />
        <button data-test="dialog-close"
          @click="$emit('update:modelValue', false)"
        >
          close
        </button>
      </div>
    `,
  },
  "el-button": {
    template: `<button><slot /></button>`,
  },
  "el-space": {
    template: `<div><slot /></div>`,
  },
  "el-card": {
    template: `<div><slot /></div>`,
  },
  "el-tag": {
    template: `<span><slot /></span>`,
  },
};

// ✅ 通用测试前置（所有 integration test 共用）
beforeEach(() => {
  // 清空全局 dirty 状态
  dirtyGuard.resetAll();

  // 默认：用户允许离开
  vi.spyOn(window, "confirm").mockReturnValue(true);
});
