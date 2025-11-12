// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Filter out specific errors that are not actionable
  beforeSend(event, hint) {
    // Filter out errors from build-time processing
    if (event.exception?.values?.[0]?.stacktrace?.frames?.some(frame =>
      frame.filename?.includes('.contentlayer')
    )) {
      // Only log contentlayer errors in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Contentlayer error (not sent to Sentry):', event)
      }
      return null
    }

    return event
  },

  // Add custom tags for better error organization
  initialScope: {
    tags: {
      environment: process.env.NODE_ENV,
      deployment: process.env.VERCEL_ENV || 'local',
    },
  },
})
