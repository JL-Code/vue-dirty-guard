import type { Router } from 'vue-router'
import { dirtyGuard } from '../core/DirtyGuard'


export function setupDirtyRouterGuard(router: Router) {
router.beforeEach(() => {
if (!dirtyGuard.hasDirty()) return true
return window.confirm('内容未保存，是否离开？')
})
}