export const TEXT_NODE = Symbol('TEXT_NODE'); // 文本节点

// react应用的一个根 Fiber
export const TAG_ROOT = Symbol("TAG_ROOT");
// 原生的节点 比如 span div p
export const TAG_HOST = Symbol("TAG_HOST");
// 文本节点
export const TAG_TEXT = Symbol("TAG_TEXT");

// 插入节点, effectTag，源码中是通过二进制来实现的
export const PLACEMENT = Symbol("PLACEMENT");
export const UPDATE = Symbol("UPDATE");
export const DELETE = Symbol("DELETE");