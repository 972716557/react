import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
	const [number, setNumber] = useState(1);
	return <div>{number}</div>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
