import posthog from 'posthog-js'

const posthogKey = import.meta.env.VITE_POSTHOG_KEY
const posthogHost = import.meta.env.VITE_POSTHOG_HOST

if (posthogKey && posthogHost) {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    defaults: '2026-05-30',
    capture_pageview: false,
    capture_pageleave: true,
  })
} else if (import.meta.env.DEV) {
  console.error(
    'VITE_POSTHOG_KEY or VITE_POSTHOG_HOST variable required by PostHog is missing or un-configured, ' +
    'this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_KEY and VITE_POSTHOG_HOST are configured'
  )
}

export { posthog }
