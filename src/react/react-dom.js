import { TAG_ROOT } from "./const";
import scheduleRoot from "./shcedule";

// 把element渲染到container内部
function render(element, container) {
  let rootFiber = {
    tag: TAG_ROOT, // Fiber架构树的根节点，项目中指代的是 <div id="root"></div>
    stateNode: container, // stateNode指向真实的DOM元素
    props: { children: [element] }, //Fiber 的props属性下的children 存放要渲染的元素element
  };

  scheduleRoot(rootFiber);
}

const ReactDom = {
  render,
}

export default ReactDom;