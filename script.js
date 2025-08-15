// Modern Law Firm Website JavaScript with GSAP Animations
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

class ModernLawWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupScrollEffects();
        this.initializeChatGPT();
        this.setupAdminSync();
        this.setupIntersectionObserver();
    }

    setupEventListeners() {
        // Header scroll effect
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', this.handleSmoothScroll.bind(this));
        });

        // Modal functionality
        this.setupModals();
        
        // Contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactSubmit.bind(this));
        }

        // FAQ toggles
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', this.toggleFAQ.bind(this));
        });

        // Trusted by scroll animation
        this.setupTrustedByAnimation();
    }

    initializeAnimations() {
        // Page load animation
        gsap.from('body', {
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });

        // Hero section animations
        const heroTimeline = gsap.timeline();
        heroTimeline
            .from('.hero h1', {
                y: 100,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out'
            })
            .from('.hero p', {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power2.out'
            }, '-=0.5')
            .from('.cta-button', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'back.out(1.7)'
            }, '-=0.3');

        // Animate trusted by items
        gsap.from('.trusted-item', {
            x: 100,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.trusted-by',
                start: 'top 80%'
            }
        });
    }

    setupScrollEffects() {
        // Header scroll effect
        ScrollTrigger.create({
            start: 'top -80',
            end: 99999,
            onUpdate: (self) => {
                const header = document.querySelector('.header');
                if (self.direction === 1) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        });

        // Section animations
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            gsap.from(section, {
                y: 100,
                opacity: 0,
                duration: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // Card animations
        const cards = document.querySelectorAll('.practice-card, .blog-card, .founder-card, .gallery-item');
        cards.forEach(card => {
            gsap.from(card, {
                y: 60,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%'
                }
            });
        });

        // Stats counter animation
        const stats = document.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            const finalValue = parseInt(stat.textContent);
            gsap.from(stat, {
                textContent: 0,
                duration: 2,
                ease: 'power2.out',
                snap: { textContent: 1 },
                scrollTrigger: {
                    trigger: stat,
                    start: 'top 80%'
                },
                onUpdate: function() {
                    stat.textContent = Math.ceil(stat.textContent);
                }
            });
        });
    }

    setupTrustedByAnimation() {
        const scrollContent = document.querySelector('.scroll-content');
        if (scrollContent) {
            // Clone items for infinite scroll
            const items = scrollContent.children;
            for (let i = 0; i < items.length; i++) {
                const clone = items[i].cloneNode(true);
                scrollContent.appendChild(clone);
            }

            // GSAP animation for smooth scrolling
            gsap.to(scrollContent, {
                x: '-50%',
                duration: 60,
                ease: 'none',
                repeat: -1
            });
        }
    }

    handleScroll() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    handleNavClick(e) {
        e.preventDefault();
        const target = e.target.getAttribute('href');
        if (target && target.startsWith('#')) {
            this.scrollToSection(target);
        }
    }

    handleSmoothScroll(e) {
        e.preventDefault();
        const target = e.target.getAttribute('href');
        this.scrollToSection(target);
    }

    scrollToSection(target) {
        const element = document.querySelector(target);
        if (element) {
            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: element,
                    offsetY: 80
                },
                ease: 'power2.out'
            });
        }
    }

    setupModals() {
        // Blog modal
        document.querySelectorAll('.blog-card').forEach(card => {
            card.addEventListener('click', () => {
                this.openModal('blogModal', card.dataset.blogId);
            });
        });

        // Gallery modal
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                this.openModal('galleryModal', item.dataset.galleryId);
            });
        });

        // Close modal buttons
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        });

        // Close modal on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        });
    }

    openModal(modalId, itemId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            gsap.from(modal.querySelector('.modal-content'), {
                scale: 0.8,
                opacity: 0,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
            
            // Load content based on itemId
            this.loadModalContent(modalId, itemId);
        }
    }

    closeModal() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                gsap.to(modal.querySelector('.modal-content'), {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.2,
                    ease: 'power2.in',
                    onComplete: () => {
                        modal.style.display = 'none';
                    }
                });
            }
        });
    }

    loadModalContent(modalId, itemId) {
        // Load content from data or API
        console.log(`Loading content for ${modalId} with ID: ${itemId}`);
    }

    toggleFAQ(e) {
        const question = e.target;
        const answer = question.nextElementSibling;
        const isActive = question.classList.contains('active');

        // Close all other FAQs
        document.querySelectorAll('.faq-question').forEach(q => {
            q.classList.remove('active');
            q.nextElementSibling.classList.remove('active');
        });

        if (!isActive) {
            question.classList.add('active');
            answer.classList.add('active');
            
            gsap.from(answer, {
                height: 0,
                opacity: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    }

    async handleContactSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;

        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                this.showNotification('Message sent successfully!', 'success');
                form.reset();
            } else {
                this.showNotification(result.message || 'Failed to send message', 'error');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            this.showNotification('An error occurred. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        // Set background color based on type
        const colors = {
            success: '#4caf50',
            error: '#f44336',
            info: '#2196f3'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Animate in
        gsap.to(notification, {
            x: 0,
            duration: 0.3,
            ease: 'power2.out'
        });

        // Remove after 5 seconds
        setTimeout(() => {
            gsap.to(notification, {
                x: '100%',
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    document.body.removeChild(notification);
                }
            });
        }, 5000);
    }

    initializeChatGPT() {
        // ChatGPT Functions
        window.toggleChatGPT = () => {
            console.log('toggleChatGPT called');
            const body = document.getElementById('chatgpt-body');
            const toggle = document.querySelector('.chatgpt-toggle');

            if (!body || !toggle) {
                console.error('ChatGPT elements not found:', { body: !!body, toggle: !!toggle });
                return;
            }

            if (body.style.display === 'none') {
                body.style.display = 'flex';
                toggle.textContent = '▲';
                toggle.style.transform = 'rotate(180deg)';
                console.log('ChatGPT opened');
                
                // Animate in
                gsap.from(body, {
                    height: 0,
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            } else {
                gsap.to(body, {
                    height: 0,
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.in',
                    onComplete: () => {
                        body.style.display = 'none';
                        toggle.textContent = '▼';
                        toggle.style.transform = 'rotate(0deg)';
                        console.log('ChatGPT closed');
                    }
                });
            }
        };

        // ChatGPT chat functionality
        const chatInput = document.querySelector('.chatgpt-input input');
        const chatButton = document.querySelector('.chatgpt-input button');
        const messagesContainer = document.querySelector('.chatgpt-messages');

        if (chatButton && chatInput) {
            chatButton.addEventListener('click', this.sendChatMessage.bind(this));
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendChatMessage();
                }
            });
        }
    }

    async sendChatMessage() {
        const input = document.querySelector('.chatgpt-input input');
        const messagesContainer = document.querySelector('.chatgpt-messages');
        
        if (!input || !messagesContainer) return;

        const message = input.value.trim();
        if (!message) return;

        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'chatgpt-message user';
        userMessage.textContent = message;
        messagesContainer.appendChild(userMessage);

        // Clear input
        input.value = '';

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'chatgpt-message bot';
        typingIndicator.textContent = 'Typing...';
        messagesContainer.appendChild(typingIndicator);

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message, context: 'legal' })
            });

            const data = await response.json();

            // Remove typing indicator
            messagesContainer.removeChild(typingIndicator);

            // Add bot response
            const botMessage = document.createElement('div');
            botMessage.className = 'chatgpt-message bot';
            botMessage.textContent = data.response || 'I apologize, but I\'m unable to process your request at the moment.';
            messagesContainer.appendChild(botMessage);

            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

        } catch (error) {
            console.error('Chat error:', error);
            messagesContainer.removeChild(typingIndicator);
            
            const errorMessage = document.createElement('div');
            errorMessage.className = 'chatgpt-message bot';
            errorMessage.textContent = 'Sorry, I\'m having trouble connecting right now. Please try again later.';
            messagesContainer.appendChild(errorMessage);
        }
    }

    setupAdminSync() {
        // Listen for changes from admin panel
        const channel = new BroadcastChannel('admin-updates');
        channel.onmessage = (event) => {
            const { type, data } = event.data;
            this.handleAdminUpdate(type, data);
        };

        // Listen for localStorage changes
        window.addEventListener('storage', (e) => {
            if (e.key && e.key.startsWith('admin_')) {
                this.handleAdminUpdate('storage', { key: e.key, value: e.newValue });
            }
        });
    }

    handleAdminUpdate(type, data) {
        console.log('Admin update received:', type, data);
        
        switch (type) {
            case 'content_update':
                this.updateContent(data);
                break;
            case 'settings_update':
                this.updateSettings(data);
                break;
            case 'storage':
                this.handleStorageUpdate(data);
                break;
        }
    }

    updateContent(data) {
        const { section, content } = data;
        const element = document.querySelector(`[data-section="${section}"]`);
        
        if (element) {
            gsap.to(element, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    element.innerHTML = content;
                    gsap.to(element, {
                        opacity: 1,
                        duration: 0.3
                    });
                }
            });
        }
    }

    updateSettings(data) {
        // Update website settings
        console.log('Updating settings:', data);
    }

    handleStorageUpdate(data) {
        // Handle localStorage updates
        console.log('Storage update:', data);
    }

    setupIntersectionObserver() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
            observer.observe(el);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ModernLawWebsite();
});

// Export for use in other modules
export default ModernLawWebsite;
