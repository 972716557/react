import { Dispatch, Dispatcher } from 'react/src/currentDispatcher';
import { FiberNode } from './fiber';
import internals from 'shared/internals';
import {
	UpdateQueue,
	createUpdate,
	createUpdateQueue,
	enqueueUpdate
} from './updateQueue';
import { Action } from 'shared/ReactTypes';
import { scheduleUpdateOnFiber } from './workLoop';

let currentRenderingFiber: FiberNode | null = null;
let workInProgressHook: Hook | null = null;

interface Hook {
	memorizeState: any;
	updateQueue: unknown;
	next: Hook | null;
}
const { currentDispatcher } = internals;
export function renderWithHooks(workInProgress: FiberNode) {
	// 复制操作
	currentRenderingFiber = workInProgress;
	workInProgress.memorizeState = null;
	const current = workInProgress.alternate;
	if (current !== null) {
		// update
	} else {
		currentDispatcher.current = HooksDispatcherOnMount;
	}
	const Component = workInProgress.type;
	const props = workInProgress.pendingProps;
	const children = Component(props);

	// 重置操作
	currentRenderingFiber = null;

	return children;
}

const HooksDispatcherOnMount: Dispatcher = {
	useState: mountState
};

function mountState<State>(
	initialState: (() => State) | State
): [State, Dispatch<State>] {
	// 找到当前userState对应的hook数据
	const hook = mountWorkInProgressHook();
	let memorizeState;
	if (initialState instanceof Function) {
		memorizeState = initialState();
	} else {
		memorizeState = initialState;
	}
	const queue = createUpdateQueue<State>();
	hook.updateQueue = queue;

	// @ts-ignore
	const dispatch = dispatchSetState.bind(null, currentRenderingFiber, queue);
	queue.dispatch = dispatch;
	return [memorizeState, dispatch];
}

function dispatchSetState<State>(
	fiber: FiberNode,
	updateQueue: UpdateQueue<State>,
	action: Action<State>
) {
	const update = createUpdate(action);
	enqueueUpdate(updateQueue, update);
	scheduleUpdateOnFiber(fiber);
}

function mountWorkInProgressHook(): Hook {
	const hook: Hook = {
		memorizeState: null,
		updateQueue: null,
		next: null
	};
	if (workInProgressHook === null) {
		// mount 第一个hook
		if (currentRenderingFiber === null) {
			throw new Error('请在函数组件中调用hook');
		} else {
			workInProgressHook = hook;
			currentRenderingFiber.memorizeState = workInProgressHook;
		}
	} else {
		// mount 时后续的hook
		workInProgressHook.next = hook;
		workInProgressHook = hook;
	}
	return workInProgressHook;
}
