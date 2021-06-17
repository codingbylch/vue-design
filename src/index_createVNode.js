import { h, Fragment, Portal } from "./h";
import { Component } from "./component";

// 普通节点
const elementVNode = h("div", null, h("span"));
console.log(elementVNode);
// 文本节点
const elementWithTextVNode = h("div", null, "我是文本");
console.log(elementWithTextVNode);
// Fragment
const fragmentVNode = h(Fragment, null, [h("h1"), h("h1")]);
console.log(fragmentVNode);
// Portal
const portalVNode = h(
  Portal,
  {
    target: "#box",
  },
  h("h1")
);
console.log(portalVNode);

// 一个函数式组件
function MyFunctionalComponent() {}
// 传递给 h 函数的第一个参数就是组件函数本身
const functionalComponentVNode = h(MyFunctionalComponent, null, h("div"));
console.log(functionalComponentVNode);

// 有状态组件
class MyStatefulComponent extends Component {}
const statefulComponentVNode = h(MyStatefulComponent, null, h("div"));
console.log(JSON.stringify(statefulComponentVNode));

let a = {
  _isVNode: true,
  flags: 4,
  data: null,
  children: {
    _isVNode: true,
    flags: 1,
    tag: "div",
    data: null,
    children: null,
    childFlags: 1,
    el: null,
  },
  childFlags: 2,
  el: null,
};
