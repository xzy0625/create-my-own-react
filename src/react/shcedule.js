/**
 * 从根节点开始调度和渲染
 * 两个阶段
 * 1. render阶段（为什么叫render阶段，因为会调用组件的render函数哈哈哈）  -- diff阶段，在这个阶段我们将一个大任务拆成了很多个的小任务，每个小任务按顺序执行就好啦，可暂停
 *    render阶段的成果是根据虚拟dom生成fiber数，并且会生成一个effectList，通过一个链来记录哪个节点更新/删除/增加啦
 * 2. commit阶段  -- 渲染阶段，不能够暂停
 */

import { PLACEMENT, TAG_HOST, TAG_ROOT, TAG_TEXT } from "./const";
import { reconcileChildren } from './reconcile';
import { createDOM } from './createDOM'

let nextUnitOfWork = null; // render阶段中的下一个执行单元
let workInProgressRoot = null; // 当前活动的rootFiber

// 调度
function scheduleRoot(rootFieber) {
  nextUnitOfWork = rootFieber;
  workInProgressRoot = rootFieber;
}

// 因为root已经有dom节点了 container，所以只有创建fiber就行啦
function updateHostRoot(currentFiber) {
  // 更新根Rootfiber
  reconcileChildren(currentFiber);
}

// 创建文本节点,文本节点不需要创建子fiber了，因为没有
function updateHostText(currentFiber) {
  // 没有节点，首次挂载
  if (!currentFiber.stateNode) {
    currentFiber.stateNode = createDOM(currentFiber);
  }
}

function updateHost(currentFiber) {
  // 没有节点，首次挂载
  if (!currentFiber.stateNode) {
    currentFiber.stateNode = createDOM(currentFiber);
  }

  // 创建子fiber
  reconcileChildren(currentFiber);
}

// 开始执行一个任务单元(fiber)
/**
 * 1. 创建真实的DOM元素
 * 2. 创建子fiber，并将子fiber和当前fiber建立联系
 */
function beginWork(currentFiber) {
  if (currentFiber.tag === TAG_ROOT) {
    updateHostRoot(currentFiber)
  } else if (currentFiber.tag === TAG_TEXT) {
    updateHostText(currentFiber);
  } else if (currentFiber.tag === TAG_HOST) {
    updateHost(currentFiber);
  }
}

// 完成工作
function completeUnitOfWork (currentFiber) {
  let returnFiber = currentFiber.return;

  if (returnFiber) {
    // 先处理自己的子fiber
    if (currentFiber.firstEffect) {
      // 没有就把自己的firstEffect挂上去
      if (!returnFiber.firstEffect) {
        returnFiber.firstEffect = currentFiber.firstEffect;
      }
    }

    if (currentFiber.lastEffect) {
      // 父没有就指向他的最后
      if (returnFiber.lastEffect) {
        // 父亲已经有effct链链就把当前子节点构建的effect链加入到父亲中去
        returnFiber.lastEffect.nextEffect = currentFiber.firstEffect;
      }

      // 改变父亲的lastEffect
      returnFiber.lastEffect = currentFiber.lastEffect;
    }

    // 再处理自己
    if (currentFiber.effectTag) {
      // 更新effect尾部为自己
      if (returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = currentFiber;
      }
      returnFiber.lastEffect = currentFiber;

      // 第一次没有firstEffect
      if (!returnFiber.firstEffect) {
        returnFiber.firstEffect = currentFiber;
      }
    }
  }
}

// 执行nextUnitOfWork并返回下一个nextUnitOfWork
/**
 * beginWork创建fiber complete创建effect
 */
function performUnitOfWork(currentFiber) {
  // 开始
  beginWork(currentFiber);

  // 先访问儿子
  if (currentFiber.child) {
    return currentFiber.child;
  }

  // 创建子fiber之间的关系
  while(currentFiber) {
    completeUnitOfWork(currentFiber)

    // 访问兄弟节点
    if (currentFiber.sibling) {
      return currentFiber.sibling;
    }

    // 都没有就访问叔叔（先访问爸爸，下一个while的时候会访问if (currentFiber.sibling) {}，就访问到叔叔了
    currentFiber = currentFiber.return;
  }
}

function commitWork(currentFiber) {
  if (!currentFiber) {
    return;
  }

  let returnFiber = currentFiber.return;
  
  // 挂载
  if (currentFiber.effectTag === PLACEMENT) {
    // 并且有节点
    if (currentFiber.stateNode) {
      returnFiber.stateNode.appendChild(currentFiber.stateNode);
    }
  }

  currentFiber.effectTag = null;
}

// commit阶段，主要执行相关的生命周期函数，将数据渲染到页面，重置数据。这个过程一定是同步的
function commitRoot() {
  if (!workInProgressRoot) {
    return
  }

  let currentFiber = workInProgressRoot.firstEffect; // 通过effectList去提交数据

  while(currentFiber) {
    // console.log(currentFiber.type, currentFiber.props.id, currentFiber.props.text, '??...')
    commitWork(currentFiber);
    // 找到下一个副作用
    currentFiber = currentFiber.nextEffect;
  }

  // 重置当前的构建树
  workInProgressRoot = null;
}

// 循环执行nextUnitOfWork
function workLoop(deadline) { // dealine为requestIdleCallback的参数
  // 是否需要让出时间片，默认为false，因为每次requestIdleCallback肯定是有时间的
  let shouldYield = false;
  // 这一个while创建子fiber，下一个while执行就可以访问到了
  while(nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)

    shouldYield = deadline.timeRemaining() < 0; // 当前帧是否还有剩余时间
  }

  // 没有任务说明render阶段已经结束啦
  if (!nextUnitOfWork && workInProgressRoot) {
    console.log('render阶段结束')
    commitRoot(); // commit阶段
  } else {
    window.requestIdleCallback(workLoop, { timeout: 500 });
  }
}

// 请求浏览器在空闲的时候调度我们的workLoop，兼容性不好 可以用messageChannels来polyfill
// react中有一个expirationTime的概念，优先级相关 /**重要 */
window.requestIdleCallback(workLoop, { timeout: 500 });

export default scheduleRoot;
