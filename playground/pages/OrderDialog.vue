<script setup lang="ts">
import { reactive, watch } from "vue";
import { ElMessageBox } from "element-plus";

import { useDirtyForm, dirtyGuard } from "vue-dirty-guard";

const visible = defineModel<boolean>();

const order = reactive({
    product: "",
    count: 1,
});

const dirty = useDirtyForm(order);

const adapterId = "order-dialog";

// 动态注册脏数据检测适配器
watch(visible, (v) => {
    if (v) {
        dirtyGuard.register({
            id: adapterId,
            isDirty: () => dirty.isDirty.value,
            reset: dirty.reset,
        });
    } else {
        dirtyGuard.unregister(adapterId);
    }
});

async function beforeClose(done: () => void) {
    if (!dirty.isDirty.value) {
        done();
        return;
    }

    try {
        await ElMessageBox.confirm(
            "订单有未保存修改，确认关闭？",
            "未保存提示",
            {
                type: "warning",
                confirmButtonText: "离开",
                cancelButtonText: "留下",
            },
        );
        dirty.reset();
        done();
    } catch {
        // 用户取消
    }
}
</script>

<template>
    <el-dialog
        v-model="visible"
        title="订单编辑（Dialog）"
        :before-close="beforeClose"
    >
        <el-form label-width="80">
            <el-form-item label="商品">
                <el-input v-model="order.product" />
            </el-form-item>

            <el-form-item label="数量">
                <el-input-number v-model="order.count" :min="1" />
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
