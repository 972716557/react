import { Container } from 'hostConfig';
import { Props } from 'shared/ReactTypes';

// 合成事件
export const elementPropsKey = '__props';
export interface DOMElement extends Element {
	[elementPropsKey]: Props;
}

type EventCallback = (e: Event) => void;

interface SyntheticEvent extends Event {
	__stopPropagation: boolean;
}

interface Paths {
	capture: EventCallback[];
	bubble: EventCallback[];
}

function getEventCallbackNameFromEventType(
	eventType: string
): string[] | undefined {
	return {
		click: ['onClickCapture', 'onClick']
	}[eventType];
}

export function updateFibreProps(node: DOMElement, props: Props) {
	node[elementPropsKey] = props;
}

const validEventTypeList = ['click'];

export function initEvent(container: Container, eventType: string) {
	if (!validEventTypeList.includes(eventType)) {
		console.warn('当前不支持', eventType, '事件');
		return;
	}
	if (__DEV__) {
		console.log('初始化事件', eventType);
	}
	container.addEventListener(eventType, (e: Event) => {
		dispatchEvent(container, eventType, e);
	});
}

function createSyntheticEvent(e: Event) {
	const syntheticEvent = e as SyntheticEvent;
	syntheticEvent.__stopPropagation = false;
	const originStopPropagation = e.stopPropagation;

	syntheticEvent.stopPropagation = () => {
		syntheticEvent.__stopPropagation = true;
		if (originStopPropagation) {
			originStopPropagation();
		}
	};
	return syntheticEvent;
}
function dispatchEvent(container: Container, eventType: string, e: Event) {
	const targetElement = e.target;

	if (targetElement === null) {
		console.warn('事件不存在targe', e);
		return;
	}

	const { bubble, capture } = collectPaths(
		targetElement as DOMElement,
		container,
		eventType
	);
	// 2.构建合成事件
	const se = createSyntheticEvent(e);

	// 3. 遍历capture
	triggerEventFlow(capture, se);

	// 4. 遍历bubble

	if (!se.__stopPropagation) {
		triggerEventFlow(bubble, se);
	}
}

function triggerEventFlow(paths: EventCallback[], se: SyntheticEvent) {
	for (let i = 0; i < paths.length; i++) {
		const callback = paths[i];
		callback.call(null, se);
		if (se.__stopPropagation) {
			break;
		}
	}
	return se;
}
function collectPaths(
	targetElement: DOMElement,
	container: Container,
	eventType: string
): Paths {
	const paths: Paths = {
		// 冒泡阶段的数组
		capture: [],
		// 非冒泡的数组
		bubble: []
	};
	while (targetElement && targetElement !== container) {
		// 收集
		const elementProps = targetElement[elementPropsKey];
		if (elementProps) {
			const callbackNameList = getEventCallbackNameFromEventType(eventType);
			if (callbackNameList) {
				callbackNameList.forEach((callbackName, index) => {
					const eventCallback = elementProps[callbackName];
					if (eventCallback) {
						if (index === 0) {
							// capture
							paths.capture.unshift(eventCallback);
						} else {
							paths.bubble.push(eventCallback);
						}
					}
				});
			}
		}
		targetElement = targetElement.parentNode as DOMElement;
	}
	return paths;
}
