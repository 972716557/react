export type WorkTag =
	| typeof FunctionComponent
	| typeof HostComponent
	| typeof HostRoot
	| typeof HostText;

// 函数组件
export const FunctionComponent = 0;

// root 节点
export const HostRoot = 3;

// 原生节点，比如<div></div>
export const HostComponent = 5;

// 文本类型
export const HostText = 6;
