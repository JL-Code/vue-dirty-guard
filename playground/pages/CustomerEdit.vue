<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

import { useDirtyForm, dirtyGuard, useAutoSave } from "vue-dirty-guard";
import OrderDialog from "./OrderDialog.vue";
import AutoSaveBadge from "./AutoSaveBadge.vue";

/** ------------------------------
 * 表单数据
 * ----------------------------- */
const form = reactive({
    name: "",
    phone: "",
});

const version = ref(1);
const showOrderDialog = ref(false);
const conflict = ref(false);

/** ------------------------------
 * Dirty Form
 * ----------------------------- */
const dirty = useDirtyForm(form);

dirtyGuard.register({
    id: "customer-form",
    isDirty: () => dirty.isDirty.value,
    reset: dirty.reset,
});

/** ------------------------------
 * Auto Save
 * ----------------------------- */
const autoSaveState = ref<"idle" | "saving" | "success" | "error">("idle");

useAutoSave(
    dirty.isDirty,
    async () => {
        autoSaveState.value = "saving";
        await new Promise((r) => setTimeout(r, 800));

        // 模拟冲突
        if (conflict.value) {
            autoSaveState.value = "error";
            await ElMessageBox.alert(
                "数据版本冲突，请重新加载或手动合并",
                "版本冲突",
                { type: "error" },
            );
            return;
        }

        version.value++;
        dirty.reset();
        autoSaveState.value = "success";
        ElMessage.success("自动保存成功");
    },
    2000,
);

function simulateConflict() {
    conflict.value = true;
    ElMessage.warning("已模拟版本冲突");
}
</script>

<template>
    <el-card header="客户编辑（CustomerEdit）">
        <el-form label-width="80">
            <el-form-item label="姓名">
                <el-input v-model="form.name" data-test="name-input" />
            </el-form-item>

            <el-form-item label="手机号">
                <el-input v-model="form.phone" />
            </el-form-item>
        </el-form>

        <el-space>
            <el-button @click="showOrderDialog = true">
                编辑订单（Dialog）
            </el-button>

            <el-button type="danger" @click="simulateConflict">
                模拟版本冲突
            </el-button>
        </el-space>

        <AutoSaveBadge
            :dirty="dirty.isDirty.value"
            :state="autoSaveState"
            :version="version"
        />

        <OrderDialog v-model="showOrderDialog" />
    </el-card>
</template>
