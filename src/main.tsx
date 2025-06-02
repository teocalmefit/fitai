import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Enhanced StackBlitz detection
const isStackBlitz = 
  window.location.hostname.includes('stackblitz') || 
  window.location.hostname === 'localhost' && (
    window !== window.parent || // Check if in iframe
    document.referrer.includes('stackblitz.io')
  );

// Only register service worker if not in StackBlitz and service workers are supported
if ('serviceWorker' in navigator && !isStackBlitz) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('Service worker registration failed:', error);
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);