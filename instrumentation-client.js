// PostHog instrumentation client
// This file handles PostHog initialization safely on the client side only
// Prevents SSR issues by only running in the browser

import posthog from 'posthog-js'

// Only initialize PostHog on the client side to avoid SSR issues
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  try {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      capture_pageview: true,
      disable_session_recording: process.env.NODE_ENV === 'development',
      // Enable debug mode in development
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') {
          posthog.debug()
        }
      },
    })
    console.log('PostHog initialized successfully')
  } catch (error) {
    console.warn('PostHog initialization failed:', error)
  }
}

// Export posthog instance for use in other components
export { posthog } 