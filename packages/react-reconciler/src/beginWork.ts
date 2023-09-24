// 递归中的递阶段

import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import { UpdateQueue, processUpdateQueue } from './updateQueue';
import { HostComponent, HostRoot, HostText } from './workTags';
import { mountChildFibers, reconcileChildFibers } from './childFiber';

export const beginWork = (workInProgress: FiberNode): FiberNode | null => {
	// 比较然后再返回 “子fiberNode”
	switch (workInProgress.tag) {
		case HostRoot:
			return updateHostRoot(workInProgress);
		case HostComponent:
			return updateHostComponent(workInProgress);
		case HostText:
			return null;
		default:
			if (__DEV__) {
				console.warn('beginWork未实现的类型');
			}
			break;
	}
	return null;
};
function updateHostRoot(workInProgress: FiberNode) {
	const baseState = workInProgress.memoizedSate;
	const updateQueue = workInProgress.updateQueue as UpdateQueue<Element>;
	const pending = updateQueue.shared.pending;
	updateQueue.shared.pending = null;
	const { memoizedState } = processUpdateQueue(baseState, pending);
	workInProgress.memoizedSate = memoizedState;
	const nextChildren = workInProgress.memoizedSate;
	reconcileChildren(workInProgress, nextChildren);
	return workInProgress.child;
}

function updateHostComponent(workInProgress: FiberNode) {
	const nextProps = workInProgress.pendingProps;
	const nextChildren = nextProps.children;
	reconcileChildren(workInProgress, nextChildren);
	return workInProgress.child;
}

// 递归的递阶段
function reconcileChildren(
	workInProgress: FiberNode,
	children?: ReactElementType
) {
	// 获取双缓存树的旧树
	const current = workInProgress.alternate;

	if (current !== null) {
		// 更新
		workInProgress.child = reconcileChildFibers(
			workInProgress,
			current?.child,
			children
		);
	} else {
		// 初次挂载, 因为第一次挂在每一个placement都是插入，所以不用每一次都执行placement，统一在父节点就好
		workInProgress.child = mountChildFibers(workInProgress, null, children);
	}
}
