<script setup lang="ts">
import { reactive } from "vue";
import { ElMessage } from "element-plus";

import { useDirtyForm } from "vue-dirty-guard";
import { dirtyGuard } from "vue-dirty-guard";
// import { useAutoSave } from "vue-dirty-guard";

const form = reactive({
  name: "",
  email: "",
});

// 1️⃣ dirty form
const dirty = useDirtyForm(form);

// 2️⃣ register adapter
dirtyGuard.register({
  id: "profile-form",
  isDirty: () => dirty.isDirty.value,
  reset: dirty.reset,
});

// 3️⃣ auto save
// useAutoSave(
//   dirty.isDirty,
//   async () => {
//     console.log("auto saving...", { ...form });
//     await new Promise((r) => setTimeout(r, 800));
//     dirty.reset();
//     ElMessage.success("自动保存成功");
//   },
//   2000,
// );

function manualSave() {
  dirty.reset();
  ElMessage.success("手动保存成功");
}
</script>

<template>
  <el-card header="用户信息表单">
    <el-form label-width="80">
      <el-form-item label="姓名">
        <el-input v-model="form.name" />
      </el-form-item>

      <el-form-item label="邮箱">
        <el-input v-model="form.email" />
      </el-form-item>
    </el-form>

    <el-space>
      <el-button type="primary" @click="manualSave"> 手动保存 </el-button>

      <el-tag v-if="dirty.isDirty" type="warning"> 未保存 </el-tag>
      <el-tag v-else type="success"> 已保存 </el-tag>
    </el-space>
  </el-card>
</template>
