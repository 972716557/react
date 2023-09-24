import {
	Container,
	appendInitialChild,
	createInstance,
	createTextInstance
} from 'hostConfig';
import { FiberNode } from './fiber';
import { HostComponent, HostRoot, HostText } from './workTags';
import { NoFlags } from './fiberFlags';

// 递归中的归阶段
export const completeWork = (workInProgress: FiberNode) => {
	const newProps = workInProgress.pendingProps;
	const current = workInProgress.alternate;
	switch (workInProgress.tag) {
		case HostComponent:
			if (current !== null && workInProgress.stateNode) {
				// update
			} else {
				// 1.构建DOM
				// const instance = createInstance(workInProgress.type, newProps);
				const instance = createInstance(workInProgress.type);
				// 2.将DOM插入DOM树中
				appendAllChildren(instance, workInProgress);
				workInProgress.stateNode = instance;
			}
			bubbleProperties(workInProgress);
			return null;
		case HostText:
			if (current !== null && workInProgress.stateNode) {
				// update
			} else {
				// 1.构建DOM
				const instance = createTextInstance(newProps.content);
				// 没有子节点，所以不需要遍历
				workInProgress.stateNode = instance;
			}
			bubbleProperties(workInProgress);
			return null;
		case HostRoot:
			bubbleProperties(workInProgress);
			return null;
		default:
			if (__DEV__) {
				console.warn('未处理的completeWork情况', workInProgress);
			}
			break;
	}
};

function appendAllChildren(parent: Container, workInProgress: FiberNode) {
	// 从下往上递归，先找child，如有一直往下，没有找兄弟节点，还没有就返回父亲，
	// 如果父亲跟最开始传入的fiber是一样的，就表明全部渲染完成
	let node = workInProgress.child;
	while (node !== null) {
		if (node?.tag === HostComponent || node.tag === HostText) {
			appendInitialChild(parent, node?.stateNode);
		} else if (node.child !== null) {
			node.child.return = node;
			node = node.child;
			continue;
		}
		if (node === workInProgress) {
			return;
		}
		while (node.sibling === null) {
			if (node.return === null || node.return === workInProgress) {
				return;
			}
			node = node.return;
		}

		node.sibling.return = node.return;
		node = node.sibling;
	}
}

function bubbleProperties(workInProgress: FiberNode) {
	// 将所有子节点是否要更新的操作都集成到父节点中，这样可以在渲染的时候直接判断父节点的flag，
	// 来判断当前的树下是否有节点需要更新，有flag则更新，反之不更新，不用全部遍历所有的树
	let subtreeFlags = NoFlags;
	let child = workInProgress.child;
	while (child !== null) {
		subtreeFlags |= child.subtreeFlags;
		subtreeFlags |= child.flags;
		child.return = workInProgress;
		child = child.sibling;
	}
	workInProgress.subtreeFlags |= subtreeFlags;
}
