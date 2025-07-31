// PostHog instrumentation client
// This file handles PostHog initialization safely on the client side only
// Prevents SSR issues by only running in the browser

import posthog from 'posthog-js'

// Only initialize PostHog on the client side to avoid SSR issues
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  try {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      capture_pageview: true,
      // Enable session recordings
      session_recording: { 
        enabled: true 
      },
      // Enable debug mode in development
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') {
          posthog.debug()
          // Test event to verify PostHog is working
          posthog.capture('session_recording_started', {
            environment: process.env.NODE_ENV,
            timestamp: new Date().toISOString()
          })
        }
      },
    })
    console.log('PostHog initialized successfully with session recordings enabled')
  } catch (error) {
    console.warn('PostHog initialization failed:', error)
  }
}

// Export posthog instance for use in other components
export { posthog } 