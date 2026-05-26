// Safe Date Polyfill for iOS Safari (WebKit) SQL Date parsing bug
const NativeDate = globalThis.Date;

function PatchedDate(...args) {
  // If called without 'new', return the string representation (standard JS behavior)
  if (!new.target) {
    return NativeDate();
  }
  
  // If called with a SQL string, fix it
  if (args.length === 1 && typeof args[0] === 'string') {
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(args[0])) {
      return new NativeDate(args[0].replace(' ', 'T'));
    }
  }
  
  // Construct normally
  return new NativeDate(...args);
}

// Copy static methods
PatchedDate.now = NativeDate.now;
PatchedDate.UTC = NativeDate.UTC;

PatchedDate.parse = function(s) {
  if (typeof s === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(s)) {
    return NativeDate.parse(s.replace(' ', 'T'));
  }
  return NativeDate.parse(s);
};

// Prototype chain maintenance
PatchedDate.prototype = NativeDate.prototype;
PatchedDate.prototype.constructor = PatchedDate;

globalThis.Date = PatchedDate;

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './index.css'


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

