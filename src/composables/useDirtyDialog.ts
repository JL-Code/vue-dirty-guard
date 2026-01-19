import { dirtyGuard } from '../core/DirtyGuard'


export function useDirtyDialog(onClose: () => void) {
return () => {
if (!dirtyGuard.hasDirty()) {
onClose()
return
}


if (window.confirm('内容未保存，是否关闭？')) {
dirtyGuard.resetAll()
onClose()
}
}
}