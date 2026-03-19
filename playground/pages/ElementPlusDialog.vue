<script setup lang="ts">
import { reactive } from "vue";
import { useElDialogDirtyGuard } from "vue-dirty-guard";

const visible = defineModel<boolean>({ default: false });

const order = reactive({
  product: "",
  count: 1,
});
const adapterId = "element-plus-dialog";

const { close } = useElDialogDirtyGuard<typeof order>({
  id: adapterId,
  visible,
  form: order,
});
</script>

<template>
  <el-dialog v-model="visible" title="订单编辑（Dialog）" :before-close="close">
    <el-form label-width="80">
      <el-form-item label="商品">
        <el-input v-model="order.product" data-test="order-title-input" />
      </el-form-item>

      <el-form-item label="数量">
        <el-input-number v-model="order.count" :min="1" />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
