import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
	const [number, setNumber] = useState<number>(1);
	return (
		<div
			onClickCapture={() => {
				setNumber(number + 1);
			}}
		>
			{number}
		</div>
	);
}

function Child() {
	return <div>Child</div>;
}
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
