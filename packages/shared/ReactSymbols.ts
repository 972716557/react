const supportSymbol = typeof Symbol === 'function' && Symbol;

export const REACT_ELEMENT_TYPE = supportSymbol
	? Symbol('react.element')
	: 0xeac7;
