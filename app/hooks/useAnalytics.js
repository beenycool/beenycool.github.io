'use client';

import { usePostHog } from 'posthog-js/react';

export function useAnalytics() {
  const posthog = usePostHog();

  return {
    /**
     * Track an event
     * @param {string} eventName - Name of the event
     * @param {Object} properties - Additional properties to track
     */
    trackEvent: (eventName, properties = {}) => {
      if (posthog) {
        posthog.capture(eventName, properties);
      }
    },

    /**
     * Identify a user
     * @param {string} userId - User ID
     * @param {Object} properties - User properties
     */
    identifyUser: (userId, properties = {}) => {
      if (posthog && userId) {
        posthog.identify(userId, properties);
      }
    },

    /**
     * Reset the user identity (for logout)
     */
    resetUser: () => {
      if (posthog) {
        posthog.reset();
      }
    },

    /**
     * Track a page view
     * @param {string} pageName - Name of the page
     * @param {Object} properties - Additional properties
     */
    trackPageView: (pageName, properties = {}) => {
      if (posthog) {
        posthog.capture('$pageview', {
          page_name: pageName,
          ...properties
        });
      }
    },

    /**
     * Enable or disable tracking
     * @param {boolean} enabled - Whether tracking should be enabled
     */
    setTracking: (enabled) => {
      if (posthog) {
        if (enabled) {
          posthog.opt_in_capturing();
        } else {
          posthog.opt_out_capturing();
        }
      }
    }
  };
} 