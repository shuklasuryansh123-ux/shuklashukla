// Sample data for blogs and gallery
const blogData = [
    {
        id: 1,
        title: "Understanding Corporate Law in India",
        excerpt: "A comprehensive guide to corporate law practices and regulations in India...",
        content: "Corporate law in India is governed by the Companies Act, 2013, which provides a comprehensive framework for the incorporation, regulation, and winding up of companies. This legislation ensures transparency, accountability, and good corporate governance practices across all business entities operating in India.",
        image: "📄",
        date: "2025-01-15"
    },
    {
        id: 2,
        title: "Family Law: Recent Changes and Implications",
        excerpt: "Exploring the latest amendments in family law and their impact on legal proceedings...",
        content: "Recent amendments to family law have introduced significant changes in how divorce, child custody, and property division cases are handled. These changes aim to provide faster resolution and better protection for all parties involved.",
        image: "👨‍👩‍👧‍👦",
        date: "2025-01-10"
    },
    {
        id: 3,
        title: "Real Estate Law: Property Rights and Disputes",
        excerpt: "Essential information about property rights, title verification, and dispute resolution...",
        content: "Real estate law encompasses various aspects including property rights, title verification, land acquisition, and dispute resolution. Understanding these legal frameworks is crucial for both buyers and sellers in real estate transactions.",
        image: "🏠",
        date: "2025-01-05"
    }
];

const galleryData = [
    { id: 1, title: "Court Proceedings", image: "⚖️", description: "Professional court proceedings and legal consultations" },
    { id: 2, title: "Client Meetings", image: "🤝", description: "Meeting with clients to discuss case strategies" },
    { id: 3, title: "Legal Documents", image: "📋", description: "Preparation and review of important legal documents" },
    { id: 4, title: "Office Environment", image: "🏢", description: "Our professional office environment" },
    { id: 5, title: "Team Collaboration", image: "👥", description: "Our legal team working together" },
    { id: 6, title: "Legal Library", image: "📚", description: "Our comprehensive legal library and resources" }
];

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message')
        };
        
        // Simple validation
        if (!data.name || !data.email || !data.message) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Here you would typically send the data to your server
        // For now, we'll just show a success message
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
}

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = 'var(--white)';
        navbar.style.backdropFilter = 'none';
    }
});

// FAQ Toggle
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const isActive = question.classList.contains('active');
        
        // Close all other FAQ items
        document.querySelectorAll('.faq-question').forEach(q => {
            q.classList.remove('active');
            q.nextElementSibling.classList.remove('active');
        });
        
        // Toggle current item
        if (!isActive) {
            question.classList.add('active');
            answer.classList.add('active');
        }
    });
});

// Blog functionality
let currentBlogIndex = 0;

function loadBlogs() {
    const blogGrid = document.getElementById('blogGrid');
    if (!blogGrid) return;
    
    // Show only 3 latest blogs
    const displayBlogs = blogData.slice(0, 3);
    
    blogGrid.innerHTML = displayBlogs.map(blog => `
        <div class="blog-card" onclick="openBlogModal(${blog.id})">
            <div class="blog-image">${blog.image}</div>
            <div class="blog-content">
                <h3 class="blog-title">${blog.title}</h3>
                <p class="blog-excerpt">${blog.excerpt}</p>
            </div>
        </div>
    `).join('');
}

function openBlogModal(blogId) {
    const blog = blogData.find(b => b.id === blogId);
    if (!blog) return;
    
    const modal = document.getElementById('blogModal');
    const content = document.getElementById('blogModalContent');
    
    content.innerHTML = `
        <h2>${blog.title}</h2>
        <div class="blog-modal-image">${blog.image}</div>
        <div class="blog-modal-date">${new Date(blog.date).toLocaleDateString()}</div>
        <div class="blog-modal-content">${blog.content}</div>
    `;
    
    modal.style.display = 'block';
}

// Gallery functionality
let currentGalleryIndex = 0;

function loadGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    // Show only 6 items
    const displayGallery = galleryData.slice(0, 6);
    
    galleryGrid.innerHTML = displayGallery.map(item => `
        <div class="gallery-item" onclick="openGalleryModal(${item.id})">
            <div class="gallery-image">${item.image}</div>
            <div class="gallery-caption">${item.title}</div>
        </div>
    `).join('');
}

function openGalleryModal(itemId) {
    const item = galleryData.find(g => g.id === itemId);
    if (!item) return;
    
    const modal = document.getElementById('galleryModal');
    const content = document.getElementById('galleryModalContent');
    
    content.innerHTML = `
        <h2>${item.title}</h2>
        <div class="gallery-modal-image">${item.image}</div>
        <p class="gallery-modal-description">${item.description}</p>
    `;
    
    modal.style.display = 'block';
}

// Modal close functionality
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    document.querySelectorAll('.modal').forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Blog navigation
document.getElementById('prevBlog')?.addEventListener('click', () => {
    // Implement blog navigation logic
    console.log('Previous blog');
});

document.getElementById('nextBlog')?.addEventListener('click', () => {
    // Implement blog navigation logic
    console.log('Next blog');
});

// Gallery navigation
document.getElementById('prevGallery')?.addEventListener('click', () => {
    // Implement gallery navigation logic
    console.log('Previous gallery');
});

document.getElementById('nextGallery')?.addEventListener('click', () => {
    // Implement gallery navigation logic
    console.log('Next gallery');
});

// Simple animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .stat, .about-text, .review-card, .blog-card, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Initialize content when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadBlogs();
    loadGallery();
    initializeWebsiteSync();
    
    // Trigger animations when elements come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    document.querySelectorAll('.service-card, .review-card, .blog-card, .practice-card, section').forEach(el => {
        observer.observe(el);
    });
});

// Initialize website sync with admin panel
function initializeWebsiteSync() {
    // Load saved website data
    loadWebsiteData();
    
    // Listen for admin panel updates
    if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('website-updates');
        channel.onmessage = (event) => {
            if (event.data.type === 'content-updated') {
                updateWebsiteContent(event.data.data);
            }
        };
    }
}

// ChatGPT Functions
function toggleChatGPT() {
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
    } else {
        body.style.display = 'none';
        toggle.textContent = '▼';
        toggle.style.transform = 'rotate(0deg)';
        console.log('ChatGPT closed');
    }
}

function handleChatGPTKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatGPTMessage();
    }
}

async function sendChatGPTMessage() {
    const input = document.getElementById('chatgpt-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addChatGPTMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    addTypingIndicator();
    
    try {
        const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, context: 'legal_website' })
        });
        
        const data = await response.json();
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Add bot response
        addChatGPTMessage(data.response, 'bot');
        
    } catch (error) {
        console.error('ChatGPT error:', error);
        removeTypingIndicator();
        addChatGPTMessage('Sorry, I\'m having trouble connecting right now. Please try again later.', 'bot');
    }
}

function addChatGPTMessage(message, type) {
    const messagesContainer = document.getElementById('chatgpt-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatgpt-message ${type}`;
    messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addTypingIndicator() {
    const messagesContainer = document.getElementById('chatgpt-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chatgpt-message bot';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = '<div class="message-content">🤖 AI is typing...</div>';
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Load website data from localStorage
function loadWebsiteData() {
    const savedData = localStorage.getItem('websiteData');
    if (savedData) {
        const websiteData = JSON.parse(savedData);
        updateWebsiteContent(websiteData);
    }
}

// Update website content with new data
function updateWebsiteContent(websiteData) {
    // Update hero section
    if (websiteData.hero) {
        const heroTitle = document.querySelector('.hero h1');
        const heroSubtitle = document.querySelector('.hero p');
        const ctaButton = document.querySelector('.hero .cta-button');
        const heroSection = document.querySelector('.hero');
        
        if (heroTitle) heroTitle.textContent = websiteData.hero.title;
        if (heroSubtitle) heroSubtitle.textContent = websiteData.hero.subtitle;
        if (ctaButton) ctaButton.textContent = websiteData.hero.cta;
        if (heroSection) heroSection.style.backgroundColor = websiteData.hero.bgColor;
    }
    
    // Update about section
    if (websiteData.about) {
        const aboutTitle = document.querySelector('#about h2');
        const aboutContent = document.querySelector('#about .about-content');
        
        if (aboutTitle) aboutTitle.textContent = websiteData.about.title;
        if (aboutContent) aboutContent.innerHTML = websiteData.about.content;
        
        // Update statistics
        if (websiteData.about.stats) {
            const stats = document.querySelectorAll('.stat-item .stat-number');
            if (stats.length >= 3) {
                stats[0].textContent = websiteData.about.stats.years;
                stats[1].textContent = websiteData.about.stats.cases;
                stats[2].textContent = websiteData.about.stats.focus;
            }
        }
    }
    
    // Update founders section
    if (websiteData.founders && websiteData.founders.length >= 2) {
        const founderCards = document.querySelectorAll('.founder-card');
        
        // Update founder 1
        if (founderCards[0]) {
            const name = founderCards[0].querySelector('h3');
            const title = founderCards[0].querySelector('.founder-title');
            const desc = founderCards[0].querySelector('.founder-description');
            const expertise = founderCards[0].querySelector('.founder-expertise');
            
            if (name) name.textContent = websiteData.founders[0].name;
            if (title) title.textContent = websiteData.founders[0].title;
            if (desc) desc.textContent = websiteData.founders[0].description;
            if (expertise) {
                expertise.innerHTML = websiteData.founders[0].expertise.map(exp => 
                    `<span class="expertise-tag">${exp}</span>`
                ).join('');
            }
        }
        
        // Update founder 2
        if (founderCards[1]) {
            const name = founderCards[1].querySelector('h3');
            const title = founderCards[1].querySelector('.founder-title');
            const desc = founderCards[1].querySelector('.founder-description');
            const expertise = founderCards[1].querySelector('.founder-expertise');
            
            if (name) name.textContent = websiteData.founders[1].name;
            if (title) title.textContent = websiteData.founders[1].title;
            if (desc) desc.textContent = websiteData.founders[1].description;
            if (expertise) {
                expertise.innerHTML = websiteData.founders[1].expertise.map(exp => 
                    `<span class="expertise-tag">${exp}</span>`
                ).join('');
            }
        }
    }
    
    // Update practice areas
    if (websiteData.practiceAreas) {
        websiteData.practiceAreas.forEach((area, index) => {
            const serviceCard = document.querySelector(`.service-card:nth-child(${index + 1})`);
            if (serviceCard) {
                const title = serviceCard.querySelector('h3');
                const description = serviceCard.querySelector('p');
                
                if (title) title.textContent = area.title;
                if (description) description.textContent = area.description;
            }
        });
    }
    
    // Update contact information
    if (websiteData.contact) {
        // Update contact section
        const contactItems = document.querySelectorAll('.contact-details .contact-item');
        if (contactItems.length >= 3) {
            contactItems[0].innerHTML = `<strong>Phone:</strong> ${websiteData.contact.phone}`;
            contactItems[1].innerHTML = `<strong>Email:</strong> ${websiteData.contact.email}`;
            contactItems[2].innerHTML = `<strong>Location:</strong> ${websiteData.contact.address}`;
        }
        
        // Update footer
        const footerSection = document.querySelector('.footer-section:nth-child(3)');
        if (footerSection) {
            const footerItems = footerSection.querySelectorAll('p');
            if (footerItems.length >= 3) {
                footerItems[1].textContent = `Phone: ${websiteData.contact.phone}`;
                footerItems[2].textContent = `Email: ${websiteData.contact.email}`;
                footerItems[3].textContent = websiteData.contact.address;
            }
        }
    }
    
    // Update website settings
    if (websiteData.settings) {
        document.title = websiteData.settings.siteTitle;
        
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) metaDescription.setAttribute('content', websiteData.settings.siteDescription);
        
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) metaKeywords.setAttribute('content', websiteData.settings.metaKeywords);
        
        // Update CSS variables
        document.documentElement.style.setProperty('--primary-color', websiteData.settings.primaryColor);
        document.documentElement.style.setProperty('--secondary-color', websiteData.settings.secondaryColor);
    }
}
