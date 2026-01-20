import { createRouter, createWebHistory } from "vue-router";
import FormPage from "./pages/FormPage.vue";
import OtherPage from "./pages/OtherPage.vue";
import CustomerEdit from "./pages/CustomerEdit.vue";

import { setupBeforeUnloadGuard, setupDirtyRouterGuard } from "vue-dirty-guard";
import { ElMessageBox } from "element-plus";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: FormPage },
    { path: "/other", component: OtherPage },
    {
      path: "/customer-edit",
      name: "customer-edit",
      component: CustomerEdit,
    },
  ],
});

// 接入 dirty guard

// setupDirtyRouterGuard(router);

// 设置浏览器拦截器P
setupBeforeUnloadGuard();

// 设置路由拦截器
setupDirtyRouterGuard(router, {
  confirm: async () => {
    try {
      await ElMessageBox.confirm(
        "当前表单有未保存内容，确定要离开吗？",
        "未保存提示",
        {
          type: "warning",
          confirmButtonText: "离开",
          cancelButtonText: "留下",
        },
      );
      return true;
    } catch {
      return false;
    }
  },
});

export default router;

export const routes = router.getRoutes();
