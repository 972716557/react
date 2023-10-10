import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
	const [number, setNumber] = useState<number>(1);

	return (
		<div
			onClick={() => {
				setNumber((num) => num + 1);
				setNumber((num) => num + 1);
				setNumber((num) => num + 1);
			}}
		>
			<>1111</>
		</div>
	);
}

function Child() {
	return <div>Child</div>;
}
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
