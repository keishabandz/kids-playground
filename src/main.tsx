import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'

// Auto-update the PWA: pick up new deploys and reload, so the app never serves
// a stale cached version. Checks for updates on load and then periodically.
const updateSW = registerSW({
  immediate: true,
  onRegisteredSW(_swUrl, registration) {
    if (registration) {
      setInterval(() => registration.update(), 60 * 1000)
    }
  },
  onNeedRefresh() {
    // A new version is ready — activate it and reload immediately.
    updateSW(true)
  },
})

// Belt-and-suspenders: when a *new* service worker takes control (an update,
// not the first install), reload once so the fresh app is shown immediately.
if ('serviceWorker' in navigator) {
  const hadController = !!navigator.serviceWorker.controller
  let refreshing = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing || !hadController) return
    refreshing = true
    window.location.reload()
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
