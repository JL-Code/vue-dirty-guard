import { watch, ref, type Ref } from 'vue'


function debounce<T extends (...args: any[]) => void>(fn: T, delay = 2000) {
    let timer: number | undefined
    return (...args: Parameters<T>) => {
        window.clearTimeout(timer)
        timer = window.setTimeout(() => fn(...args), delay)
    }
}


export function useAutoSave(
    isDirty: Ref<boolean>,
    saveFn: () => Promise<void>,
    delay = 2000
) {
    const saving = ref(false)
    const error = ref<Error | null>(null)


    const triggerSave = debounce(async () => {
        if (!isDirty.value || saving.value) return
        saving.value = true
        error.value = null
        try {
            await saveFn()
        } catch (e: any) {
            error.value = e
        } finally {
            saving.value = false
        }
    }, delay)


    watch(isDirty, () => triggerSave())


    return {
        saving,
        error
    }
}