import { h } from "./h";
export class Component {
  render() {
    throw "组件缺少render函数";
  }
}

export class MyComponent extends Component {
  localState = "one";

  mounted() {
    // 有状态组件的主动更新，即组件自己调用钩子函数进行的更新（钩子函数其实就是回调函数）
    setTimeout(() => {
      this.localState = "two";
      this._update();
    }, 2000);
  }
  render() {
    return h(
      "div",
      {
        style: {
          background: "green",
        },
      },
      [
        h("span", null, this.localState),
        h("span", null, "我是组件的标题2......"),
      ]
    );
  }
}

export class ParentComponent {
  localState = "父组件的数据";

  render() {
    const childCompVNode = h(ChildComponent, {
      text: this.localState,
    });
    return childCompVNode;
  }
}

export class ChildComponent {
  render() {
    // 子组件实例可通过this.$props访问到父组件传递过来的数据
    return h("div", null, this.$props.text);
  }
}

export function MyFunctionalComponent() {
  return h(
    "div",
    {
      style: {
        background: "green",
      },
    },
    [
      h("span", null, "我是组件的标题1......"),
      h("span", null, "我是组件的标题2......"),
    ]
  );
}
