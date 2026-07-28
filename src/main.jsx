import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import './index.css'
import './lib/posthog'


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


