import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNode, FiberRootNode, createWorkProgress } from './fiber';
import { HostRoot } from './workTags';

let workInProgress: FiberNode | null = null;

function prepareFreshStack(root: FiberRootNode) {
	workInProgress = createWorkProgress(root.current, {});
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
	//调度功能
	const root = markUpdateFromFiberOnFiber(fiber);
	renderRoot(root);
}

function markUpdateFromFiberOnFiber(fiber: FiberNode) {
	let node = fiber;
	let parent = node.return;
	// 这表示当前节点就是一个普通节点，因为跟节点的父节点是null
	while (parent !== null) {
		node = parent;
		parent = node.return;
	}
	if (node.tag === HostRoot) {
		return node.stateNode;
	}
	return null;
}

function renderRoot(root: FiberRootNode) {
	// 初始化指向第一个fiberNode
	prepareFreshStack(root);

	do {
		try {
			workLoop();
			break;
		} catch (e) {
			console.warn('workLoop发生错误');
		}
	} while (true);
}

function workLoop() {
	while (workInProgress !== null) {
		preformUnitOfWork(workInProgress);
	}
}
function preformUnitOfWork(fiber: FiberNode) {
	const next = beginWork(fiber);
	fiber.memoizedProps = fiber.pendingProps;
	if (next === null) {
		completeUnitOfWork(fiber);
	} else {
		workInProgress = next;
	}
}

function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber;
	do {
		completeWork(node);
		const sibling = node.sibling;
		if (sibling !== null) {
			workInProgress = sibling;
			return;
		}
		node = node.return;
		workInProgress = node;
	} while (node !== null);
}
