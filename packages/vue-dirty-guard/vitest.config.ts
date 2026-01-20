import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [
    vue(), // ⭐️ 必须
  ],
  test: {
    environment: "jsdom",
    setupFiles: ["tests/integration/_setup.ts"],
    globals: true,
    include: ["tests/**/*.{test,spec}.ts"],
  },
  resolve: {
    alias: {
      // 让测试能 import playground
      "@": path.resolve(__dirname, "../../playground"),
    },
  },
});
