"use client";

import { useEffect } from "react";

export function RegisterServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      if (process.env.NODE_ENV !== 'production') {
        // A previous production session on this origin may still control the
        // page. Remove only this app's worker and caches during development.
        void navigator.serviceWorker.getRegistrations().then(async (registrations) => {
          await Promise.all(registrations.filter((r) =>
            [r.active, r.waiting, r.installing].some((worker) => worker && new URL(worker.scriptURL).pathname === '/sw.js')
          ).map((r) => r.unregister()));
          if ('caches' in window) {
            const keys = await caches.keys();
            await Promise.all(keys.filter((key) => key.startsWith('workplace-sim-')).map((key) => caches.delete(key)));
          }
        }).catch(() => {});
        return;
      }
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return null;
}
