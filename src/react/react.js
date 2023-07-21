/**
 * babel编译之后得到的对象如下，可以自行打印查看
 * {
    "type": "div",
    "key": null,
    "ref": null,
    "props": {
        "id": "A",
        "style": {
            "color": "red",
            "border": "red solid 1px",
            "width": "300px"
        },
        "children": [
            "A1",
            {
                "type": "div",
                "key": null,
                "ref": null,
                "props": {
                    "id": "B1",
                    "style": {
                        "color": "red",
                        "border": "red solid 1px",
                        "width": "300px"
                    },
                    "children": []
                },
                "_owner": null,
                "_store": {}
            },
        ]
    },
    "_owner": null,
    "_store": {}
}
 */

import { TEXT_NODE } from "./const";

// 使用...可以保证children始终是一个数组
const createElement = (type, config, ...children) => {
  delete config.__self;
  delete config.__source; // 表示在文件哪一行哪一列

  return {
    type,
    props: {
      ...config,
      children: children.map((item) =>
        typeof item === "object" ? item : createTextElement(item)
      ),
    },
  };
};

// 创建文本节点，因为对于普通字符他不是一个对象，需要我们特殊处理
const createTextElement = (text) => {
  return {
    type: TEXT_NODE,
    props: {
      text,
      children: [],
    },
  };
};

const React = {
  createElement,
};

export default React;
