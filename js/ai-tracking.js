// AI Tracking System for Website Intelligence
class AITracking {
    constructor() {
        this.userId = this.generateUserId();
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.pageStartTime = Date.now();
        this.interactions = [];
        this.deviceType = this.getDeviceType();
        this.currentSection = 'home';
        
        this.init();
    }

    // Initialize tracking
    init() {
        this.trackPageView();
        this.setupEventListeners();
        this.startPeriodicTracking();
        this.trackPerformance();
    }

    // Generate unique user ID
    generateUserId() {
        let userId = localStorage.getItem('ai_user_id');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substring(2, 15) + 
                    Math.random().toString(36).substring(2, 15);
            localStorage.setItem('ai_user_id', userId);
        }
        return userId;
    }

    // Generate session ID
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    }

    // Get device type
    getDeviceType() {
        const userAgent = navigator.userAgent;
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
            return 'mobile';
        } else if (/iPad|Android/i.test(userAgent)) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    }

    // Track page view
    trackPageView() {
        const pageData = {
            url: window.location.href,
            title: document.title,
            referrer: document.referrer,
            deviceType: this.deviceType,
            screenResolution: `${screen.width}x${screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            userAgent: navigator.userAgent
        };

        this.sendTrackingData('page_visit', pageData);
    }

    // Setup event listeners for user interactions
    setupEventListeners() {
        // Track clicks
        document.addEventListener('click', (e) => {
            this.trackClick(e);
        });

        // Track scroll (throttled)
        let isTicking = false;
        window.addEventListener('scroll', () => {
            if (!isTicking) {
                window.requestAnimationFrame(() => {
                    this.trackScroll();
                    isTicking = false;
                });
                isTicking = true;
            }
        }, { passive: true });

        // Track form submissions
        document.addEventListener('submit', (e) => {
            this.trackFormSubmission(e);
        });

        // Track navigation
        document.addEventListener('DOMContentLoaded', () => {
            this.trackNavigation();
        });

        // Track section visibility
        this.trackSectionVisibility();

        // Track time spent on page
        window.addEventListener('beforeunload', () => {
            this.trackTimeSpent();
        });
    }

    // Track click events
    trackClick(e) {
        const target = e.target;
        const clickData = {
            element: target.tagName.toLowerCase(),
            elementId: target.id || '',
            elementClass: target.className || '',
            text: target.textContent?.substring(0, 50) || '',
            position: { x: e.clientX, y: e.clientY },
            section: this.currentSection,
            deviceType: this.deviceType
        };

        // Track specific interactions
        if (target.matches('a[href*="#"]')) {
            this.trackNavigationClick(target);
        } else if (target.matches('button, .cta-button, .social-btn')) {
            this.trackCTAClick(target);
        } else if (target.matches('.blog-card, .gallery-item')) {
            this.trackContentClick(target);
        }

        this.sendTrackingData('click', clickData);
    }

    // Track navigation clicks
    trackNavigationClick(target) {
        const href = target.getAttribute('href');
        const fromSection = this.currentSection;
        const toSection = href.replace('#', '') || 'home';

        this.sendTrackingData('navigation_click', {
            from: fromSection,
            to: toSection,
            element: target.textContent?.trim() || '',
            deviceType: this.deviceType
        });

        this.currentSection = toSection;
    }

    // Track CTA clicks
    trackCTAClick(target) {
        const ctaData = {
            type: 'cta_click',
            element: target.textContent?.trim() || '',
            section: this.currentSection,
            deviceType: this.deviceType
        };

        // Track specific CTA types
        if (target.matches('.whatsapp-btn')) {
            ctaData.ctaType = 'whatsapp';
            this.sendTrackingData('whatsapp_click', ctaData);
        } else if (target.matches('.call-btn')) {
            ctaData.ctaType = 'phone_call';
            this.sendTrackingData('phone_call', ctaData);
        } else if (target.matches('.email-btn')) {
            ctaData.ctaType = 'email';
            this.sendTrackingData('email_click', ctaData);
        } else {
            this.sendTrackingData('cta_click', ctaData);
        }
    }

    // Track content clicks
    trackContentClick(target) {
        const contentData = {
            contentType: target.matches('.blog-card') ? 'blog' : 'gallery',
            contentId: target.dataset.id || '',
            contentTitle: target.querySelector('h3, h4')?.textContent?.trim() || '',
            section: this.currentSection,
            deviceType: this.deviceType
        };

        this.sendTrackingData('content_interaction', contentData);
    }

    // Track scroll behavior
    trackScroll() {
        const scrollData = {
            scrollY: window.scrollY,
            scrollPercentage: (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100,
            section: this.currentSection,
            deviceType: this.deviceType
        };

        this.sendTrackingData('scroll', scrollData);
    }

    // Track form submissions
    trackFormSubmission(e) {
        const formData = {
            formId: e.target.id || '',
            formAction: e.target.action || '',
            formMethod: e.target.method || 'POST',
            section: this.currentSection,
            deviceType: this.deviceType
        };

        this.sendTrackingData('form_submit', formData);
    }

    // Track navigation
    trackNavigation() {
        const navData = {
            currentSection: this.currentSection,
            availableSections: this.getAvailableSections(),
            deviceType: this.deviceType
        };

        this.sendTrackingData('navigation_load', navData);
    }

    // Track section visibility
    trackSectionVisibility() {
        const sections = ['home', 'about', 'practice-areas', 'reviews', 'blog', 'gallery', 'faq', 'contact'];
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionName = entry.target.id || 'unknown';
                    this.currentSection = sectionName;
                    
                    this.sendTrackingData('section_visit', {
                        section: sectionName,
                        timeSpent: Date.now() - this.pageStartTime,
                        deviceType: this.deviceType
                    });
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(sectionId => {
            const element = document.getElementById(sectionId);
            if (element) {
                observer.observe(element);
            }
        });
    }

    // Get available sections
    getAvailableSections() {
        const sections = ['home', 'about', 'practice-areas', 'reviews', 'blog', 'gallery', 'faq', 'contact'];
        return sections.filter(sectionId => document.getElementById(sectionId));
    }

    // Track time spent on page
    trackTimeSpent() {
        const timeSpent = Date.now() - this.pageStartTime;
        
        this.sendTrackingData('time_spent', {
            timeSpent: timeSpent,
            section: this.currentSection,
            deviceType: this.deviceType
        });
    }

            // Start periodic tracking
        startPeriodicTracking() {
            // Track engagement every 45 seconds to reduce network chatter
            setInterval(() => {
                this.trackEngagement();
            }, 45000);

            // Track performance every 2 minutes
            setInterval(() => {
                this.trackPerformance();
            }, 120000);
        }

    // Track engagement
    trackEngagement() {
        const engagementData = {
            timeOnPage: Date.now() - this.pageStartTime,
            scrollDepth: (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100,
            interactions: this.interactions.length,
            section: this.currentSection,
            deviceType: this.deviceType
        };

        this.sendTrackingData('engagement', engagementData);
    }

    // Track performance
    trackPerformance() {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                const performanceData = {
                    loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
                    firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
                    deviceType: this.deviceType
                };

                this.sendTrackingData('performance', performanceData);
            }
        }
    }

    // Send tracking data to server
    async sendTrackingData(action, data) {
        const trackingData = {
            userId: this.userId,
            sessionId: this.sessionId,
            action: action,
            data: data,
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            deviceType: this.deviceType
        };

        // Store interaction for engagement tracking
        this.interactions.push(trackingData);

        try {
            // Send to AI service
            if (document.visibilityState === 'visible') {
                await fetch('/api/ai/track', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    keepalive: true,
                    body: JSON.stringify(trackingData)
                });
            }

            // Also send to Google Analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', action, {
                    event_category: 'ai_tracking',
                    event_label: JSON.stringify(data),
                    value: 1
                });
            }
        } catch (error) {
            console.log('AI tracking error:', error);
        }
    }

    // Get AI insights
    async getAIInsights() {
        try {
            const response = await fetch('/api/ai/insights');
            const insights = await response.json();
            return insights;
        } catch (error) {
            console.log('Error getting AI insights:', error);
            return null;
        }
    }

    // Get personalized recommendations
    async getPersonalizedRecommendations() {
        try {
            const response = await fetch('/api/ai/recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: this.userId,
                    currentSection: this.currentSection,
                    deviceType: this.deviceType
                })
            });
            const recommendations = await response.json();
            return recommendations;
        } catch (error) {
            console.log('Error getting recommendations:', error);
            return null;
        }
    }
}

// Initialize AI tracking after load to avoid competing with main thread
window.addEventListener('load', () => {
	try {
		window.aiTracking = new AITracking();
	} catch (e) {
		console.log('AI tracking init error:', e);
	}
});
// Fallback if 'load' missed (e.g., cached), init on DOMContentLoaded with a delay
document.addEventListener('DOMContentLoaded', () => {
    if (!window.aiTracking) {
        setTimeout(() => {
            try {
                window.aiTracking = new AITracking();
            } catch (e) {
                console.log('AI tracking fallback init error:', e);
            }
        }, 0);
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AITracking;
}
