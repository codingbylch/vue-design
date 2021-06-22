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
  // 创建标签
  isSVG = isSVG || vnode.flags & VNodeFlags.ELEMENT_SVG; // 严谨地处理 SVG 标签
  const el = isSVG
    ? document.createElementNS("http://www.w3.org/2000/svg", vnode.tag)
    : document.createElement(vnode.tag);
  vnode.el = el;
  // 处理data
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
          if (isSVG) {
            el.setAttribute("class", data[key]);
          } else {
            el.className = data[key];
          }
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
  // 处理children
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

function patch(prevVNode, nextVNode, container) {
  const nextFlags = nextVNode.flags;
  const prevFlags = prevVNode.flags;

  // 比较新旧节点类型是否相同, 不同则直接替换
  // 类型相同则根据不同类型调用不同的比对函数
  if (nextFlags !== prevFlags) {
    replaceVNode(prevVNode, nextVNode, container);
  } else if (nextFlags & VNodeFlags.ELEMENT) {
    patchElement(prevVNode, nextVNode, container);
  } else if (nextFlags & VNodeFlags.COMPONENT) {
    patchComponent(prevVNode, nextVNode, container);
  } else if (nextFlags & VNodeFlags.TEXT) {
    patchText(prevVNode, nextVNode);
  } else if (nextFlags & VNodeFlags.FRAGMENT) {
    patchFragment(prevVNode, nextVNode, container);
  } else if (nextFlags & VNodeFlags.PORTAL) {
    patchPortal(prevVNode, nextVNode);
  }
}

function replaceVNode(prevVNode, nextVNode, container) {
  // 将旧的 VNode 所渲染的 DOM 从容器中移除
  container.removeChild(prevVNode.el);
  // 再把新的 VNode 挂载到容器中
  mount(nextVNode, container);
}

function patchElement(prevVNode, nextVNode, container) {
  // 有一些元素标签都不同，直接调用replaceVNode
  if (prevVNode.tag !== nextVNode.tag) {
    prevVNode, nextVNode, container;
    return;
  }
  // 标签相同，则继续比较VNode.data VNode.children
  const el = (nextVNode.el = prevVNode.el);
  const prevData = prevVNode.data;
  const nextData = nextVNode.data;

  // 比较新旧节点的data
  if (nextData) {
    // 遍历新vnode，添加新属性，修改旧属性
    for (let key in nextData) {
      const prevValue = prevData[key];
      const nextValue = nextData[key];
      patchData(el, key, prevValue, nextValue);
    }
  }
  if (prevData) {
    // 遍历旧vnode的data，去除新vnode中不存在但旧vnode存在的属性
    for (let key in prevData) {
      const prevValue = prevData[key];
      if (prevValue && !nextData.hasOwnProperty(key)) {
        patchData(el, key, prevValue, null);
      }
    }
  }

  // 新旧节点的children同层级比较，递归地更新子节点
  patchChildren(
    prevVNode.childFlags, // 旧的 VNode 子节点的类型
    nextVNode.childFlags, // 新的 VNode 子节点的类型
    prevVNode.children, // 旧的 VNode 子节点
    nextVNode.children, // 新的 VNode 子节点
    el // 当前标签元素，即这些子节点的父节点
  );
}

function patchData(el, key, prevValue, nextValue) {
  switch (key) {
    case "style":
      for (let k in nextValue) {
        el.style[k] = nextValue[k];
      }
      for (let k in prevValue) {
        if (!nextValue.hasOwnProperty(k)) {
          el.style[k] = "";
        }
      }
      break;
    case "class":
      el.className = nextValue ?? "";
      break;
    default:
      if (key[0] === "o" && key[1] === "n") {
        // 事件
        if (prevValue) {
          el.removeEventListener(key.slice(2), prevValue);
        }
        if (nextValue) {
          el.addEventListener(key.slice(2), nextValue);
        }
      } else if (domPropsRE.test(key)) {
        // DOM Prop
        el[key] = nextValue;
      } else {
        // DOM Attr
        el.setAttribute(key, nextValue);
      }
      break;
  }
}

function patchChildren(
  prevChildFlags,
  nextChildFlags,
  prevChildren,
  nextChildren,
  container
) {
  console.log("container", container);
  switch (prevChildFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          patch(prevChildren, nextChildren, container);
          break;
        case ChildrenFlags.NO_CHILDREN:
          container.removeChild(prevChildren.el);
          break;
        default:
          container.removeChild(prevChildren.el);
          for (let i = 0; i < nextChildren.length; i++) {
            mount(nextChildren[i], container);
          }
          break;
      }
      break;

    case ChildrenFlags.NO_CHILDREN:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          mount(nextChildren, container);
          break;
        case ChildrenFlags.NO_CHILDREN:
          break;
        default:
          for (let i = 0; i < nextChildren.length; i++) {
            mount(nextChildren[i], container);
          }
          break;
      }
      break;

    default:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          for (let i = 0; i < prevChildren.length; i++) {
            container.removeChild(prevChildren[i].el);
          }
          mount(nextChildren, container);
          break;
        case ChildrenFlags.NO_CHILDREN:
          for (let i = 0; i < prevChildren.length; i++) {
            container.removeChild(prevChildren[i].el);
          }
          break;
        default:
          // 核心：Diff算法，新旧节点的子节点都是多个子节点时
          // 若采用将旧节点全移除，新节点全添加，就没有复用可言
          console.log("container", container);
          for (let i = 0; i < prevChildren.length; i++) {
            container.removeChild(prevChildren[i].el);
          }
          for (let i = 0; i < nextChildren.length; i++) {
            mount(nextChildren[i], container);
          }
          break;
      }
      break;
  }
}

function patchText(prevVNode, nextVNode) {
  if (nextVNode.children !== prevVNode.children) {
    const el = (nextVNode.el = prevVNode.el);
    el.nodeValue = nextVNode.children;
  }
}

function patchFragment(prevVNode, nextVNode, container) {
  // 直接调用 patchChildren 函数更新 新旧片段的子节点即可
  patchChildren(
    prevVNode.childFlags, // 旧片段的子节点类型
    nextVNode.childFlags, // 新片段的子节点类型
    prevVNode.children, // 旧片段的子节点
    nextVNode.children, // 新片段的子节点
    container
  );
  // 更新el属性
  switch (nextVNode.childFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      nextVNode.el = nextVNode.children.el;
      break;
    case ChildrenFlags.NO_CHILDREN:
      nextVNode.el = prevVNode.el;
      break;
    default:
      nextVNode.el = nextVNode.children[0].el;
      break;
  }
}

function patchPortal(prevVNode, nextVNode) {
  // 先更新children，暂时让挂载目标不变
  patchChildren(
    prevVNode.childFlags, // 旧片段的子节点类型
    nextVNode.childFlags, // 新片段的子节点类型
    prevVNode.children, // 旧片段的子节点
    nextVNode.children, // 新片段的子节点
    prevVNode.tag
  );
  nextVNode.el = prevVNode.el; // 对应的真实占位文本节点不变

  // 新旧容器的挂载点不同，才搬运
  if (prevVNode.tag !== nextVNode.tag) {
    const container =
      typeof nextVNode.tag === "string"
        ? document.querySelector(nextVNode.tag)
        : nextVNode.tag;
    switch (nextVNode.childFlags) {
      case ChildrenFlags.SINGLE_VNODE:
        container.appendChild(nextVNode.children.el);
        break;
      case ChildrenFlags.NO_CHILDREN:
        break;
      default:
        for (let i = 0; i < nextVNode.children.length; i++) {
          container.appendChild(nextVNode.children[i].el);
        }
        break;
    }
  }
}
