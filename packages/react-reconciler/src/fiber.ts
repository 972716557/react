import { Key, Props, Ref } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';

export class FiberNode {
	type: any;
	tag: WorkTag;
	pendingProps: Props;
	memoizedProps: Props | null;
	key: Key;
	stateNode: any;
	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	ref: Ref;
	index: number;
	alternate: FiberNode | null;
	flags: Flags;
	updateQueue: unknown;
	memoizedSate: any;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// 组件类型
		this.tag = tag;

		this.key = key;

		// 函数组件的方法，或者类组件的实例
		this.type = null;

		// dom <div></div>
		this.stateNode = null;

		// 指向父组件fiberNode
		this.return = null;

		// 兄弟节点
		this.sibling = null;

		// 子节点
		this.child = null;

		this.ref = null;

		// 元素节点位置，没有key的时候diff取的就是这个
		this.index = 0;

		// 刚开始的props
		this.pendingProps = pendingProps;

		// 工作完之后的props
		this.memoizedProps = null;

		// 缓存的fiberNode，跟渲染的fiberNode进行替换
		this.alternate = null;

		this.flags = NoFlags;
		this.updateQueue = null;

		this.memoizedSate = null;
	}
}

export class FiberRootNode {
	container: Container;
	current: FiberNode;
	// 完成递归之后的fiber
	finishedWork: FiberNode | null;
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
	}
}

// 双缓存技术中的另一颗fiber
export const createWorkProgress = (
	current: FiberNode,
	pendingProps: Props
): FiberNode => {
	let workInProgress = current.alternate;
	// mount 的时候只存在一颗树
	if (workInProgress === null) {
		workInProgress = new FiberNode(current.tag, pendingProps, current.key);
		workInProgress.type = current.type;
		workInProgress.stateNode = current.stateNode;
		workInProgress.alternate = current;
		current.alternate = workInProgress;
	} else {
		workInProgress.pendingProps = pendingProps;
		workInProgress.flags = NoFlags;
	}
	workInProgress.type = current.type;
	workInProgress.updateQueue = current.updateQueue;
	workInProgress.child = current.child;
	workInProgress.memoizedProps = current.memoizedProps;
	workInProgress.memoizedSate = current.memoizedSate;
	return workInProgress;
};
