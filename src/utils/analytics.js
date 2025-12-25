// Google Analytics 4 custom tracking
const getGtag = () => window.gtag;

// Track custom events via GA4
export function trackEvent(name, properties = {}) {
  const gtag = getGtag();
  if (gtag && typeof gtag === 'function') {
    gtag('event', name, properties);
  }
}

// Track page views (GA4 handles this automatically, but can be used for SPA navigation)
export function trackPageView(name, url) {
  const gtag = getGtag();
  if (gtag && typeof gtag === 'function') {
    gtag('event', 'page_view', {
      page_title: name,
      page_location: url
    });
  }
}

// Track outbound link clicks
export function trackOutboundClick(url, linkText) {
  trackEvent('click', {
    event_category: 'outbound',
    event_label: url,
    link_text: linkText
  });
}

// Track internal navigation
export function trackNavigation(from, to) {
  trackEvent('navigation', { from, to });
}

// Track scroll depth
let scrollDepthMarkers = { 25: false, 50: false, 75: false, 90: false, 100: false };

export function initScrollTracking() {
  scrollDepthMarkers = { 25: false, 50: false, 75: false, 90: false, 100: false };

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

    Object.keys(scrollDepthMarkers).forEach(marker => {
      const threshold = parseInt(marker);
      if (scrollPercent >= threshold && !scrollDepthMarkers[marker]) {
        scrollDepthMarkers[marker] = true;
        trackEvent('scroll', {
          percent_scrolled: threshold,
          page_path: window.location.pathname
        });
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}

// Track section views
const viewedSections = new Set();

export function trackSectionView(sectionName) {
  if (!viewedSections.has(sectionName)) {
    viewedSections.add(sectionName);
    trackEvent('section_view', { section: sectionName });
  }
}

export function resetSectionTracking() {
  viewedSections.clear();
}

// Track form interactions
export function trackFormStart(formName) {
  trackEvent('form_start', { form_name: formName });
}

export function trackFormSubmit(formName, success = true) {
  trackEvent('form_submit', { form_name: formName, success });
}

// Track giveaway-specific events
export function trackGiveawayEntry(email) {
  trackEvent('giveaway_entry', { method: 'form' });
}

export function trackNewsletterSignup() {
  trackEvent('sign_up', { method: 'newsletter' });
}

// Track FAQ interactions
export function trackFAQExpand(question) {
  trackEvent('faq_expand', { question: question.substring(0, 50) });
}

// Track winner page views
export function trackWinnerView() {
  trackEvent('winner_page_view');
}

// Initialize all tracking
export function initAnalytics() {
  const cleanupScroll = initScrollTracking();

  // Track all outbound clicks
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href && link.hostname !== window.location.hostname) {
      trackOutboundClick(link.href, link.textContent?.trim() || 'Unknown');
    }
  });

  return () => {
    cleanupScroll();
  };
}
