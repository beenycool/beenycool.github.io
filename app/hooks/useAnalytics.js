'use client';

// import { usePostHog } from 'posthog-js/react'; // Commented out

export function useAnalytics() {
  // const posthog = usePostHog(); // Commented out

  return {
    /**
     * Track an event
     * @param {string} eventName - Name of the event
     * @param {Object} properties - Additional properties to track
     */
    trackEvent: (eventName, properties = {}) => {
      // if (posthog) { // Commented out
      //   posthog.capture(eventName, properties);
      // }
      console.log('Analytics (PostHog removed): trackEvent', eventName, properties);
    },

    /**
     * Identify a user
     * @param {string} userId - User ID
     * @param {Object} properties - User properties
     */
    identifyUser: (userId, properties = {}) => {
      // if (posthog && userId) { // Commented out
      //   posthog.identify(userId, properties);
      // }
      console.log('Analytics (PostHog removed): identifyUser', userId, properties);
    },

    /**
     * Reset the user identity (for logout)
     */
    resetUser: () => {
      // if (posthog) { // Commented out
      //   posthog.reset();
      // }
      console.log('Analytics (PostHog removed): resetUser');
    },

    /**
     * Track a page view
     * @param {string} pageName - Name of the page
     * @param {Object} properties - Additional properties
     */
    trackPageView: (pageName, properties = {}) => {
      // if (posthog) { // Commented out
      //   posthog.capture('$pageview', {
      //     page_name: pageName,
      //     ...properties
      //   });
      // }
      console.log('Analytics (PostHog removed): trackPageView', pageName, properties);
    },

    /**
     * Enable or disable tracking
     * @param {boolean} enabled - Whether tracking should be enabled
     */
    setTracking: (enabled) => {
      // if (posthog) { // Commented out
      //   if (enabled) {
      //     posthog.opt_in_capturing();
      //   } else {
      //     posthog.opt_out_capturing();
      //   }
      // }
      console.log('Analytics (PostHog removed): setTracking', enabled);
    }
  };
} 