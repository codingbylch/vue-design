import { h, Fragment, Portal } from "./h";
import render from "./render";

// const elementVNode = h( // 新旧节点的子节点都为多个子节点时
//   "div",
//   {
//     style: {
//       height: "200px",
//       background: "red",
//     },
//     class: ["cla-a"],
//     onclick: handler,
//   },
//   [h("p", null, "子节点 1"), h("p", null, "子节点 2")]
// );

// setTimeout(() => {
//   const elementVNode = h(
//     "div",
//     {
//       style: {
//         width: "100px",
//         border: "1px solid green",
//       },
//       id: "hahah",
//     },
//     [
//       h("p", null, "子节点 1"),
//       h("p", null, "子节点 2"),
//       h("p", null, "子节点 3"),
//     ]
//   );

//   render(elementVNode, document.getElementById("app"));
// }, 3000);

// const elementVNode = h("div", null, "前文本节点"); // 都为文本节点
// setTimeout(() => {
//   const elementVNode = h("div", null, "后文本节点");
//   render(elementVNode, document.getElementById("app"));
// }, 2000);

const elementVNode = h(Fragment, null, h("p", null, "旧片段子节点 1"));

setTimeout(() => {
  const elementVNode = h(Fragment, null, [
    h("p", null, "新片段子节点 1"),
    h("p", null, "新片段子节点 2"),
  ]);
  render(elementVNode, document.getElementById("app"));
}, 2000);

render(elementVNode, document.getElementById("app"));
