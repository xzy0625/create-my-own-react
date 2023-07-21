import { PLACEMENT, TAG_HOST, TAG_TEXT, TEXT_NODE } from "./const";

// 协调孩子节点，生成孩子的fiber
export function reconcileChildren (currentFiber) {
  // 
  const children = currentFiber.props.children;
  let prevSibling = null;
  let childIndex = 0;

  while (childIndex < children.length) {
    // 某一个孩子
    let newChild = children[childIndex];
    let tag;

    // 文本类型，这里要设置fiber的tag
    if (newChild.type === TEXT_NODE) {
      tag = TAG_TEXT;
    } else if (typeof newChild.type === 'string') {
      tag = TAG_HOST; // 原生DOM类型
    }

    // 创建子fiber
    let newFiber = {
      tag,
      type: newChild.type,
      props: newChild.props,
      stateNode: null,
      return: currentFiber, // 父亲为currentFiber
      effectTag: PLACEMENT, // 副作用为替换，源码中mounte阶段只用挂载一次
      nextEffect: null, // 下一个副作用
    }

    if (childIndex === 0) {
      currentFiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    childIndex += 1;
  }
}
