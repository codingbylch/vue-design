import { h } from "./h";
export class Component {
  render() {
    throw "组件缺少render函数";
  }
}

export class MyComponent extends Component {
  render() {
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
