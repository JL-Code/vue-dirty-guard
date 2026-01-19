import { ref, computed, watch, type Ref } from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'


export function useDirtyForm<T extends object>(form: T) {
    const snapshot: Ref<T> = ref(cloneDeep(form)) as Ref<T>


    const isDirty = computed(() => !isEqual(form, snapshot.value))


    function reset() {
        snapshot.value = cloneDeep(form)
    }


    return {
        isDirty,
        reset,
        snapshot
    }
}