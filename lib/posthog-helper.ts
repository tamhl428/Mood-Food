// PostHog helper functions for safe event tracking
// All functions check for client-side execution to prevent SSR issues

import { posthog } from '../instrumentation-client'

// Safe wrapper for PostHog functions that only run on client side
const safePostHog = {
  capture: (event: string, properties?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && posthog) {
      try {
        posthog.capture(event, properties)
      } catch (error) {
        console.warn('PostHog capture failed:', error)
      }
    }
  },
  
  identify: (userId: string, properties?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && posthog) {
      try {
        posthog.identify(userId, properties)
      } catch (error) {
        console.warn('PostHog identify failed:', error)
      }
    }
  },
  
  people: {
    set: (properties: Record<string, unknown>) => {
      if (typeof window !== 'undefined' && posthog) {
        try {
          posthog.people.set(properties)
        } catch (error) {
          console.warn('PostHog people.set failed:', error)
        }
      }
    }
  }
}

// Event tracking functions
export const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
  safePostHog.capture(eventName, {
    ...properties,
    timestamp: new Date().toISOString(),
  })
}

export const trackPageView = (pageName: string, properties?: Record<string, unknown>) => {
  trackEvent('page_viewed', {
    page_name: pageName,
    ...properties,
  })
}

export const trackSurveySubmission = (preferences: {
  feeling: string
  cuisine: string
  diet: string
  adventurousness: string
  spicy: string
}) => {
  trackEvent('survey_submitted', {
    feeling: preferences.feeling,
    cuisine: preferences.cuisine,
    diet: preferences.diet,
    adventurousness: preferences.adventurousness,
    spicy: preferences.spicy,
  })
}

export const trackRecipeClick = (recipe: {
  name: string
  mood: string
  cuisine: string
  difficulty: string
  time: string
}) => {
  trackEvent('recipe_clicked', {
    recipe_name: recipe.name,
    mood: recipe.mood,
    cuisine: recipe.cuisine,
    difficulty: recipe.difficulty,
    time: recipe.time,
  })
}

export const trackRecipeGeneration = (sessionId: string, preferences: Record<string, unknown>) => {
  trackEvent('recipes_generated', {
    session_id: sessionId,
    preferences: preferences,
  })
}

export const identifyUser = (userId: string, properties?: Record<string, unknown>) => {
  safePostHog.identify(userId, properties)
}

export const setUserProperties = (properties: Record<string, unknown>) => {
  safePostHog.people.set(properties)
} 