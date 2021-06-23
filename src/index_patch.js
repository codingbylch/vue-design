import { h, Fragment, Portal } from "./h";
import render from "./render";
import {
  MyComponent,
  MyFunctionalComponent,
  ParentComponent,
} from "./component";

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

// const elementVNode = h(Fragment, null, h("p", null, "旧片段子节点 1"));

// setTimeout(() => {
//   const elementVNode = h(Fragment, null, [
//     h("p", null, "新片段子节点 1"),
//     h("p", null, "新片段子节点 2"),
//   ]);
//   render(elementVNode, document.getElementById("app"));
// }, 2000);

// const elementVNode = h(Portal, { target: "#old-container" }, [
//   h("div", {
//     style: {
//       height: "100px",
//       width: "50px",
//       background: "red",
//     },
//   }),
//   h("div", null, "旧文本节点"),
// ]);

// setTimeout(() => {
//   const elementVNode = h(Portal, { target: "#new-container" }, [
//     h("div", {
//       style: {
//         height: "50px",
//         width: "50px",
//         background: "green",
//       },
//     }),
//     h("div", null, "新文本节点"),
//   ]);

//   render(elementVNode, document.getElementById("app"));
// }, 2000);

// render(elementVNode, document.getElementById("app"));

// ---------------------------------------------------

// // 旧的 VNode
// const prevVNode = h(
//   Portal,
//   { target: '#old-container' },
//   h('p', null, '旧的 Portal')
// )

// // 新的 VNode
// const nextVNode = h(
//   Portal,
//   { target: '#new-container' },
//   h('p', null, '新的 Portal')
// )

// render(prevVNode, document.getElementById('app'))

// // 2秒后更新
// setTimeout(() => {
//   render(nextVNode, document.getElementById('app'))
// }, 2000)

// const elementVNode = h(MyComponent);
// const elementVNode = h(ParentComponent);

// ---------------------------------------------------

// class ChildComponent_1 {
//   render() {
//     return h("div", null, "子组件1");
//   }
//   unmounted() {
//     console.log("c1");
//   }
// }

// class ChildComponent_2 {
//   render() {
//     return h("div", null, "子组件2");
//   }
//   unmounted() {
//     console.log("c2");
//   }
// }
// class ParentComponent_1 {
//   isTrue = true;

//   render() {
//     return this.isTrue ? h(ChildComponent_1) : h(ChildComponent_2);
//   }
//   mounted() {
//     setTimeout(() => {
//       this.isTrue = false;
//       console.log("this.isTrue", this.isTrue);
//       this._update();
//     }, 2000);
//   }
//   unmounted() {
//     console.log("p1");
//   }
// }

// const elementVNode = h(ParentComponent_1);

// render(elementVNode, document.getElementById("app"));

// ---------------------------------------------------

// function MyFunctionalComp(props) {
//   return h("div", null, props.text);
// }

// class ParentComponent_3 {
//   localState = "one";

//   mounted() {
//     setTimeout(() => {
//       this.localState = "two";
//       this._update();
//     }, 2000);
//   }
//   render() {
//     return h(MyFunctionalComp, {
//       text: this.localState,
//     });
//   }
// }
// // 有状态组件 VNode
// const compVNode = h(ParentComponent_3);
// render(compVNode, document.getElementById("app"));

// ---------------------------------------------------

const elementVNode = h("ul", null, [
  h("li", { key: "a" }, 1),
  h("li", { key: "b" }, 2),
  h("li", { key: "c" }, 3),
]);

render(elementVNode, document.getElementById("app"));

setTimeout(() => {
  const elementVNode = h("ul", null, [
    h("li", { key: "d" }, 4),
    h("li", { key: "a" }, 1),
    // h("li", { key: "b" }, 2),
    h("li", { key: "c" }, 3),
  ]);
  render(elementVNode, document.getElementById("app"));
}, 2000);
