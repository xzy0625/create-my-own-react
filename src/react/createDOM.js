import { TAG_HOST, TAG_TEXT } from "./const";

function setProp(dom, key, value) {
  // 事件处理
  if (/^on/.test(key)) {
    dom[key.toLowerCase()] = value;
  } else if (key === 'style') {
    for (let styleItem in value) {
      dom.style[styleItem] = value[styleItem];
    }
  } else {
    dom.setAttribute(key, value);
  }
}

function setProps(dom, oldProps, newProps) {
  for (let prop in oldProps) {
    console.log(prop, '老的状态');
  }

  for (let prop in newProps) {
    setProp(dom, prop, newProps[prop]);
  }
}

function updateDOM(stateNode, oldProps, newProps) {
  setProps(stateNode, oldProps, newProps)
}

export function createDOM(currentFiber) {
  if (currentFiber.tag === TAG_TEXT) {
    return document.createTextNode(currentFiber.props.text);
  } else if (currentFiber.tag === TAG_HOST) {
    let stateNode = document.createElement(currentFiber.type);
    updateDOM(stateNode, null, currentFiber.props);
    return stateNode;
  }
}
