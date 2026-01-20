<script setup lang="ts">
defineProps<{
    dirty: boolean;
    state: "idle" | "saving" | "success" | "error";
    version: number;
}>();
</script>

<template>
    <el-space style="margin-top: 16px">
        <el-tag v-if="dirty" type="warning"> Dirty </el-tag>
        <el-tag v-else type="success"> Clean </el-tag>

        <el-tag type="info"> Version: {{ version }} </el-tag>

        <el-tag v-if="state === 'saving'" type="info"> 自动保存中... </el-tag>
        <el-tag v-if="state === 'success'" type="success">
            自动保存成功
        </el-tag>
        <el-tag v-if="state === 'error'" type="danger"> 自动保存失败 </el-tag>
    </el-space>
</template>
