// Error monitoring — wraps console.error so errors can later be routed to Sentry
// To activate Sentry: npm install @sentry/react, then replace the stubs below.

const isProd = import.meta.env.PROD

export function initMonitoring() {
  if (!isProd) return
  // Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN, ... })
}

export function captureError(error, context = {}) {
  if (!isProd) {
    console.error('[DEV error]', error, context)
    return
  }
  // Sentry.captureException(error, { extra: context })
  console.error('[PROD error]', error, context)
}

export function captureMessage(message, level = 'info') {
  if (!isProd) return
  // Sentry.captureMessage(message, level)
}
