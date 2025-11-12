// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Filter out specific errors that are not actionable
  beforeSend(event, hint) {
    // Filter out network errors from browser extensions
    if (event.exception?.values?.[0]?.value?.includes('chrome-extension://')) {
      return null
    }

    // Filter out ResizeObserver loop limit errors (common browser issue)
    if (event.message?.includes('ResizeObserver loop')) {
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
