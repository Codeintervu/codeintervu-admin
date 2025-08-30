// Google Analytics 4 Configuration and Utilities
class Analytics {
  constructor() {
    this.gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    this.isInitialized = false;
    this.init();
  }

  init() {
    if (typeof window !== "undefined" && this.gaId) {
      // Load Google Analytics script
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", this.gaId, {
        page_title: document.title,
        page_location: window.location.href,
      });

      this.isInitialized = true;
    }
  }

  // Track page views
  trackPageView(pageTitle, pagePath) {
    if (this.isInitialized && window.gtag) {
      window.gtag("config", this.gaId, {
        page_title: pageTitle,
        page_path: pagePath,
      });
    }
  }

  // Track custom events
  trackEvent(eventName, parameters = {}) {
    if (this.isInitialized && window.gtag) {
      window.gtag("event", eventName, parameters);
    }
  }

  // Track user actions
  trackUserAction(action, category, label, value) {
    this.trackEvent("user_action", {
      action,
      category,
      label,
      value,
    });
  }

  // Track content engagement
  trackContentEngagement(contentType, contentId, action) {
    this.trackEvent("content_engagement", {
      content_type: contentType,
      content_id: contentId,
      action,
    });
  }

  // Track quiz performance
  trackQuizPerformance(quizId, score, timeSpent, questionsAnswered) {
    this.trackEvent("quiz_performance", {
      quiz_id: quizId,
      score,
      time_spent: timeSpent,
      questions_answered: questionsAnswered,
    });
  }

  // Track tutorial progress
  trackTutorialProgress(tutorialId, progress, timeSpent) {
    this.trackEvent("tutorial_progress", {
      tutorial_id: tutorialId,
      progress,
      time_spent: timeSpent,
    });
  }
}

// Create and export analytics instance
export const analytics = new Analytics();

// Export individual tracking functions for convenience
export const trackPageView = (pageTitle, pagePath) =>
  analytics.trackPageView(pageTitle, pagePath);
export const trackEvent = (eventName, parameters) =>
  analytics.trackEvent(eventName, parameters);
export const trackUserAction = (action, category, label, value) =>
  analytics.trackUserAction(action, category, label, value);
export const trackContentEngagement = (contentType, contentId, action) =>
  analytics.trackContentEngagement(contentType, contentId, action);
export const trackQuizPerformance = (
  quizId,
  score,
  timeSpent,
  questionsAnswered
) =>
  analytics.trackQuizPerformance(quizId, score, timeSpent, questionsAnswered);
export const trackTutorialProgress = (tutorialId, progress, timeSpent) =>
  analytics.trackTutorialProgress(tutorialId, progress, timeSpent);
