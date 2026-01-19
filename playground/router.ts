import { createRouter, createWebHistory } from "vue-router";
import FormPage from "./pages/FormPage.vue";
import OtherPage from "./pages/OtherPage.vue";

import { setupBeforeUnloadGuard, setupDirtyRouterGuard } from "vue-dirty-guard";
import { ElMessageBox } from "element-plus";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: FormPage },
    { path: "/other", component: OtherPage },
  ],
});

// 接入 dirty guard

// setupDirtyRouterGuard(router);

setupBeforeUnloadGuard();

setupDirtyRouterGuard(router, {
  confirm: async () => {
    try {
      await ElMessageBox.confirm(
        "当前表单有未保存内容，确定要离开吗？",
        "未保存提示",
        {
          type: "warning",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        },
      );
      return true;
    } catch {
      return false;
    }
  },
});

export default router;
