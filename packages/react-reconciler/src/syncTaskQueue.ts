// 同步任务队列

let syncQueue: ((...args: any) => void)[] | null = null;
let isFlushingSynQueue = false;
export function scheduleSyncCallback(callback: (...args: any) => void) {
	if (syncQueue === null) {
		syncQueue = [callback];
	} else {
		syncQueue.push(callback);
	}
}

// 执行调度
export function flushSyncCallbacks() {
	if (!isFlushingSynQueue && syncQueue) {
		isFlushingSynQueue = true;
		try {
			syncQueue.forEach((callback) => callback());
		} catch (err) {
			if (__DEV__) {
				console.error('flushSyncCallbacks报错', err);
			}
		} finally {
			isFlushingSynQueue = false;
		}
	}
}
