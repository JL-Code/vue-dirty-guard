import { reactive } from 'vue'
import { useDirtyForm } from 'vue-dirty-guard'


describe('useDirtyForm', () => {
    it('tracks dirty state', () => {
        const form = reactive({ name: 'a' })
        const { isDirty, reset } = useDirtyForm(form)


        expect(isDirty.value).toBe(false)
        form.name = 'b'
        expect(isDirty.value).toBe(true)
        reset()
        expect(isDirty.value).toBe(false)
    })
})
