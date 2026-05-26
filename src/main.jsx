import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './index.css'

// --- Safari iOS Date Polyfill for SQL Timestamps ---
// Safari's JavaScript core throws an "Invalid Date" for "YYYY-MM-DD HH:MM:SS" (without a 'T').
// This polyfill intercepts Date calls to inject the 'T', preventing the entire React app from crashing.
const OriginalDate = Date;
const safeDateStr = (str) => {
  if (typeof str === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(str)) {
    return str.replace(' ', 'T');
  }
  return str;
};

function PatchedDate(...args) {
  if (args.length === 1) {
    return new OriginalDate(safeDateStr(args[0]));
  }
  return new OriginalDate(...args);
}
PatchedDate.prototype = OriginalDate.prototype;
PatchedDate.now = OriginalDate.now;
PatchedDate.parse = (str) => OriginalDate.parse(safeDateStr(str));
PatchedDate.UTC = OriginalDate.UTC;
globalThis.Date = PatchedDate;
// --------------------------------------------------

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.log('SW registration failed:', err)
    })
  })
}
