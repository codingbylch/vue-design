import { VNodeFlags, ChildrenFlags } from "./flags";
import { createTextVNode } from "./h";

export default function render(vnode, container) {
  const prevVNode = container.vnode;
  if (prevVNode == null) {
    if (vnode) {
      // 没有旧的 VNode，使用 `mount` 函数挂载全新的 VNode
      mount(vnode, container);
      // 将新的 VNode 添加到 container.vnode 属性下，这样下一次渲染时旧的 VNode 就存在了
      container.vnode = vnode;
    }
  } else {
    if (vnode) {
      // 有旧的 VNode，则调用 `patch` 函数打补丁
      patch(prevVNode, vnode, container);
      // 更新 container.vnode
      container.vnode = vnode;
    } else {
      // 有旧的 VNode 但是没有新的 VNode，这说明应该移除 DOM，在浏览器中可以使用 removeChild 函数。
      container.removeChild(prevVNode.el);
      container.vnode = null;
    }
  }
}

function mount(vnode, container, isSVG) {
  const { flags } = vnode;
  if (flags & VNodeFlags.ELEMENT) {
    // 挂载普通标签
    mountElement(vnode, container, isSVG);
  } else if (flags & VNodeFlags.COMPONENT) {
    // 挂载组件
    mountComponent(vnode, container, isSVG);
  } else if (flags & VNodeFlags.TEXT) {
    // 挂载纯文本
    mountText(vnode, container);
  } else if (flags & VNodeFlags.FRAGMENT) {
    // 挂载 Fragment
    mountFragment(vnode, container, isSVG);
  } else if (flags & VNodeFlags.PORTAL) {
    // 挂载 Portal
    mountPortal(vnode, container, isSVG);
  }
}

const domPropsRE = /\[A-Z]|^(?:value|checked|selected|muted)$/;
function mountElement(vnode, container, isSVG) {
  isSVG = isSVG || vnode.flags & VNodeFlags.ELEMENT_SVG; // 严谨地处理 SVG 标签
  const el = isSVG
    ? document.createElementNS("http://www.w3.org/2000/svg", vnode.tag)
    : document.createElement(vnode.tag);
  vnode.el = el;
  const data = vnode.data;
  if (data) {
    for (let key in data) {
      switch (key) {
        case "style":
          for (let k in data.style) {
            el.style[k] = data.style[k];
          }
          break;
        case "class":
          el.className = data[key];
          break;
        default:
          if (key[0] === "o" && key[1] === "n") {
            // 事件
            el.addEventListener(key.slice(2), data[key]);
          } else if (domPropsRE.test(key)) {
            // DOM Prop
            el[key] = data[key];
          } else {
            // DOM Attr
            el.setAttribute(key, data[key]);
          }
          break;
      }
    }
  }

  const childFlags = vnode.childFlags;
  const children = vnode.children;
  if (childFlags !== ChildrenFlags.NO_CHILDREN) {
    if (childFlags & ChildrenFlags.SINGLE_VNODE) {
      // 将svg传递下去
      mount(children, el, isSVG);
    } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
      for (let i = 0; i < children.length; i++) {
        mount(children[i], el, isSVG);
      }
    }
  }

  container.appendChild(el);
}

function mountText(vnode, container) {
  const el = document.createTextNode(vnode.children);
  vnode.el = el;
  container.appendChild(el);
}

function mountFragment(vnode, container, isSVG) {
  const { childFlags, children } = vnode;
  if (childFlags !== ChildrenFlags.NO_CHILDREN) {
    if (childFlags & ChildrenFlags.SINGLE_VNODE) {
      // 将svg传递下去
      mount(children, container, isSVG);
      vnode.el = children.el;
    } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
      for (let i = 0; i < children.length; i++) {
        mount(children[i], container, isSVG);
      }
      vnode.el = children[0].el;
    }
  } else {
    const placeholder = createTextVNode("");
    mountText(placeholder, container);
    vnode.el = placeholder.el;
  }
  console.log("fragment vnode", vnode);
}

function mountPortal(vnode, container, isSVG) {
  const { childFlags, children, tag } = vnode;
  // 获取挂载点
  const target = typeof tag === "string" ? document.querySelector(tag) : tag;

  if (childFlags !== ChildrenFlags.NO_CHILDREN) {
    if (childFlags & ChildrenFlags.SINGLE_VNODE) {
      // 将svg传递下去
      mount(children, target, isSVG);
    } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
      for (let i = 0; i < children.length; i++) {
        mount(children[i], target, isSVG);
      }
    }
  }
  // 设置Portal的vnode.el，使其指向一个空文本节点
  const placeholder = createTextVNode("");
  mountText(placeholder, container);
  vnode.el = placeholder.el;
  console.log("Portal vnode", vnode);
}

function mountComponent(vnode, container, isSVG) {
  const { flags } = vnode;
  if (flags & VNodeFlags.COMPONENT_STATEFUL) {
    // 有状态组件
    mountStatefulComponent(vnode, container, isSVG);
  } else {
    // 函数式组件
    mountFunctionalComponent(vnode, container, isSVG);
  }
}

function mountStatefulComponent(vnode, container, isSVG) {
  // 创建组件实例
  const instance = new vnode.tag(); // tag是传入的函数，即组件类的引用MyComponent，new调用则生成一个实例
  // 渲染VNode
  instance.$vnode = instance.render(); // 此render是组件里的render方法，返回vnode
  // 挂载
  mount(instance.$vnode, container, isSVG);
  // el 属性值 和 组件实例的 $el 属性都引用组件的根DOM元素
  instance.$el = vnode.el = instance.$vnode.el;
}

function mountFunctionalComponent(vnode, container, isSVG) {
  // 调用函数返回vnode
  const $vnode = vnode.tag();
  // 挂载
  mount($vnode, container, isSVG);
  // el 元素引用该组件的根元素
  vnode.el = $vnode.el;
}
