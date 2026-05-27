// Safe Date Polyfill for iOS Safari (WebKit) SQL Date parsing bug
const NativeDate = globalThis.Date;

function PatchedDate(...args) {
  if (!new.target) {
    return NativeDate();
  }
  
  if (args.length === 1 && typeof args[0] === 'string') {
    if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}/.test(args[0])) {
      let s = args[0].replace(' ', 'T');
      s = s.replace(/(\.\d{3})\d+/, '$1');
      if (s.endsWith('+00')) s += ':00';
      
      const d = new NativeDate(s);
      if (!isNaN(d.getTime())) return d;
    }
  }
  
  return new NativeDate(...args);
}

PatchedDate.now = NativeDate.now;
PatchedDate.UTC = NativeDate.UTC;

PatchedDate.parse = function(s) {
  if (typeof s === 'string' && /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}/.test(s)) {
    let str = s.replace(' ', 'T');
    str = str.replace(/(\.\d{3})\d+/, '$1');
    if (str.endsWith('+00')) str += ':00';
    return NativeDate.parse(str);
  }
  return NativeDate.parse(s);
};

PatchedDate.prototype = NativeDate.prototype;
PatchedDate.prototype.constructor = PatchedDate;

globalThis.Date = PatchedDate;

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1a1a1a',
            color: '#fff',
            fontWeight: '700',
            fontSize: '13px',
            borderRadius: '14px',
            padding: '14px 18px',
          },
          success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </AuthProvider>
  </React.StrictMode>
)

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}


