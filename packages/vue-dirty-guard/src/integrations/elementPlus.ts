import { ElMessageBox } from 'element-plus'
import { dirtyGuard } from '../core/DirtyGuard'


export function useElDialogDirtyGuard(onClose: () => void) {
    return async () => {
        if (!dirtyGuard.hasDirty()) {
            onClose()
            return
        }


        try {
            await ElMessageBox.confirm(
                '内容未保存，是否关闭？',
                '提示',
                { type: 'warning' }
            )
            dirtyGuard.resetAll()
            onClose()
        } catch {
            // cancel
        }
    }
}