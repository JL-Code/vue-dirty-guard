import { dirtyGuard } from '../../src/core/DirtyGuard'


describe('DirtyGuard', () => {
    it('detects dirty adapters', () => {
        dirtyGuard.register({
            id: 'a',
            isDirty: () => true,
            reset: () => { }
        })
        expect(dirtyGuard.hasDirty()).toBe(true)
        dirtyGuard.unregister('a')
    })


    it('resets all adapters', () => {
        let dirty = true
        dirtyGuard.register({
            id: 'b',
            isDirty: () => dirty,
            reset: () => (dirty = false)
        })
        dirtyGuard.resetAll()
        expect(dirtyGuard.hasDirty()).toBe(false)
        dirtyGuard.unregister('b')
    })
})