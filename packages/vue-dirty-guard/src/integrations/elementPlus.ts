import { ModelRef, Ref, watch } from "vue";
import { ElMessageBox } from "element-plus";
import { dirtyGuard } from "../core/DirtyGuard";
import { useDirtyForm } from "../composables/useDirtyForm";

interface ElDialogDirtyGuardOptions<T> {
  /** ID，用于注册 dirty guard,需要保持唯一 */
  id: string;
  /**
   * 对话框可见状态
   */
  visible: Ref<boolean> | ModelRef<boolean>;
  /**
   * 表单数据
   */
  form: T;
}

/**
 * 对话框 dirty guard 返回值
 */
interface ElDialogDirtyGuardReturn {
  /**
   * 关闭对话框
   * @param done - 对话框关闭回调
   */
  close: (done: () => void) => Promise<void>;
}

/**
 * 接入 Element Plus 对话框 dirty guard
 * @param options - 对话框 dirty guard 配置项
 */
export function useElDialogDirtyGuard<T extends object>(
  options: ElDialogDirtyGuardOptions<T>,
): ElDialogDirtyGuardReturn {
  const { id, form, visible } = options;

  // 接管表单 dirty 状态
  const dirtyForm = useDirtyForm(form);

  // 监听对话框打开/关闭状态，动态注册/注销 dirty guard
  watch(visible, (v) => {
    if (v) {
      // 注册 dirty guard
      dirtyGuard.register({
        id,
        isDirty: () => dirtyForm.isDirty.value,
        reset: () => dirtyForm.reset(),
      });
    } else {
      // 注销 dirty guard
      dirtyGuard.unregister(id);
    }
  });

  const close = async (done: () => void) => {
    if (!dirtyGuard.hasDirty()) {
      done();
      return;
    }

    try {
      await ElMessageBox.confirm("内容未保存，是否关闭？", "提示", {
        type: "warning",
        confirmButtonText: "离开",
        cancelButtonText: "留下",
      });
      dirtyGuard.resetAll();
      done();
    } catch {
      // cancel
    }
  };

  return {
    close,
  };
}
