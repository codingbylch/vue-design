import { MyComponent, MyFunctionalComponent } from "./component";
import { h, Fragment, Portal } from "./h";
import render from "./render";

// const elementVNode = h(
//   "div",
//   {
//     style: {
//       height: "100px",
//       width: "100px",
//       background: "red",
//     },
//     onclick: handler,
//     class: ["cla-a cla-b", ["class-b", "class-c"], { aaa: "aaa", bbb: "bbb" }],
//     type: "checkbox",
//     checked: true,
//     custom: "1",
//   },
//   [
//     h("div", {
//       style: {
//         height: "50px",
//         width: "50px",
//         background: "green",
//       },
//     }),
//     h("div", null, "文本节点"),
//   ]
// );

// const elementVNode = h(
//   "div",
//   {
//     style: {
//       height: "100px",
//       width: "100px",
//       background: "red",
//     },
//   },
//   "我是文本"
// );

// const elementVNode = h(Fragment, null, "");
// const elementVNode = h(
//   Portal,
//   {
//     target: "div",
//   },
//   [
//     h("div", {
//       style: {
//         height: "50px",
//         width: "50px",
//         background: "green",
//       },
//     }),
//     h("div", null, "文本节点"),
//   ]
// );

// const elementVNode = h(
//   "div",
//   {
//     style: {
//       height: "100px",
//       width: "100px",
//       background: "red",
//     },
//   },
//   h(Portal, { target: "#portal-box" }, [
//     h("span", null, "我是标题1......"),
//     h("span", null, "我是标题2......"),
//   ])
// );

// const elementVNode = h(MyComponent); // 传入的tag为类组件MyComponent，属于函数，则创建vue3的类组件

// const elementVNode = h(MyFunctionalComponent) // 函数式组件



render(elementVNode, document.getElementById("app"));

function handler() {
  alert("click me");
}

// data、props、ref 或者 slots 等等是为render函数生成VNode的过程中提供数据的来源
// 而组件产出VNode才是核心

// 为什么说函数式组件的性能更好些？对比类式组件，函数式组件只需props、slots
