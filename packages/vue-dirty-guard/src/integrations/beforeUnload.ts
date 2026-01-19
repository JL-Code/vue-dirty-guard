import { dirtyGuard } from '../core/DirtyGuard'


export function setupBeforeUnloadGuard() {
    window.addEventListener('beforeunload', e => {
        if (!dirtyGuard.hasDirty()) return
        e.preventDefault()
        e.returnValue = ''
    })
}