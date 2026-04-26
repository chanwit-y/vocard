import { useRegisterSW } from 'virtual:pwa-register/react'
import './PWABadge.css'

const intervalMS = 60 * 60 * 1000

export function PWABadge() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      if (!registration) return

      if (registration.active?.state === 'activated') {
        registerPeriodicSync(swUrl, registration)
      } else if (registration.installing) {
        registration.installing.addEventListener('statechange', (event) => {
          const sw = event.target as ServiceWorker
          if (sw.state === 'activated') registerPeriodicSync(swUrl, registration)
        })
      }
    },
  })

  function close() {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  if (!offlineReady && !needRefresh) return null

  return (
    <div className="PWABadge" role="alert" aria-labelledby="toast-message">
      <div className="PWABadge-toast">
        <div className="PWABadge-message" id="toast-message">
          {offlineReady ? (
            <span>App ready to work offline</span>
          ) : (
            <span>New content available, click reload to update.</span>
          )}
        </div>
        <div className="PWABadge-buttons">
          {needRefresh && (
            <button
              type="button"
              className="PWABadge-toast-button"
              onClick={() => updateServiceWorker(true)}
            >
              Reload
            </button>
          )}
          <button
            type="button"
            className="PWABadge-toast-button"
            onClick={close}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function registerPeriodicSync(swUrl: string, registration: ServiceWorkerRegistration) {
  if (intervalMS <= 0) return

  setInterval(async () => {
    if ('onLine' in navigator && !navigator.onLine) return

    const resp = await fetch(swUrl, {
      cache: 'no-store',
      headers: {
        cache: 'no-store',
        'cache-control': 'no-cache',
      },
    })

    if (resp?.status === 200) await registration.update()
  }, intervalMS)
}
