import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
	const [number, setNumber] = useState<number>(1);
	window.setNumber = setNumber;
	return number === 3 ? <Child /> : <div>{number}</div>;
}

function Child() {
	return <div>Child</div>;
}
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
