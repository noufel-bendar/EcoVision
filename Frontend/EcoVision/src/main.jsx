import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Suppress Google Analytics blocking errors from external sources
const originalError = console.error;
console.error = (...args) => {
  const message = args.join(' ');
  if (message.includes('google-analytics.com') && message.includes('ERR_BLOCKED_BY_CLIENT')) {
    return; // Suppress Google Analytics blocking errors
  }
  originalError.apply(console, args);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
