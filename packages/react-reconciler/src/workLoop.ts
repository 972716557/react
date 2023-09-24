import { beginWork } from './beginWork';
import { commitMutationEffect } from './commitWork';
import { completeWork } from './completeWork';
import { FiberNode, FiberRootNode, createWorkProgress } from './fiber';
import { MutationMask, NoFlags } from './fiberFlags';
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
	// 这表示当前节点就是一个普通节点而不是根节点
	while (parent !== null) {
		node = parent;
		parent = node.return;
	}
	// 根节点直接返回stateNode
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
		workInProgress = null;
	} while (true);
	const finishedWork = root.current.alternate;
	root.finishedWork = finishedWork;

	commitRoot(root);
}

function commitRoot(root: FiberRootNode) {
	const finishedWork = root.finishedWork;
	if (finishedWork === null) {
		return;
	}
	if (__DEV__) {
		console.warn('commitRoot阶段开始', finishedWork);
	}

	root.finishedWork = null;

	//判断是否存在3个字阶段需要执行的操作
	// root flags root subtreeFlags
	const subtreeHasEffect =
		(finishedWork.subtreeFlags & MutationMask) !== NoFlags;
	const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;

	if (subtreeHasEffect || rootHasEffect) {
		// beforeMutation
		// mutation Placement
		commitMutationEffect(finishedWork);

		root.current = finishedWork;
		//layout
	} else {
		root.current = finishedWork;
	}
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
