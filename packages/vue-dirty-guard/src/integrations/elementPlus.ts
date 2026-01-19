import { ElMessageBox } from "element-plus";
import { dirtyGuard } from "../core/DirtyGuard";

/**
 * 接入 Element Plus 对话框 dirty guard
 * @param onClose - 对话框关闭回调
 */
export function useElDialogDirtyGuard(onClose: () => void) {
  return async () => {
    if (!dirtyGuard.hasDirty()) {
      onClose();
      return;
    }

    try {
      await ElMessageBox.confirm("内容未保存，是否关闭？", "提示", {
        type: "warning",
      });
      dirtyGuard.resetAll();
      onClose();
    } catch {
      // cancel
    }
  };
}
