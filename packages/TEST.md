**断言速查表（按场景整理）**

> 只记核心用法，遇到不会写断言时可以直接来抄。

---

### 一、值判断（基础）

- 严格相等（适合布尔 / 数字 / 字符串等）

  ```ts
  expect(dirtyGuard.hasDirty()).toBe(true);
  expect(router.currentRoute.value.path).toBe("/next");
  ```

- 深度相等（适合对象 / 数组）

  ```ts
  expect({ a: 1 }).toEqual({ a: 1 });
  ```

- 真值 / 假值（用在“有没有”这种语义）

  ```ts
  // 有值即可（非 undefined / null / false / 0 / "" 都算 true）
  expect(wrapper.emitted("update:modelValue")).toBeTruthy();

  // 完全没有
  expect(wrapper.emitted("update:modelValue")).toBeFalsy();
  ```

---

### 二、真值判断（Truthy / Falsy）

- `toBeTruthy()`

  ```ts
  // 至少发出过一次事件
  expect(wrapper.emitted("update:modelValue")).toBeTruthy();

  // 自动保存有报错对象
  expect(autoSave.error.value).toBeTruthy();
  ```

- `toBeFalsy()`

  ```ts
  // 不应该发出关闭事件（对话框被 dirty guard 拦截）
  expect(wrapper.emitted("update:modelValue")).toBeFalsy();

  // 没有错误
  expect(autoSave.error.value).toBeFalsy();
  ```

> 心里可以直接想成：`Boolean(值) === true/false`。

---

### 三、Spy / Mock 调用次数

用 `vi.fn()` 或 `vi.spyOn()` 创建的函数，常用断言有：

- 至少被调用过一次

  ```ts
  expect(saveApi).toHaveBeenCalled();
  ```

- 调用次数

  ```ts
  expect(saveApi).toHaveBeenCalledTimes(1);
  expect(saveApi).toHaveBeenCalledOnce();
  ```

- 按参数断言（需要时再用）

  ```ts
  expect(saveApi).toHaveBeenCalledWith({ id: 1 });
  expect(saveApi).toHaveBeenLastCalledWith({ id: 1 });
  ```

结合 fake timers 的常见模式：

```ts
vi.useFakeTimers();

const saveApi = vi.fn().mockResolvedValue(true);

// 修改表单 → dirty，触发 autosave 定时器

await vi.runAllTimersAsync();

expect(saveApi).toHaveBeenCalledOnce();
```

---

### 四、Vue 组件事件（emitted）

配合 Vue Test Utils 的 `wrapper.emitted()`：

- 检查是否发出过某个事件

  ```ts
  // 干净时点击关闭 → 应发出 update:modelValue（关闭对话框）
  expect(wrapper.emitted("update:modelValue")).toBeTruthy();

  // dirty 且用户取消 → 不应发出关闭事件
  expect(wrapper.emitted("update:modelValue")).toBeFalsy();
  ```

- 检查事件参数（需要更细时再看）

  ```ts
  const emitted = wrapper.emitted("update:modelValue");
  // emitted 形如：[[false]]，第一次调用的参数是 false
  expect(emitted?.[0]?.[0]).toBe(false);
  ```

---

### 五、配套工具：vi / VTU（简单回顾）

> 下面是上面断言常配合使用的工具，方便你对上文中的例子。

**1. 整体栈：Vitest + Vue Test Utils**

在 `packages/vue-dirty-guard` 里，测试主要用两样东西：

- **Vitest**：测试框架，负责：
  - 组织用例（`describe` / `it`）
  - 断言（`expect(...).toBe(...)` 之类）
  - mock / spy（`vi.fn`、`vi.spyOn`、`vi.useFakeTimers`）
- **Vue Test Utils（VTU）**：专门测 Vue 组件：
  - `mount(Component)` 渲染组件
  - 返回 `wrapper`，可以：
    - 查找 DOM：`wrapper.find(...)`
    - 模拟输入：`setValue`
    - 模拟事件：`trigger`
    - 看组件发出了哪些事件：`wrapper.emitted()`

你看到的这句：

```ts
expect(wrapper.emitted("update:modelValue")).toBeTruthy();
```

就是 **Vitest 的断言** + **VTU 的 emitted 工具** 组合起来的。

---

### 2. Vitest 基础：describe / it / expect

以 `dialog-guard.test.ts` 为例：

```ts
import { describe, it, expect, vi } from "vitest";

describe("dialog guard", () => {
  it("blocks dialog close when dirty", async () => {
    // 用例内容
  });
});
```

- `describe("dialog guard", () => { ... })`
  - 把一组相关测试归在一个「套件」里
  - 这里就是 “关于 dialog guard 的所有测试”
- `it("blocks dialog close when dirty", async () => { ... })`
  - 一个具体的测试用例
  - 用自然语言描述「应该发生什么」

**核心断言写法：**

```ts
expect(value).toBe(expected);
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toEqual(object);
expect(spy).toHaveBeenCalledTimes(1);
```

你在仓库里会看到：

- `expect(dirtyGuard.hasDirty()).toBe(true);`
  - 断言 dirtyGuard 现在「有脏数据」
- `expect(wrapper.emitted("update:modelValue")).toBeFalsy();`
  - 断言「没有发出关闭事件」
- `expect(saveApi).toHaveBeenCalledOnce();`
  - 断言「自动保存函数刚好被调用了一次」

---

### 3. Vue Test Utils：wrapper / find / setValue / trigger / emitted

最常见流程：

```ts
import { mount } from "@vue/test-utils";
import OrderDialog from "@/pages/OrderDialog.vue";

const wrapper = mount(OrderDialog, {
  props: { modelValue: true },
});
```

`mount` 做了什么：

- 真正在内存里渲染了一个 Vue 组件实例
- 返回一个 `wrapper`，你可以像「机器人用户」一样操作它

常用方法：

#### 3.1 `wrapper.find(selector)`

- 在组件渲染出来的 DOM 里找元素
- 返回一个新的 DOM wrapper

例子：

```ts
await wrapper.find('[data-test="order-title-input"]').setValue("changed");
```

- 用 CSS 选择器找 `data-test="order-title-input"` 的 `<input>`
- 找到后对这个输入框调用 `setValue("changed")`

#### 3.2 `setValue(value)`

- 封装了：
  - 设置 `input.value = value`
  - 触发 `input` / `change` 之类的事件
- 对使用 `v-model` 的 input 很方便：
  - `v-model="order.product"` 会被更新为 `"changed"`

例子：

```ts
await wrapper.find('[data-test="name-input"]').setValue("changed");
```

执行后：

- 页面里的 input 显示 `"changed"`
- 绑定的 `form.name` / `order.product` 也被改掉
- `useDirtyForm` 里会看到 form 已经变 dirty

#### 3.3 `trigger(eventName)`

模拟用户事件，比如点击：

```ts
await wrapper.find('[data-test="dialog-close"]').trigger("click");
```

- 相当于用户点击了这个按钮
- 会触发组件上的 `@click` 回调

#### 3.4 `wrapper.emitted(eventName?)`

- 检查组件向父组件**发出的事件**
- 例如对话框用 `v-model`：

  ```vue
  <el-dialog v-model="visible" />
  ```

  编译后其实是监听子组件的 `update:modelValue` 事件

在测试里：

```ts
const emitted = wrapper.emitted("update:modelValue");
expect(emitted).toBeTruthy();
```

含义：

- `wrapper.emitted("update:modelValue")`：
  - 如果从来没发这个事件 → `undefined`
  - 发过的话 → 数组，比如：`[[false]]`，代表事件一次，参数是 `false`
- `toBeTruthy()`：
  - 「不是 undefined / null / false / 0 / ""」都算 true
  - 用来表达：**至少触发过一次这个事件**

你在 dialog 测试中会看到两种写法：

- `expect(wrapper.emitted("update:modelValue")).toBeFalsy();`
  - 对 dirty 且用户取消关闭的场景：**不应该发出关闭事件**
- `expect(wrapper.emitted("update:modelValue")).toBeTruthy();`
  - 如果你要测「没有脏数据时可以正常关闭」：**应该发出关闭事件**

---

### 4. vi.*：mock / spy / fake timers

`vi` 是 Vitest 暴露出来的工具对象。

#### 4.1 `vi.spyOn(target, methodName)`

对现有对象的方法打“监听”，既保留原行为，又能统计调用次数等。

例子：

```ts
vi.spyOn(window, "confirm").mockReturnValue(false);
```

含义：

- 拦截 `window.confirm`：
  - 原来浏览器会弹出确认框
  - 现在**不弹框**，直接返回 `false`
- 同时记录这个函数被调了几次（如果你想断言的话）

在对话框测试里，这行用来模拟：

- 用户在关闭对话框时点击了「取消」
- 因此应该 **不关闭对话框**，也就是不发 `update:modelValue`

#### 4.2 `vi.fn()`

创建一个「空函数的 spy」，可选地加上实现：

```ts
const saveApi = vi.fn().mockResolvedValue(true);
```

- `saveApi` 是一个可 await 的假异步函数
- 每次调用返回 `Promise.resolve(true)`
- 可以用 `expect(saveApi).toHaveBeenCalledOnce()` 之类断言

在 router + autoSave 的测试里：

- `useAutoSave` 里调用 `await saveApi()`；
- 我们不真的发网络请求，而是只验证「有调用过」。

#### 4.3 `vi.useFakeTimers()` + `vi.runAllTimersAsync()`

用来测试跟时间有关的逻辑（比如自动保存 debounce）。

例子（`autosave-success.test.ts`）：

```ts
vi.useFakeTimers();

const wrapper = mount(CustomerEdit);
// ...修改表单，变 dirty

await vi.runAllTimersAsync();

expect(dirtyGuard.hasDirty()).toBe(false);
```

流程：

- `vi.useFakeTimers()`：
  - 把 `setTimeout` / `setInterval` 换成「可控的假定时器」
  - 真正的时间不会流逝，一切由你控制
- `vi.runAllTimersAsync()`：
  - 一次性把所有排队的定时器执行完
  - 这里就会触发：
    - `useAutoSave` 的 2000ms debounce
    - 保存函数内部的 800ms 模拟耗时
- 最终断言 dirty 被 reset 掉。

如果不用假定时器，你就得 `await new Promise(r => setTimeout(r, 3000))` 那种等，很慢。

---

### 5. 用你手上的例子串起来理解一次

以你正在看的这句为中心：

```ts
expect(wrapper.emitted("update:modelValue")).toBeTruthy();
```

假设我们写一个测试「没有脏数据时，对话框关闭应该成功」：

```ts
it("allows dialog close when clean", async () => {
  const wrapper = mount(OrderDialog, {
    props: { modelValue: true },
  });

  // 不修改任何字段，dirty 一直是 false

  await wrapper.find('[data-test="dialog-close"]').trigger("click");

  // 断言：组件对外发出了“我想把 v-model 设为 false”的事件
  expect(wrapper.emitted("update:modelValue")).toBeTruthy();
});
```

- 通过 `trigger("click")` 模拟用户点击关闭按钮；
- `beforeClose` 里看到 `dirty.isDirty` 为 false，直接调用 `done()`，也就是发事件；
- `wrapper.emitted("update:modelValue")` 不为 undefined，所以 `toBeTruthy()` 成立；
- 语义上就是：**这个组件在「干净」状态下会正常关闭**。

再配合现在的「dirty 时不关闭」测试：

```ts
it("blocks dialog close when dirty", async () => {
  vi.spyOn(window, "confirm").mockReturnValue(false);

  const wrapper = mount(OrderDialog, {
    props: { modelValue: true },
  });

  await wrapper.find('[data-test="order-title-input"]').setValue("changed");
  expect(dirtyGuard.hasDirty()).toBe(true);

  await wrapper.find('[data-test="dialog-close"]').trigger("click");

  // 断言：这次不应该发出关闭事件
  expect(wrapper.emitted("update:modelValue")).toBeFalsy();
});
```

你就有了一个完整的「干净时放行，脏时拦截」的测试对。

---
