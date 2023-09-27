import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
	const [number, setNumber] = useState<boolean>(false);
	const arr = number
		? [<li key="1">1</li>, <li key="2">2</li>, <li key="3">3</li>]
		: [<li key="3">3</li>, <li key="2">2</li>, <li key="1">1</li>];
	return (
		<div
			onClick={() => {
				setNumber(!number);
			}}
		>
			{number ? (
				<>
					<li key="1">1</li>
					<li key="2">2</li>
					<li key="3">3</li>
				</>
			) : (
				<>
					<li key="3">3</li>
					<li key="2">2</li>
					<li key="1">1</li>
				</>
			)}
		</div>
	);
}

function Child() {
	return <div>Child</div>;
}
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
