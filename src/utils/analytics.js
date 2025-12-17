// Azure Application Insights custom tracking
const getAppInsights = () => window.appInsights;

// Track custom events
export function trackEvent(name, properties = {}) {
  const ai = getAppInsights();
  if (ai && typeof ai.trackEvent === 'function') {
    ai.trackEvent({ name, properties });
  }
}

// Track page views (called automatically, but can be used for SPA navigation)
export function trackPageView(name, url) {
  const ai = getAppInsights();
  if (ai && typeof ai.trackPageView === 'function') {
    ai.trackPageView({ name, uri: url });
  }
}

// Track outbound link clicks
export function trackOutboundClick(url, linkText) {
  trackEvent('OutboundClick', { url, linkText });
}

// Track internal navigation
export function trackNavigation(from, to) {
  trackEvent('InternalNavigation', { from, to });
}

// Track scroll depth
let scrollDepthMarkers = { 25: false, 50: false, 75: false, 90: false, 100: false };

export function initScrollTracking() {
  // Reset markers on page change
  scrollDepthMarkers = { 25: false, 50: false, 75: false, 90: false, 100: false };

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

    Object.keys(scrollDepthMarkers).forEach(marker => {
      const threshold = parseInt(marker);
      if (scrollPercent >= threshold && !scrollDepthMarkers[marker]) {
        scrollDepthMarkers[marker] = true;
        trackEvent('ScrollDepth', { depth: `${threshold}%`, page: window.location.pathname });
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}

// Track time on page
let pageStartTime = Date.now();

export function initTimeTracking() {
  pageStartTime = Date.now();

  const handleUnload = () => {
    const timeOnPage = Math.round((Date.now() - pageStartTime) / 1000);
    trackEvent('TimeOnPage', {
      seconds: timeOnPage,
      page: window.location.pathname
    });
  };

  window.addEventListener('beforeunload', handleUnload);
  return () => window.removeEventListener('beforeunload', handleUnload);
}

// Track section views (for pages with multiple sections)
const viewedSections = new Set();

export function trackSectionView(sectionName) {
  if (!viewedSections.has(sectionName)) {
    viewedSections.add(sectionName);
    trackEvent('SectionView', { section: sectionName, page: window.location.pathname });
  }
}

export function resetSectionTracking() {
  viewedSections.clear();
}

// Track form interactions
export function trackFormStart(formName) {
  trackEvent('FormStart', { form: formName });
}

export function trackFormSubmit(formName, success = true) {
  trackEvent('FormSubmit', { form: formName, success });
}

// Track giveaway-specific events
export function trackGiveawayEntry(email) {
  trackEvent('GiveawayEntry', { hasEmail: !!email });
}

export function trackNewsletterSignup() {
  trackEvent('NewsletterSignup', { page: window.location.pathname });
}

// Track FAQ interactions
export function trackFAQExpand(question) {
  trackEvent('FAQExpand', { question: question.substring(0, 50) });
}

// Track winner page views
export function trackWinnerView() {
  trackEvent('WinnerPageView', { timestamp: new Date().toISOString() });
}

// Initialize all tracking
export function initAnalytics() {
  const cleanupScroll = initScrollTracking();
  const cleanupTime = initTimeTracking();

  // Track all outbound clicks
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href && link.hostname !== window.location.hostname) {
      trackOutboundClick(link.href, link.textContent?.trim() || 'Unknown');
    }
  });

  return () => {
    cleanupScroll();
    cleanupTime();
  };
}
