# vue-dirty-guard

## 测试使用指南

在项目根目录执行以下命令：

```bash
pnpm -C packages/vue-dirty-guard test
```

运行特定测试文件

```bash
pnpm -C packages/vue-dirty-guard test tests/unit/core/DirtyGuard.test.ts
```

测试覆盖率

```bash
pnpm -C packages/vue-dirty-guard test --coverage
```

调试测试

```bash
pnpm -C packages/vue-dirty-guard test --inspect-brk
```

## 关于 Monorepo

在这个项目中，monorepo 允许：

在一个仓库中管理多个相关的包
共享依赖和配置
使用 -C 参数指定在哪个子包中运行命令
使用 pnpm -r 在所有子包中运行命令（如根目录的 pnpm -r test）
希望这些信息能帮助你顺利运行项目的测试！如果你有任何其他问题，请随时提问。
