import { createRoot } from 'react-dom/client';
import App from './App';
import './popup.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root not found in popup.html');

createRoot(container).render(<App />);
