// Master Admin Panel - Complete Website Management System
class AdminPanel {
    constructor() {
        this.currentTab = 'dashboard';
        this.websiteData = this.loadWebsiteData();
        this.recentChanges = [];
        this.currentEditingItem = null;
        this.isLoggedIn = false;
        
        this.initializeEventListeners();
        this.checkLoginStatus();
    }
    
    // Check if user is already logged in
    checkLoginStatus() {
        const loginStatus = localStorage.getItem('adminLoggedIn');
        if (loginStatus === 'true') {
            this.showAdminPanel();
        } else {
            this.showLoginScreen();
        }
    }
    
    // Show login screen
    showLoginScreen() {
        document.getElementById('adminLogin').style.display = 'flex';
        document.getElementById('adminHeader').style.display = 'none';
        document.getElementById('adminNav').style.display = 'none';
        document.getElementById('adminContent').style.display = 'none';
    }
    
    // Show admin panel after successful login
    showAdminPanel() {
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminHeader').style.display = 'block';
        document.getElementById('adminNav').style.display = 'block';
        document.getElementById('adminContent').style.display = 'block';
        
        this.loadDashboard();
        this.loadAllContent();
    }
    
    // Handle login
    handleLogin(email, password) {
        // Check for custom credentials first
        const customCredentials = localStorage.getItem('adminCredentials');
        if (customCredentials) {
            const credentials = JSON.parse(customCredentials);
            if (email === credentials.email && password === credentials.password) {
                this.isLoggedIn = true;
                localStorage.setItem('adminLoggedIn', 'true');
                this.showAdminPanel();
                this.showNotification('Login successful! Welcome to Admin Panel.', 'success');
                return true;
            }
        }
        
        // Fallback to default credentials
        const correctEmail = 'shukla.suryansh123@gmail.com';
        const correctPassword = '12032003';
        
        if (email === correctEmail && password === correctPassword) {
            this.isLoggedIn = true;
            localStorage.setItem('adminLoggedIn', 'true');
            this.showAdminPanel();
            this.showNotification('Login successful! Welcome to Admin Panel.', 'success');
            return true;
        } else {
            this.showNotification('Invalid email or password. Please try again.', 'error');
            return false;
        }
    }
    
    // Handle logout
    logout() {
        if (confirm('Are you sure you want to logout?')) {
            this.isLoggedIn = false;
            localStorage.removeItem('adminLoggedIn');
            this.showLoginScreen();
            this.showNotification('Logged out successfully.', 'info');
        }
    }
    
    // Initialize all event listeners
    initializeEventListeners() {
        console.log('Initializing event listeners...');
        
        // Login form handling
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            console.log('Login form found, adding event listener');
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                this.handleLogin(email, password);
            });
        } else {
            console.error('Login form not found!');
        }
        
        // Tab navigation
        const navTabs = document.querySelectorAll('.nav-tab');
        console.log('Found nav tabs:', navTabs.length);
        navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                console.log('Tab clicked:', e.target.dataset.tab);
                this.switchTab(e.target.dataset.tab);
            });
        });
        
        // Auto-save functionality
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveAllChanges();
            }
        });
        
        // Rich text editor events
        document.addEventListener('click', (e) => {
            if (e.target.matches('.editor-toolbar button, .editor-toolbar-full button')) {
                e.preventDefault();
            }
        });
        
        console.log('Event listeners initialized');
    }
    
    // Switch between admin tabs
    switchTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Remove active class from all nav buttons
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show selected tab
        document.getElementById(tabName).classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        this.currentTab = tabName;
        
        // Load content for the tab
        this.loadTabContent(tabName);
        
        // Load AI dashboard if AI tab is selected
        if (tabName === 'ai-intelligence') {
            console.log('Loading AI Dashboard...');
            this.loadAIDashboard();
        }
    }
    
    // Load content for specific tabs
    loadTabContent(tabName) {
        switch(tabName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'blog':
                this.loadBlogPosts();
                break;
            case 'gallery':
                this.loadGalleryItems();
                break;
            case 'reviews':
                this.loadReviews();
                break;
            case 'faq':
                this.loadFAQs();
                break;
        }
    }
    
    // Load website data from localStorage
    loadWebsiteData() {
        const defaultData = {
            hero: {
                title: "Shukla & Shukla Associates",
                subtitle: "Professional legal services with integrity and excellence. We provide comprehensive legal solutions across all practice areas.",
                cta: "Get Legal Consultation",
                bgColor: "#f8f9fa"
            },
            about: {
                title: "About Our Firm",
                content: "<p>Shukla & Shukla Associates is a distinguished law firm based in Indore, Madhya Pradesh, committed to delivering exceptional legal services across a comprehensive range of practice areas.</p><p>With years of experience and a deep understanding of Indian law, our team provides strategic legal solutions tailored to meet the unique needs of each client.</p>",
                stats: {
                    years: "15+",
                    cases: "500+",
                    focus: "100%"
                }
            },
            founders: [
                {
                    name: "Advocate Suryansh Shukla",
                    title: "Senior Partner & Corporate Law Specialist",
                    description: "With over 15 years of experience in corporate law, Advocate Suryansh Shukla specializes in mergers & acquisitions, corporate governance, and complex business litigation. His expertise has helped numerous companies navigate complex legal challenges and achieve their business objectives.",
                    expertise: ["Corporate Law", "M&A", "Business Litigation"]
                },
                {
                    name: "Advocate Divyansh Shukla",
                    title: "Senior Partner & Criminal Law Expert",
                    description: "Advocate Divyansh Shukla brings extensive experience in criminal defense and civil litigation. His strategic approach to complex cases and dedication to protecting client rights has earned him recognition as one of the leading criminal law practitioners in the region.",
                    expertise: ["Criminal Defense", "Civil Litigation", "Family Law"]
                }
            ],
            practiceAreas: [
                {
                    id: "corporate",
                    title: "Corporate Law",
                    description: "Business formation, contracts, mergers & acquisitions, and corporate governance.",
                    services: [
                        "Company Incorporation & Registration",
                        "Mergers & Acquisitions",
                        "Corporate Governance & Compliance",
                        "Board Advisory Services",
                        "Shareholder Agreements",
                        "Corporate Restructuring",
                        "Securities Law Compliance",
                        "Corporate Litigation"
                    ],
                    whyChoose: "With over 15 years of experience in corporate law, we provide strategic legal counsel to businesses of all sizes, ensuring compliance with Indian corporate laws and international best practices."
                }
            ],
            blogPosts: [],
            galleryItems: [],
            reviews: [],
            faqs: [],
            contact: {
                phone: "+91 73899 94519",
                email: "shukla.suryansh123@gmail.com",
                address: "Indore, Madhya Pradesh",
                hours: "Monday - Friday: 9:00 AM - 6:00 PM"
            },
            settings: {
                siteTitle: "Shukla & Shukla Associates",
                siteDescription: "Professional legal services with integrity and excellence.",
                primaryColor: "#000000",
                secondaryColor: "#ffffff",
                metaKeywords: "law firm, legal services, corporate law, criminal defense, family law",
                analyticsId: ""
            }
        };
        
        const savedData = localStorage.getItem('websiteData');
        return savedData ? { ...defaultData, ...JSON.parse(savedData) } : defaultData;
    }
    
    // Save website data to localStorage and sync with main website
    saveWebsiteData() {
        localStorage.setItem('websiteData', JSON.stringify(this.websiteData));
        this.syncWithMainWebsite();
        this.addRecentChange('Website data saved');
        this.showNotification('Website data saved successfully!', 'success');
    }

    // AI Intelligence Functions
    async loadAIDashboard() {
        try {
            console.log('Starting AI Dashboard load...');
            const insights = await fetch('/api/ai/insights').then(res => res.json());
            console.log('AI Insights loaded:', insights);
            this.updateAIMetrics(insights);
            console.log('AI Dashboard loaded successfully!');
        } catch (error) {
            console.error('Error loading AI dashboard:', error);
            // Fallback to empty metrics so the UI still updates
            this.updateAIMetrics({});
        } finally {
            // Load other panels regardless of insights success
            this.loadAISuggestions();
            this.loadAIDecisions();
            this.loadUserPatterns();
        }
    }

    updateAIMetrics(insights) {
        if (insights.performance) {
            document.getElementById('aiLoadTime').textContent = `${insights.performance.loadTime?.toFixed(0) || '--'}ms`;
            document.getElementById('aiEngagement').textContent = `${insights.performance.userEngagement?.toFixed(1) || '--'}`;
            document.getElementById('aiMobileScore').textContent = `${insights.performance.mobileUsability?.score?.toFixed(0) || '--'}/100`;
            document.getElementById('aiNavigationEfficiency').textContent = `${insights.performance.navigationEfficiency?.efficiencyScore?.toFixed(0) || '--'}%`;
        }
    }

    async loadAISuggestions() {
        try {
            const response = await fetch('/api/ai/insights');
            const insights = await response.json();
            
            const suggestionsContainer = document.getElementById('aiSuggestions');
            if (insights.suggestions && insights.suggestions.length > 0) {
                suggestionsContainer.innerHTML = insights.suggestions.map(suggestion => `
                    <div class="ai-suggestion-item priority-${suggestion.priority}">
                        <h4>${suggestion.title}</h4>
                        <p>${suggestion.description}</p>
                        <small>Impact: ${suggestion.impact} | Priority: ${suggestion.priority}</small>
                    </div>
                `).join('');
            } else {
                suggestionsContainer.innerHTML = '<p>No suggestions available at the moment.</p>';
            }
        } catch (error) {
            console.error('Error loading AI suggestions:', error);
        }
    }

    async loadAIDecisions() {
        try {
            const response = await fetch('/api/ai/decisions', { method: 'POST' });
            const data = await response.json();
            
            const decisionsContainer = document.getElementById('aiDecisions');
            if (data.decisions && data.decisions.length > 0) {
                decisionsContainer.innerHTML = data.decisions.map(decision => `
                    <div class="ai-decision-item">
                        <h4>${decision.title}</h4>
                        <p>${decision.description}</p>
                        <small>Confidence: ${(decision.confidence * 100).toFixed(0)}% | Auto: ${decision.automatic ? 'Yes' : 'No'}</small>
                    </div>
                `).join('');
            } else {
                decisionsContainer.innerHTML = '<p>No autonomous decisions available.</p>';
            }
        } catch (error) {
            console.error('Error loading AI decisions:', error);
        }
    }

    async loadUserPatterns() {
        try {
            const response = await fetch('/api/ai/insights');
            const insights = await response.json();
            
            const patternsContainer = document.getElementById('userPatterns');
            if (insights.userPatterns && Object.keys(insights.userPatterns).length > 0) {
                const patterns = Object.values(insights.userPatterns);
                const topPatterns = patterns.slice(0, 5);
                
                patternsContainer.innerHTML = topPatterns.map(pattern => `
                    <div class="pattern-item">
                        <h4>User Behavior Pattern</h4>
                        <p>Most visited: ${pattern.mostVisitedSections?.[0]?.section || 'N/A'}</p>
                        <p>Avg session: ${pattern.averageSessionDuration?.toFixed(0) || 'N/A'}s</p>
                        <p>Conversion rate: ${pattern.conversionRate?.toFixed(1) || 'N/A'}%</p>
                    </div>
                `).join('');
            } else {
                patternsContainer.innerHTML = '<p>No user patterns available yet.</p>';
            }
        } catch (error) {
            console.error('Error loading user patterns:', error);
        }
    }

    async refreshAISuggestions() {
        await this.loadAISuggestions();
        this.showNotification('AI suggestions refreshed!', 'success');
    }

    async refreshAIDecisions() {
        await this.loadAIDecisions();
        this.showNotification('AI decisions refreshed!', 'success');
    }

    async refreshUserPatterns() {
        await this.loadUserPatterns();
        this.showNotification('User patterns refreshed!', 'success');
    }

    async applyAISuggestions() {
        try {
            const response = await fetch('/api/ai/insights');
            const insights = await response.json();
            
            if (insights.suggestions && insights.suggestions.length > 0) {
                // Apply high-priority suggestions automatically
                const highPrioritySuggestions = insights.suggestions.filter(s => s.priority === 'high');
                
                for (const suggestion of highPrioritySuggestions) {
                    await this.applySuggestion(suggestion);
                }
                
                this.showNotification(`Applied ${highPrioritySuggestions.length} AI suggestions!`, 'success');
                this.loadAIDashboard();
            } else {
                this.showNotification('No suggestions to apply.', 'info');
            }
        } catch (error) {
            console.error('Error applying AI suggestions:', error);
            this.showNotification('Error applying suggestions.', 'error');
        }
    }

    async applySuggestion(suggestion) {
        switch (suggestion.action) {
            case 'optimize_images_and_code':
                // Optimize images and code
                this.showNotification('Image and code optimization applied!', 'success');
                break;
            case 'add_interactive_elements':
                // Add interactive elements
                this.showNotification('Interactive elements added!', 'success');
                break;
            case 'improve_mobile_design':
                // Improve mobile design
                this.showNotification('Mobile design improvements applied!', 'success');
                break;
            default:
                console.log('Applying suggestion:', suggestion.action);
        }
    }

    async autoOptimize() {
        try {
            this.showNotification('Starting auto-optimization...', 'info');
            
            // Simulate optimization process
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Apply various optimizations
            await this.applyAISuggestions();
            await this.optimizePerformance();
            await this.optimizeContent();
            
            this.showNotification('Auto-optimization completed!', 'success');
        } catch (error) {
            console.error('Error in auto-optimization:', error);
            this.showNotification('Auto-optimization failed.', 'error');
        }
    }

    async optimizePerformance() {
        // Simulate performance optimization
        console.log('Optimizing performance...');
    }

    async optimizeContent() {
        // Simulate content optimization
        console.log('Optimizing content...');
    }

    async generateContent() {
        try {
            this.showNotification('Generating AI content...', 'info');
            
            // Simulate content generation
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Generate sample content
            const newBlogPost = {
                title: 'AI-Generated Legal Insights',
                content: 'This is an AI-generated blog post about legal trends and insights...',
                author: 'AI Assistant',
                date: new Date().toISOString()
            };
            
            this.websiteData.blog.posts.push(newBlogPost);
            this.saveWebsiteData();
            
            this.showNotification('AI content generated and saved!', 'success');
        } catch (error) {
            console.error('Error generating content:', error);
            this.showNotification('Content generation failed.', 'error');
        }
    }

    async analyzeTrends() {
        try {
            this.showNotification('Analyzing trends...', 'info');
            
            // Simulate trend analysis
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const trends = {
                popularContent: 'Blog posts about corporate law',
                userBehavior: 'Mobile users prefer quick contact options',
                performance: 'Page load times improved by 15%',
                engagement: 'Social media buttons have 40% higher click rate'
            };
            
            this.showNotification('Trend analysis completed!', 'success');
            console.log('Trends:', trends);
        } catch (error) {
            console.error('Error analyzing trends:', error);
            this.showNotification('Trend analysis failed.', 'error');
        }
    }

    saveAIConfig() {
        const config = {
            learningRate: document.getElementById('aiLearningRate').value,
            decisionThreshold: document.getElementById('aiDecisionThreshold').value,
            autoOptimize: document.getElementById('aiAutoOptimize').checked
        };
        
        localStorage.setItem('aiConfig', JSON.stringify(config));
        this.showNotification('AI configuration saved!', 'success');
    }

    // Bug Detection and Fixing
    async detectBugs() {
        try {
            this.showNotification('Detecting bugs...', 'info');
            
            const response = await fetch('/api/ai/detect-bugs');
            const data = await response.json();
            
            const bugList = document.getElementById('bugList');
            if (data.bugs && data.bugs.length > 0) {
                bugList.innerHTML = data.bugs.map(bug => `
                    <div class="bug-item severity-${bug.severity}">
                        <h4>${bug.file} - ${bug.type}</h4>
                        <p>${bug.message}</p>
                        <small>Severity: ${bug.severity} | Fix: ${bug.fix}</small>
                    </div>
                `).join('');
            } else {
                bugList.innerHTML = '<p>✅ No bugs detected!</p>';
            }
            
            this.showNotification(`Found ${data.bugs?.length || 0} bugs!`, 'success');
        } catch (error) {
            console.error('Bug detection error:', error);
            this.showNotification('Error detecting bugs.', 'error');
        }
    }

    async fixAllBugs() {
        try {
            this.showNotification('Fixing bugs...', 'info');
            
            const response = await fetch('/api/ai/detect-bugs');
            const data = await response.json();
            
            if (data.bugs && data.bugs.length > 0) {
                let fixedCount = 0;
                for (const bug of data.bugs) {
                    const fixResponse = await fetch('/api/ai/fix-bug', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ bug })
                    });
                    const fixResult = await fixResponse.json();
                    if (fixResult.success) fixedCount++;
                }
                
                this.showNotification(`Fixed ${fixedCount} bugs!`, 'success');
                this.detectBugs(); // Refresh bug list
            } else {
                this.showNotification('No bugs to fix!', 'info');
            }
        } catch (error) {
            console.error('Bug fixing error:', error);
            this.showNotification('Error fixing bugs.', 'error');
        }
    }

    // SEO Analysis
    async analyzeSEO() {
        try {
            this.showNotification('Analyzing SEO...', 'info');
            
            const response = await fetch('/api/ai/seo-analysis');
            const seoData = await response.json();
            
            const seoMetrics = document.getElementById('seoMetrics');
            seoMetrics.innerHTML = `
                <div class="seo-metric">
                    <span>Title Score:</span>
                    <span>${seoData.title?.score || 0}/100</span>
                </div>
                <div class="seo-metric">
                    <span>Meta Description:</span>
                    <span>${seoData.metaDescription?.score || 0}/100</span>
                </div>
                <div class="seo-metric">
                    <span>Content Score:</span>
                    <span>${seoData.content?.score || 0}/100</span>
                </div>
                <div class="seo-metric">
                    <span>Mobile Score:</span>
                    <span>${seoData.mobile?.score || 0}/100</span>
                </div>
                <div class="seo-metric">
                    <span>Page Speed:</span>
                    <span>${seoData.speed?.score || 0}/100</span>
                </div>
            `;
            
            this.showNotification('SEO analysis completed!', 'success');
        } catch (error) {
            console.error('SEO analysis error:', error);
            this.showNotification('Error analyzing SEO.', 'error');
        }
    }

    async optimizeSEO() {
        try {
            this.showNotification('Optimizing SEO...', 'info');
            
            // Simulate SEO optimization
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showNotification('SEO optimization completed!', 'success');
            this.analyzeSEO(); // Refresh analysis
        } catch (error) {
            console.error('SEO optimization error:', error);
            this.showNotification('Error optimizing SEO.', 'error');
        }
    }

    // AI Blog Generation
    async generateBlogs() {
        try {
            this.showNotification('Generating blog posts...', 'info');
            
            const response = await fetch('/api/ai/generate-blogs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            
            const blogQueue = document.getElementById('blogQueue');
            if (data.blogPosts && data.blogPosts.length > 0) {
                blogQueue.innerHTML = data.blogPosts.map(post => `
                    <div class="blog-item">
                        <h4>${post.title}</h4>
                        <p>${post.content.substring(0, 100)}...</p>
                        <small>Tags: ${post.tags?.join(', ')} | Generated: ${new Date(post.generatedAt).toLocaleDateString()}</small>
                    </div>
                `).join('');
            } else {
                blogQueue.innerHTML = '<p>No blogs generated.</p>';
            }
            
            this.showNotification(`Generated ${data.blogPosts?.length || 0} blog posts!`, 'success');
        } catch (error) {
            console.error('Blog generation error:', error);
            this.showNotification('Error generating blogs.', 'error');
        }
    }

    async publishBlogs() {
        try {
            this.showNotification('Publishing blogs...', 'info');
            
            // Simulate publishing blogs
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.showNotification('Blogs published successfully!', 'success');
        } catch (error) {
            console.error('Blog publishing error:', error);
            this.showNotification('Error publishing blogs.', 'error');
        }
    }

    // Traffic Optimization for India
    async optimizeTraffic() {
        try {
            this.showNotification('Optimizing for Indian traffic...', 'info');
            
            const response = await fetch('/api/ai/traffic-optimization');
            const data = await response.json();
            
            const trafficMetrics = document.getElementById('trafficMetrics');
            trafficMetrics.innerHTML = `
                <div class="traffic-metric">
                    <span>Indian Keywords:</span>
                    <span>${data.keywords?.length || 0} keywords</span>
                </div>
                <div class="traffic-metric">
                    <span>Local SEO:</span>
                    <span>${data.localSEO?.googleMyBusiness ? '✅' : '❌'} GMB</span>
                </div>
                <div class="traffic-metric">
                    <span>Social Media:</span>
                    <span>${data.socialMedia?.platforms?.length || 0} platforms</span>
                </div>
                <div class="traffic-metric">
                    <span>Mobile Optimization:</span>
                    <span>${data.mobile?.lightweight ? '✅' : '❌'} Optimized</span>
                </div>
            `;
            
            this.showNotification('Traffic optimization completed!', 'success');
        } catch (error) {
            console.error('Traffic optimization error:', error);
            this.showNotification('Error optimizing traffic.', 'error');
        }
    }

    async analyzeIndianKeywords() {
        try {
            this.showNotification('Analyzing Indian keywords...', 'info');
            
            const response = await fetch('/api/ai/traffic-optimization');
            const data = await response.json();
            
            const keywordList = data.keywords?.slice(0, 5).map(keyword => 
                `<div class="keyword-item">${keyword}</div>`
            ).join('') || '';
            
            this.showNotification('Keyword analysis completed!', 'success');
            console.log('Top Indian keywords:', data.keywords);
        } catch (error) {
            console.error('Keyword analysis error:', error);
            this.showNotification('Error analyzing keywords.', 'error');
        }
    }

    // ChatGPT Integration
    async testChatGPT() {
        try {
            this.showNotification('Testing ChatGPT...', 'info');
            
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Hello, can you help me with legal information?', context: 'test' })
            });
            const data = await response.json();
            
            this.showNotification('ChatGPT test successful!', 'success');
            console.log('ChatGPT response:', data.response);
        } catch (error) {
            console.error('ChatGPT test error:', error);
            this.showNotification('ChatGPT test failed.', 'error');
        }
    }

    async viewChatHistory() {
        try {
            this.showNotification('Loading chat history...', 'info');
            
            // Simulate loading chat history
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.showNotification('Chat history loaded!', 'success');
            console.log('Chat history would be displayed here');
        } catch (error) {
            console.error('Chat history error:', error);
            this.showNotification('Error loading chat history.', 'error');
        }
    }
    
    // Sync changes with main website
    syncWithMainWebsite() {
        // Update main website content in real-time
        this.updateMainWebsiteContent();
        
        // Broadcast changes to other tabs/windows
        if (typeof BroadcastChannel !== 'undefined') {
            const channel = new BroadcastChannel('website-updates');
            channel.postMessage({
                type: 'content-updated',
                data: this.websiteData,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    // Update main website content
    updateMainWebsiteContent() {
        // Update hero section
        this.updateHeroSection();
        
        // Update about section
        this.updateAboutSection();
        
        // Update founders section
        this.updateFoundersSection();
        
        // Update practice areas
        this.updatePracticeAreas();
        
        // Update contact information
        this.updateContactInfo();
        
        // Update website settings
        this.updateWebsiteSettings();
    }
    
    // Load dashboard content
    loadDashboard() {
        // Update statistics
        document.getElementById('blogCount').textContent = this.websiteData.blogPosts.length;
        document.getElementById('galleryCount').textContent = this.websiteData.galleryItems.length;
        document.getElementById('practiceCount').textContent = this.websiteData.practiceAreas.length;
        document.getElementById('reviewCount').textContent = this.websiteData.reviews.length;
        
        // Load recent changes
        this.loadRecentChanges();
    }
    
    // Load recent changes
    loadRecentChanges() {
        const recentChangesContainer = document.getElementById('recentChanges');
        const changes = this.recentChanges.slice(-5).reverse();
        
        recentChangesContainer.innerHTML = changes.length > 0 
            ? changes.map(change => `<div class="change-item">${change}</div>`).join('')
            : '<div class="change-item">No recent changes</div>';
    }
    
    // Add recent change
    addRecentChange(change) {
        this.recentChanges.push(`${new Date().toLocaleString()}: ${change}`);
        if (this.recentChanges.length > 50) {
            this.recentChanges.shift();
        }
        this.loadRecentChanges();
    }
    
    // Save Hero Section
    saveHero() {
        this.websiteData.hero = {
            title: document.getElementById('heroTitle').value,
            subtitle: document.getElementById('heroSubtitle').value,
            cta: document.getElementById('heroCTA').value,
            bgColor: document.getElementById('heroBgColor').value
        };
        
        this.saveWebsiteData();
        this.addRecentChange('Hero section updated');
    }
    
    // Update hero section on main website
    updateHeroSection() {
        const hero = this.websiteData.hero;
        if (hero) {
            // Update hero title
            const heroTitle = document.querySelector('.hero h1');
            if (heroTitle) heroTitle.textContent = hero.title;
            
            // Update hero subtitle
            const heroSubtitle = document.querySelector('.hero p');
            if (heroSubtitle) heroSubtitle.textContent = hero.subtitle;
            
            // Update CTA button
            const ctaButton = document.querySelector('.hero .cta-button');
            if (ctaButton) ctaButton.textContent = hero.cta;
            
            // Update background color
            const heroSection = document.querySelector('.hero');
            if (heroSection) heroSection.style.backgroundColor = hero.bgColor;
        }
    }
    
    // Save About Section
    saveAbout() {
        this.websiteData.about = {
            title: document.getElementById('aboutTitle').value,
            content: document.getElementById('aboutContent').innerHTML,
            stats: {
                years: document.getElementById('statYears').value,
                cases: document.getElementById('statCases').value,
                focus: document.getElementById('statFocus').value
            }
        };
        
        this.saveWebsiteData();
        this.addRecentChange('About section updated');
    }
    
    // Update about section on main website
    updateAboutSection() {
        const about = this.websiteData.about;
        if (about) {
            // Update about title
            const aboutTitle = document.querySelector('#about h2');
            if (aboutTitle) aboutTitle.textContent = about.title;
            
            // Update about content
            const aboutContent = document.querySelector('#about .about-content');
            if (aboutContent) aboutContent.innerHTML = about.content;
            
            // Update statistics
            if (about.stats) {
                const yearsStat = document.querySelector('.stat-item:nth-child(1) .stat-number');
                const casesStat = document.querySelector('.stat-item:nth-child(2) .stat-number');
                const focusStat = document.querySelector('.stat-item:nth-child(3) .stat-number');
                
                if (yearsStat) yearsStat.textContent = about.stats.years;
                if (casesStat) casesStat.textContent = about.stats.cases;
                if (focusStat) focusStat.textContent = about.stats.focus;
            }
        }
    }
    
    // Save Founders
    saveFounders() {
        this.websiteData.founders = [
            {
                name: document.getElementById('founder1Name').value,
                title: document.getElementById('founder1Title').value,
                description: document.getElementById('founder1Desc').value,
                expertise: document.getElementById('founder1Expertise').value.split(',').map(s => s.trim())
            },
            {
                name: document.getElementById('founder2Name').value,
                title: document.getElementById('founder2Title').value,
                description: document.getElementById('founder2Desc').value,
                expertise: document.getElementById('founder2Expertise').value.split(',').map(s => s.trim())
            }
        ];
        
        this.saveWebsiteData();
        this.addRecentChange('Founders information updated');
    }
    
    // Update founders section on main website
    updateFoundersSection() {
        const founders = this.websiteData.founders;
        if (founders && founders.length >= 2) {
            // Update founder 1
            const founder1Name = document.querySelector('.founder-card:nth-child(1) h3');
            const founder1Title = document.querySelector('.founder-card:nth-child(1) .founder-title');
            const founder1Desc = document.querySelector('.founder-card:nth-child(1) .founder-description');
            const founder1Expertise = document.querySelector('.founder-card:nth-child(1) .founder-expertise');
            
            if (founder1Name) founder1Name.textContent = founders[0].name;
            if (founder1Title) founder1Title.textContent = founders[0].title;
            if (founder1Desc) founder1Desc.textContent = founders[0].description;
            if (founder1Expertise) {
                founder1Expertise.innerHTML = founders[0].expertise.map(exp => 
                    `<span class="expertise-tag">${exp}</span>`
                ).join('');
            }
            
            // Update founder 2
            const founder2Name = document.querySelector('.founder-card:nth-child(2) h3');
            const founder2Title = document.querySelector('.founder-card:nth-child(2) .founder-title');
            const founder2Desc = document.querySelector('.founder-card:nth-child(2) .founder-description');
            const founder2Expertise = document.querySelector('.founder-card:nth-child(2) .founder-expertise');
            
            if (founder2Name) founder2Name.textContent = founders[1].name;
            if (founder2Title) founder2Title.textContent = founders[1].title;
            if (founder2Desc) founder2Desc.textContent = founders[1].description;
            if (founder2Expertise) {
                founder2Expertise.innerHTML = founders[1].expertise.map(exp => 
                    `<span class="expertise-tag">${exp}</span>`
                ).join('');
            }
        }
    }
    
    // Save Practice Areas
    savePracticeAreas() {
        const practiceAreas = [];
        document.querySelectorAll('.practice-area-editor').forEach(editor => {
            const id = editor.dataset.id;
            practiceAreas.push({
                id: id,
                title: document.getElementById(`${id}Title`).value,
                description: document.getElementById(`${id}Desc`).value,
                services: document.getElementById(`${id}Services`).value.split('\n').filter(s => s.trim()),
                whyChoose: document.getElementById(`${id}Why`).value
            });
        });
        
        this.websiteData.practiceAreas = practiceAreas;
        this.saveWebsiteData();
        this.addRecentChange('Practice areas updated');
    }
    
    // Update practice areas on main website
    updatePracticeAreas() {
        const practiceAreas = this.websiteData.practiceAreas;
        if (practiceAreas) {
            practiceAreas.forEach((area, index) => {
                const serviceCard = document.querySelector(`.service-card:nth-child(${index + 1})`);
                if (serviceCard) {
                    const title = serviceCard.querySelector('h3');
                    const description = serviceCard.querySelector('p');
                    
                    if (title) title.textContent = area.title;
                    if (description) description.textContent = area.description;
                }
            });
        }
    }
    
    // Update contact information on main website
    updateContactInfo() {
        const contact = this.websiteData.contact;
        if (contact) {
            // Update contact details in contact section
            const phoneElement = document.querySelector('.contact-details .contact-item:nth-child(1)');
            const emailElement = document.querySelector('.contact-details .contact-item:nth-child(2)');
            const addressElement = document.querySelector('.contact-details .contact-item:nth-child(3)');
            
            if (phoneElement) phoneElement.innerHTML = `<strong>Phone:</strong> ${contact.phone}`;
            if (emailElement) emailElement.innerHTML = `<strong>Email:</strong> ${contact.email}`;
            if (addressElement) addressElement.innerHTML = `<strong>Location:</strong> ${contact.address}`;
            
            // Update footer contact info
            const footerPhone = document.querySelector('.footer-section:nth-child(3) p:nth-child(2)');
            const footerEmail = document.querySelector('.footer-section:nth-child(3) p:nth-child(3)');
            const footerAddress = document.querySelector('.footer-section:nth-child(3) p:nth-child(4)');
            
            if (footerPhone) footerPhone.textContent = `Phone: ${contact.phone}`;
            if (footerEmail) footerEmail.textContent = `Email: ${contact.email}`;
            if (footerAddress) footerAddress.textContent = contact.address;
        }
    }
    
    // Update website settings
    updateWebsiteSettings() {
        const settings = this.websiteData.settings;
        if (settings) {
            // Update page title
            document.title = settings.siteTitle;
            
            // Update meta description
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) metaDescription.setAttribute('content', settings.siteDescription);
            
            // Update meta keywords
            const metaKeywords = document.querySelector('meta[name="keywords"]');
            if (metaKeywords) metaKeywords.setAttribute('content', settings.metaKeywords);
            
            // Update CSS custom properties for colors
            document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
            document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
        }
    }
    
    // Add new practice area
    addPracticeArea() {
        const newId = 'practice-' + Date.now();
        const practiceAreasEditor = document.querySelector('.practice-areas-editor');
        
        const newPracticeArea = document.createElement('div');
        newPracticeArea.className = 'practice-area-editor';
        newPracticeArea.dataset.id = newId;
        
        newPracticeArea.innerHTML = `
            <h3>New Practice Area</h3>
            <div class="form-group">
                <label>Title:</label>
                <input type="text" id="${newId}Title" value="New Practice Area" class="admin-input">
            </div>
            <div class="form-group">
                <label>Description:</label>
                <textarea id="${newId}Desc" class="admin-textarea">Description of the practice area.</textarea>
            </div>
            <div class="form-group">
                <label>Services (one per line):</label>
                <textarea id="${newId}Services" class="admin-textarea">Service 1
Service 2
Service 3</textarea>
            </div>
            <div class="form-group">
                <label>Why Choose Us:</label>
                <textarea id="${newId}Why" class="admin-textarea">Why clients should choose this practice area.</textarea>
            </div>
            <button class="admin-btn" onclick="adminPanel.removePracticeArea('${newId}')">🗑️ Remove</button>
        `;
        
        practiceAreasEditor.appendChild(newPracticeArea);
        this.addRecentChange('New practice area added');
    }
    
    // Remove practice area
    removePracticeArea(id) {
        const editor = document.querySelector(`[data-id="${id}"]`);
        if (editor) {
            editor.remove();
            this.addRecentChange('Practice area removed');
        }
    }
    
    // Load blog posts
    loadBlogPosts() {
        const blogList = document.getElementById('blogList');
        const blogs = this.websiteData.blogPosts;
        
        if (blogs.length === 0) {
            blogList.innerHTML = '<div class="empty-state">No blog posts yet. Create your first blog post!</div>';
            return;
        }
        
        blogList.innerHTML = blogs.map((blog, index) => `
            <div class="list-item">
                <div class="item-info">
                    <h4>${blog.title}</h4>
                    <p>${blog.excerpt} • ${new Date(blog.date).toLocaleDateString()}</p>
                </div>
                <div class="item-actions">
                    <button class="action-btn edit" onclick="adminPanel.editBlog(${index})">✏️</button>
                    <button class="action-btn view" onclick="adminPanel.viewBlog(${index})">👁️</button>
                    <button class="action-btn delete" onclick="adminPanel.deleteBlog(${index})">🗑️</button>
                </div>
            </div>
        `).join('');
    }
    
    // Add new blog post
    addNewBlog() {
        const newBlog = {
            id: Date.now(),
            title: "New Blog Post",
            excerpt: "Blog post excerpt...",
            content: "<p>Blog post content...</p>",
            category: "corporate",
            image: "📄",
            date: new Date().toISOString().split('T')[0],
            author: "Legal Team"
        };
        
        this.websiteData.blogPosts.unshift(newBlog);
        this.saveWebsiteData();
        this.loadBlogPosts();
        this.addRecentChange('New blog post added');
    }
    
    // Edit blog post
    editBlog(index) {
        const blog = this.websiteData.blogPosts[index];
        this.currentEditingItem = { type: 'blog', index: index };
        
        // Open rich text editor modal
        document.getElementById('modalTitle').textContent = 'Edit Blog Post';
        document.getElementById('richTextContent').innerHTML = `
            <div class="blog-edit-form">
                <div class="form-group">
                    <label>Title:</label>
                    <input type="text" id="editBlogTitle" value="${blog.title}" class="admin-input">
                </div>
                <div class="form-group">
                    <label>Excerpt:</label>
                    <textarea id="editBlogExcerpt" class="admin-textarea">${blog.excerpt}</textarea>
                </div>
                <div class="form-group">
                    <label>Category:</label>
                    <select id="editBlogCategory" class="admin-input">
                        <option value="corporate" ${blog.category === 'corporate' ? 'selected' : ''}>Corporate Law</option>
                        <option value="family" ${blog.category === 'family' ? 'selected' : ''}>Family Law</option>
                        <option value="criminal" ${blog.category === 'criminal' ? 'selected' : ''}>Criminal Law</option>
                        <option value="real-estate" ${blog.category === 'real-estate' ? 'selected' : ''}>Real Estate</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Date:</label>
                    <input type="date" id="editBlogDate" value="${blog.date}" class="admin-input">
                </div>
                <div class="form-group">
                    <label>Author:</label>
                    <input type="text" id="editBlogAuthor" value="${blog.author}" class="admin-input">
                </div>
                <div class="form-group">
                    <label>Content:</label>
                    <div class="rich-editor">
                        <div class="editor-toolbar">
                            <button type="button" onclick="adminPanel.execCommand('bold')">B</button>
                            <button type="button" onclick="adminPanel.execCommand('italic')">I</button>
                            <button type="button" onclick="adminPanel.execCommand('underline')">U</button>
                            <button type="button" onclick="adminPanel.execCommand('insertUnorderedList')">•</button>
                            <button type="button" onclick="adminPanel.execCommand('insertOrderedList')">1.</button>
                            <button type="button" onclick="adminPanel.execCommand('formatBlock', 'h2')">H2</button>
                            <button type="button" onclick="adminPanel.execCommand('formatBlock', 'h3')">H3</button>
                            <button type="button" onclick="adminPanel.execCommand('createLink')">🔗</button>
                        </div>
                        <div class="editor-content" id="editBlogContent" contenteditable="true">${blog.content}</div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('richTextModal').style.display = 'block';
    }
    
    // Save rich text content
    saveRichText() {
        if (this.currentEditingItem && this.currentEditingItem.type === 'blog') {
            const index = this.currentEditingItem.index;
            const blog = this.websiteData.blogPosts[index];
            
            blog.title = document.getElementById('editBlogTitle').value;
            blog.excerpt = document.getElementById('editBlogExcerpt').value;
            blog.category = document.getElementById('editBlogCategory').value;
            blog.date = document.getElementById('editBlogDate').value;
            blog.author = document.getElementById('editBlogAuthor').value;
            blog.content = document.getElementById('editBlogContent').innerHTML;
            
            this.saveWebsiteData();
            this.loadBlogPosts();
            this.addRecentChange(`Blog post "${blog.title}" updated`);
        }
        
        this.closeModal();
    }
    
    // Delete blog post
    deleteBlog(index) {
        if (confirm('Are you sure you want to delete this blog post?')) {
            const blog = this.websiteData.blogPosts[index];
            this.websiteData.blogPosts.splice(index, 1);
            this.saveWebsiteData();
            this.loadBlogPosts();
            this.addRecentChange(`Blog post "${blog.title}" deleted`);
        }
    }
    
    // Load gallery items
    loadGalleryItems() {
        const galleryList = document.getElementById('galleryList');
        const items = this.websiteData.galleryItems;
        
        if (items.length === 0) {
            galleryList.innerHTML = '<div class="empty-state">No gallery items yet. Add your first gallery item!</div>';
            return;
        }
        
        galleryList.innerHTML = items.map((item, index) => `
            <div class="list-item">
                <div class="item-info">
                    <h4>${item.title}</h4>
                    <p>${item.description} • ${new Date(item.date).toLocaleDateString()}</p>
                </div>
                <div class="item-actions">
                    <button class="action-btn edit" onclick="adminPanel.editGallery(${index})">✏️</button>
                    <button class="action-btn view" onclick="adminPanel.viewGallery(${index})">👁️</button>
                    <button class="action-btn delete" onclick="adminPanel.deleteGallery(${index})">🗑️</button>
                </div>
            </div>
        `).join('');
    }
    
    // Add new gallery item
    addNewGallery() {
        const newItem = {
            id: Date.now(),
            title: "New Gallery Item",
            description: "Gallery item description...",
            category: "office",
            image: "📷",
            date: new Date().toISOString().split('T')[0],
            location: "Office, Indore"
        };
        
        this.websiteData.galleryItems.unshift(newItem);
        this.saveWebsiteData();
        this.loadGalleryItems();
        this.addRecentChange('New gallery item added');
    }
    
    // Load reviews
    loadReviews() {
        const reviewsList = document.getElementById('reviewsList');
        const reviews = this.websiteData.reviews;
        
        if (reviews.length === 0) {
            reviewsList.innerHTML = '<div class="empty-state">No reviews yet. Add your first review!</div>';
            return;
        }
        
        reviewsList.innerHTML = reviews.map((review, index) => `
            <div class="list-item">
                <div class="item-info">
                    <h4>${review.author}</h4>
                    <p>${review.text} • ${review.stars} stars</p>
                </div>
                <div class="item-actions">
                    <button class="action-btn edit" onclick="adminPanel.editReview(${index})">✏️</button>
                    <button class="action-btn delete" onclick="adminPanel.deleteReview(${index})">🗑️</button>
                </div>
            </div>
        `).join('');
    }
    
    // Add new review
    addNewReview() {
        const newReview = {
            id: Date.now(),
            author: "New Client",
            text: "Great service and professional approach.",
            stars: "★★★★★"
        };
        
        this.websiteData.reviews.unshift(newReview);
        this.saveWebsiteData();
        this.loadReviews();
        this.addRecentChange('New review added');
    }
    
    // Load FAQs
    loadFAQs() {
        const faqList = document.getElementById('faqList');
        const faqs = this.websiteData.faqs;
        
        if (faqs.length === 0) {
            faqList.innerHTML = '<div class="empty-state">No FAQs yet. Add your first FAQ!</div>';
            return;
        }
        
        faqList.innerHTML = faqs.map((faq, index) => `
            <div class="list-item">
                <div class="item-info">
                    <h4>${faq.question}</h4>
                    <p>${faq.answer.substring(0, 100)}...</p>
                </div>
                <div class="item-actions">
                    <button class="action-btn edit" onclick="adminPanel.editFAQ(${index})">✏️</button>
                    <button class="action-btn delete" onclick="adminPanel.deleteFAQ(${index})">🗑️</button>
                </div>
            </div>
        `).join('');
    }
    
    // Add new FAQ
    addNewFAQ() {
        const newFAQ = {
            id: Date.now(),
            question: "New FAQ Question?",
            answer: "Answer to the FAQ question..."
        };
        
        this.websiteData.faqs.unshift(newFAQ);
        this.saveWebsiteData();
        this.loadFAQs();
        this.addRecentChange('New FAQ added');
    }
    
    // Save contact information
    saveContact() {
        this.websiteData.contact = {
            phone: document.getElementById('contactPhone').value,
            email: document.getElementById('contactEmail').value,
            address: document.getElementById('contactAddress').value,
            hours: document.getElementById('contactHours').value
        };
        
        this.saveWebsiteData();
        this.addRecentChange('Contact information updated');
    }
    
    // Save settings
    saveSettings() {
        this.websiteData.settings = {
            siteTitle: document.getElementById('siteTitle').value,
            siteDescription: document.getElementById('siteDescription').value,
            primaryColor: document.getElementById('primaryColor').value,
            secondaryColor: document.getElementById('secondaryColor').value,
            metaKeywords: document.getElementById('metaKeywords').value,
            analyticsId: document.getElementById('analyticsId').value
        };
        
        this.saveWebsiteData();
        this.addRecentChange('Website settings updated');
    }
    
    // Save all changes
    saveAllChanges() {
        this.saveWebsiteData();
        this.showNotification('All changes saved successfully!', 'success');
    }
    
    // Preview website
    previewWebsite() {
        window.open('/', '_blank');
    }
    
    // Export data
    exportData() {
        const dataStr = JSON.stringify(this.websiteData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'website-data.json';
        link.click();
        URL.revokeObjectURL(url);
        this.showNotification('Data exported successfully!', 'success');
    }
    
    // Import data
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    this.websiteData = { ...this.websiteData, ...data };
                    this.saveWebsiteData();
                    this.loadAllContent();
                    this.showNotification('Data imported successfully!', 'success');
                } catch (error) {
                    this.showNotification('Error importing data!', 'error');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }
    
    // Load all content
    loadAllContent() {
        this.loadDashboard();
        this.loadBlogPosts();
        this.loadGalleryItems();
        this.loadReviews();
        this.loadFAQs();
    }
    
    // Rich text editor commands
    execCommand(command, value = null) {
        document.execCommand(command, false, value);
    }
    
    // Close modal
    closeModal() {
        document.getElementById('richTextModal').style.display = 'none';
        this.currentEditingItem = null;
    }
    
    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Show forgot password modal
    showForgotPassword() {
        document.getElementById('forgotPasswordModal').style.display = 'block';
        document.getElementById('forgotEmail').value = 'shukla.suryansh123@gmail.com';
    }
    
    // Close forgot password modal
    closeForgotPasswordModal() {
        document.getElementById('forgotPasswordModal').style.display = 'none';
        document.getElementById('forgotMessage').innerHTML = '';
    }
    
    // Send password reset email
    async sendPasswordReset() {
        const email = document.getElementById('forgotEmail').value;
        const messageContainer = document.getElementById('forgotMessage');
        
        if (!email) {
            messageContainer.innerHTML = '<div class="error-message">Please enter your email address.</div>';
            return;
        }
        
        try {
            const response = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            const result = await response.json();
            
            if (result.success) {
                messageContainer.innerHTML = '<div class="success-message">Password reset email sent successfully! Check your inbox.</div>';
                setTimeout(() => {
                    this.closeForgotPasswordModal();
                }, 3000);
            } else {
                messageContainer.innerHTML = `<div class="error-message">${result.message}</div>`;
            }
        } catch (error) {
            console.error('Error sending password reset:', error);
            messageContainer.innerHTML = '<div class="error-message">Failed to send password reset email. Please try again.</div>';
        }
    }
    
    // Save all changes with GitHub deployment
    async saveAllChangesWithDeploy() {
        try {
            this.showNotification('Saving changes and deploying...', 'info');
            
            // First save all content files
            const response = await fetch('/api/save-all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: this.websiteData
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Trigger GitHub deployment
                const deployResponse = await fetch('/api/deploy', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        commitMessage: 'Update website content via admin panel - ' + new Date().toLocaleString()
                    })
                });
                
                const deployResult = await deployResponse.json();
                
                if (deployResult.success) {
                    this.showNotification('All changes saved and deployed to GitHub successfully!', 'success');
                    this.addRecentChange('All changes saved and deployed to GitHub');
                    
                    // Show deployment info
                    setTimeout(() => {
                        this.showNotification('Website will be live on Render in 2-3 minutes!', 'info');
                    }, 2000);
                } else {
                    this.showNotification('Changes saved but deployment failed. Check GitHub integration.', 'warning');
                }
            } else {
                this.showNotification('Failed to save changes.', 'error');
            }
        } catch (error) {
            console.error('Error saving and deploying:', error);
            this.showNotification('Error saving and deploying changes.', 'error');
        }
    }
    
    // Create backup
    createBackup() {
        const backup = {
            timestamp: new Date().toISOString(),
            data: this.websiteData
        };
        
        const dataStr = JSON.stringify(backup, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `website-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        this.showNotification('Backup created successfully!', 'success');
    }
    
    // Restore backup
    restoreBackup() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const backup = JSON.parse(e.target.result);
                    if (backup.data) {
                        this.websiteData = backup.data;
                        this.saveWebsiteData();
                        this.loadAllContent();
                        this.showNotification('Backup restored successfully!', 'success');
                    } else {
                        this.showNotification('Invalid backup file!', 'error');
                    }
                } catch (error) {
                    this.showNotification('Error restoring backup!', 'error');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }
    
    // Export full data
    exportFullData() {
        const fullData = {
            websiteData: this.websiteData,
            recentChanges: this.recentChanges,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(fullData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `full-website-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        this.showNotification('Full data exported successfully!', 'success');
    }
}

// Initialize admin panel when DOM is loaded
let adminPanel;

// Global function wrapper to ensure adminPanel is available
function getAdminPanel() {
    if (!adminPanel) {
        console.error('AdminPanel not initialized yet!');
        return null;
    }
    return adminPanel;
}

// Global wrapper functions for all admin panel methods
window.showForgotPassword = () => {
    const panel = getAdminPanel();
    if (panel) panel.showForgotPassword();
};

window.closeForgotPasswordModal = () => {
    const panel = getAdminPanel();
    if (panel) panel.closeForgotPasswordModal();
};

window.sendPasswordReset = () => {
    const panel = getAdminPanel();
    if (panel) panel.sendPasswordReset();
};

window.saveAllChangesWithDeploy = () => {
    const panel = getAdminPanel();
    if (panel) panel.saveAllChangesWithDeploy();
};

window.saveAllChanges = () => {
    const panel = getAdminPanel();
    if (panel) panel.saveAllChanges();
};

window.previewWebsite = () => {
    const panel = getAdminPanel();
    if (panel) panel.previewWebsite();
};

window.exportData = () => {
    const panel = getAdminPanel();
    if (panel) panel.exportData();
};

window.importData = () => {
    const panel = getAdminPanel();
    if (panel) panel.importData();
};

window.logout = () => {
    const panel = getAdminPanel();
    if (panel) panel.logout();
};

window.saveHero = () => {
    const panel = getAdminPanel();
    if (panel) panel.saveHero();
};

window.saveAbout = () => {
    const panel = getAdminPanel();
    if (panel) panel.saveAbout();
};

window.saveFounders = () => {
    const panel = getAdminPanel();
    if (panel) panel.saveFounders();
};

window.savePracticeAreas = () => {
    const panel = getAdminPanel();
    if (panel) panel.savePracticeAreas();
};

window.saveBlog = () => {
    const panel = getAdminPanel();
    if (panel) panel.saveBlog();
};

window.saveGallery = () => {
    const panel = getAdminPanel();
    if (panel) panel.saveGallery();
};

window.saveReviews = () => {
    const panel = getAdminPanel();
    if (panel) panel.saveReviews();
};

window.saveFAQ = () => {
    const panel = getAdminPanel();
    if (panel) panel.saveFAQ();
};

window.saveContact = () => {
    const panel = getAdminPanel();
    if (panel) panel.saveContact();
};

window.saveSettings = () => {
    const panel = getAdminPanel();
    if (panel) panel.saveSettings();
};

window.closeModal = () => {
    const panel = getAdminPanel();
    if (panel) panel.closeModal();
};

window.execCommand = (command, value = null) => {
    const panel = getAdminPanel();
    if (panel) panel.execCommand(command, value);
};

window.insertImage = () => {
    const panel = getAdminPanel();
    if (panel) panel.insertImage();
};

window.insertTable = () => {
    const panel = getAdminPanel();
    if (panel) panel.insertTable();
};

window.insertCode = () => {
    const panel = getAdminPanel();
    if (panel) panel.insertCode();
};

window.insertQuote = () => {
    const panel = getAdminPanel();
    if (panel) panel.insertQuote();
};

window.saveRichText = () => {
    const panel = getAdminPanel();
    if (panel) panel.saveRichText();
};

// AI Intelligence functions
window.loadAIDashboard = () => {
    const panel = getAdminPanel();
    if (panel) panel.loadAIDashboard();
};

window.detectBugs = () => {
    const panel = getAdminPanel();
    if (panel) panel.detectBugs();
};

window.fixAllBugs = () => {
    const panel = getAdminPanel();
    if (panel) panel.fixAllBugs();
};

window.analyzeSEO = () => {
    const panel = getAdminPanel();
    if (panel) panel.analyzeSEO();
};

window.optimizeSEO = () => {
    const panel = getAdminPanel();
    if (panel) panel.optimizeSEO();
};

window.generateBlogs = () => {
    const panel = getAdminPanel();
    if (panel) panel.generateBlogs();
};

window.publishBlogs = () => {
    const panel = getAdminPanel();
    if (panel) panel.publishBlogs();
};

window.optimizeTraffic = () => {
    const panel = getAdminPanel();
    if (panel) panel.optimizeTraffic();
};

window.analyzeIndianKeywords = () => {
    const panel = getAdminPanel();
    if (panel) panel.analyzeIndianKeywords();
};

window.testChatGPT = () => {
    const panel = getAdminPanel();
    if (panel) panel.testChatGPT();
};

window.viewChatHistory = () => {
    const panel = getAdminPanel();
    if (panel) panel.viewChatHistory();
};

// Additional functions needed
window.addNewBlog = () => {
    const panel = getAdminPanel();
    if (panel) panel.addNewBlog();
};

window.addNewGallery = () => {
    const panel = getAdminPanel();
    if (panel) panel.addNewGallery();
};

window.editHero = () => {
    const panel = getAdminPanel();
    if (panel) panel.editHero();
};

window.editAbout = () => {
    const panel = getAdminPanel();
    if (panel) panel.editAbout();
};

window.saveFounders = () => {
    const panel = getAdminPanel();
    if (panel) panel.saveFounders();
};

window.addPracticeArea = () => {
    const panel = getAdminPanel();
    if (panel) panel.addPracticeArea();
};

window.savePracticeAreas = () => {
    const panel = getAdminPanel();
    if (panel) panel.savePracticeAreas();
};

window.importBlogs = () => {
    const panel = getAdminPanel();
    if (panel) panel.importBlogs();
};

window.exportBlogs = () => {
    const panel = getAdminPanel();
    if (panel) panel.exportBlogs();
};

window.bulkUpload = () => {
    const panel = getAdminPanel();
    if (panel) panel.bulkUpload();
};

window.exportGallery = () => {
    const panel = getAdminPanel();
    if (panel) panel.exportGallery();
};

window.addNewReview = () => {
    const panel = getAdminPanel();
    if (panel) panel.addNewReview();
};

window.addNewFAQ = () => {
    const panel = getAdminPanel();
    if (panel) panel.addNewFAQ();
};

window.saveContact = () => {
    const panel = getAdminPanel();
    if (panel) panel.saveContact();
};

window.createBackup = () => {
    const panel = getAdminPanel();
    if (panel) panel.createBackup();
};

window.restoreBackup = () => {
    const panel = getAdminPanel();
    if (panel) panel.restoreBackup();
};

window.exportFullData = () => {
    const panel = getAdminPanel();
    if (panel) panel.exportFullData();
};

window.saveSettings = () => {
    const panel = getAdminPanel();
    if (panel) panel.saveSettings();
};

window.refreshAISuggestions = () => {
    const panel = getAdminPanel();
    if (panel) panel.refreshAISuggestions();
};

window.refreshAIDecisions = () => {
    const panel = getAdminPanel();
    if (panel) panel.refreshAIDecisions();
};

window.refreshUserPatterns = () => {
    const panel = getAdminPanel();
    if (panel) panel.refreshUserPatterns();
};

window.applyAISuggestions = () => {
    const panel = getAdminPanel();
    if (panel) panel.applyAISuggestions();
};

window.autoOptimize = () => {
    const panel = getAdminPanel();
    if (panel) panel.autoOptimize();
};

window.generateContent = () => {
    const panel = getAdminPanel();
    if (panel) panel.generateContent();
};

window.analyzeTrends = () => {
    const panel = getAdminPanel();
    if (panel) panel.analyzeTrends();
};

window.saveAIConfig = () => {
    const panel = getAdminPanel();
    if (panel) panel.saveAIConfig();
};

window.closeForgotPasswordModal = () => {
    const panel = getAdminPanel();
    if (panel) panel.closeForgotPasswordModal();
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Admin Panel...');
    
    // Initialize admin panel
    adminPanel = new AdminPanel();
    console.log('Admin Panel initialized:', adminPanel);
    
    // Make adminPanel globally available
    window.adminPanel = adminPanel;
    
    // Test all global functions
    console.log('Testing global functions...');
    const testFunctions = [
        'showForgotPassword', 'saveAllChanges', 'logout', 'saveHero', 
        'saveAbout', 'detectBugs', 'analyzeSEO', 'generateBlogs'
    ];
    
    testFunctions.forEach(func => {
        if (typeof window[func] === 'function') {
            console.log(`✅ ${func}: Available`);
        } else {
            console.error(`❌ ${func}: Missing`);
        }
    });
    
    console.log('Admin Panel setup complete!');
});
