import { jsxDEV } from './src/jsx';
import currentDispatcher, {
	Dispatcher,
	resolveDispatcher
} from './src/currentDispatcher';
export const useState: Dispatcher['useState'] = (initialState) => {
	const dispatcher = resolveDispatcher();
	return dispatcher.useState(initialState);
};

// 内部数据共享层
export const __SECRET__INTERNALS__DO__NOT__USE__OR__YOU__WILL__BE__FIRED = {
	currentDispatcher
};

export default {
	version: '0.0.0',
	createElement: jsxDEV
};
