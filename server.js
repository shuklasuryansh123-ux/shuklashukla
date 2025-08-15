// Load environment variables
require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const fs = require('fs').promises;

// Import services
let GitHubService, PasswordResetService, AIIntelligenceService;
try {
    GitHubService = require('./services/github-service');
    PasswordResetService = require('./services/password-reset');
    AIIntelligenceService = require('./services/ai-intelligence');
} catch (error) {
    console.log('Services not available, running in basic mode');
}

// Initialize AI Intelligence Service
let aiService;
if (AIIntelligenceService) {
    aiService = new AIIntelligenceService();
    aiService.init().then(() => {
        console.log('🤖 AI Intelligence Service initialized');
    }).catch(error => {
        console.log('AI Service initialization error:', error);
    });
}

const app = express();
const PORT = process.env.PORT || 3000;

// Security and performance middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));
app.use(compression());
app.use(cors());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving
app.use(express.static(path.join(__dirname), {
    maxAge: '1d',
    etag: true,
    lastModified: true
}));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, 'test.html'));
});

app.get('/more.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'more.html'));
});

app.get('/blog.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'blog.html'));
});

app.get('/gallery.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'gallery.html'));
});
app.get('/practice-areas.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'practice-areas.html'));
});

// Admin panel route
app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/admin-reset.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin-reset.html'));
});

app.get('/test-admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'test-admin.html'));
});

app.get('/admin-test.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin-test.html'));
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
    const { name, email, phone, message } = req.body;
    
    // Simple validation
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: 'Please fill in all required fields.'
        });
    }
    
    // Here you would typically save to database or send email
    console.log('Contact form submission:', { name, email, phone, message });
    
    res.json({
        success: true,
        message: 'Thank you for your message! We will get back to you soon.'
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0'
    });
});

// API Routes for Content Management
app.get('/api/content/:section', async (req, res) => {
    try {
        const section = req.params.section;
        const filePath = path.join(__dirname, 'content', `${section}.json`);
        
        const content = await fs.readFile(filePath, 'utf-8');
        res.json(JSON.parse(content));
    } catch (error) {
        console.error(`Error reading content for ${req.params.section}:`, error);
        res.status(404).json({ error: 'Content not found' });
    }
});

app.post('/api/content/:section', async (req, res) => {
    try {
        const section = req.params.section;
        const content = req.body;
        
        // Add timestamp
        content.lastUpdated = new Date().toISOString();
        
        const filePath = path.join(__dirname, 'content', `${section}.json`);
        await fs.writeFile(filePath, JSON.stringify(content, null, 2));
        
        res.json({ success: true, message: 'Content updated successfully' });
    } catch (error) {
        console.error(`Error updating content for ${req.params.section}:`, error);
        res.status(500).json({ error: 'Failed to update content' });
    }
});

// Password Reset API
app.post('/api/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }
        
        if (PasswordResetService) {
            const result = await PasswordResetService.sendPasswordResetEmail(email);
            res.json(result);
        } else {
            res.json({ success: true, message: 'Password reset email would be sent (service not configured)' });
        }
    } catch (error) {
        console.error('Error in forgot password:', error);
        res.status(500).json({ success: false, message: 'Failed to send reset email' });
    }
});

app.post('/api/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        if (!token || !newPassword) {
            return res.status(400).json({ success: false, message: 'Token and new password are required' });
        }
        
        if (PasswordResetService) {
            const result = await PasswordResetService.resetPassword(token, newPassword);
            res.json(result);
        } else {
            res.json({ success: true, message: 'Password would be reset (service not configured)' });
        }
    } catch (error) {
        console.error('Error in password reset:', error);
        res.status(500).json({ success: false, message: 'Failed to reset password' });
    }
});

// GitHub Integration API
app.post('/api/deploy', async (req, res) => {
    try {
        const { commitMessage = 'Update content via admin panel' } = req.body;
        
        if (!GitHubService) {
            return res.status(500).json({ success: false, message: 'GitHub service not configured' });
        }
        
        // Get all content files
        const contentDir = path.join(__dirname, 'content');
        const files = await fs.readdir(contentDir);
        
        const filesToUpdate = [];
        for (const file of files) {
            if (file.endsWith('.json')) {
                const content = await fs.readFile(path.join(contentDir, file), 'utf-8');
                filesToUpdate.push({
                    path: `content/${file}`,
                    content: content
                });
            }
        }
        
        // Update files on GitHub
        const result = await GitHubService.updateMultipleFiles(filesToUpdate, commitMessage);
        
        // Trigger deployment
        await GitHubService.triggerDeployment();
        
        res.json({ 
            success: true, 
            message: 'Content deployed successfully',
            commit: result
        });
    } catch (error) {
        console.error('Error deploying content:', error);
        res.status(500).json({ success: false, message: 'Failed to deploy content' });
    }
});

app.get('/api/deployment-status', async (req, res) => {
    try {
        if (!GitHubService) {
            return res.status(500).json({ success: false, message: 'GitHub service not configured' });
        }
        
        const status = await GitHubService.getDeploymentStatus();
        res.json({ success: true, status });
    } catch (error) {
        console.error('Error getting deployment status:', error);
        res.status(500).json({ success: false, message: 'Failed to get deployment status' });
    }
});

// Save All Changes API
app.post('/api/save-all', async (req, res) => {
    try {
        const { content } = req.body;
        
        // Update all content files
        for (const [section, data] of Object.entries(content)) {
            const filePath = path.join(__dirname, 'content', `${section}.json`);
            data.lastUpdated = new Date().toISOString();
            await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        }
        
        // Deploy to GitHub if configured
        if (GitHubService && process.env.GITHUB_TOKEN) {
            await GitHubService.updateMultipleFiles(
                Object.entries(content).map(([section, data]) => ({
                    path: `content/${section}.json`,
                    content: JSON.stringify(data, null, 2)
                })),
                'Update all content via admin panel'
            );
            
            await GitHubService.triggerDeployment();
        }
        
        res.json({ success: true, message: 'All changes saved and deployed successfully' });
    } catch (error) {
        console.error('Error saving all changes:', error);
        res.status(500).json({ success: false, message: 'Failed to save changes' });
    }
});

// AI Intelligence API Routes (NEW)
app.post('/api/ai/track', async (req, res) => {
    try {
        const { userId, action, data } = req.body;
        
        if (aiService) {
            aiService.trackUserBehavior(userId, action, data);
            res.json({ success: true, message: 'Tracking data received' });
        } else {
            res.json({ success: false, message: 'AI service not available' });
        }
    } catch (error) {
        console.error('AI tracking error:', error);
        res.status(500).json({ error: 'Failed to track data' });
    }
});

app.get('/api/ai/insights', async (req, res) => {
    try {
        if (aiService) {
            const insights = aiService.getAIInsights();
            res.json(insights);
        } else {
            res.json({ error: 'AI service not available' });
        }
    } catch (error) {
        console.error('AI insights error:', error);
        res.status(500).json({ error: 'Failed to get insights' });
    }
});

app.post('/api/ai/recommendations', async (req, res) => {
    try {
        const { userId, currentSection, deviceType } = req.body;
        
        if (aiService) {
            // Generate personalized recommendations based on user behavior
            const recommendations = aiService.generateRecommendations();
            
            // Add personalized recommendations based on user patterns
            const userPatterns = aiService.learningData.patterns[userId];
            let personalizedRecommendations = recommendations;
            
            if (userPatterns) {
                const userRecommendations = [];
                
                // Recommend content based on user preferences
                if (userPatterns.preferredContentTypes?.length > 0) {
                    const topContent = userPatterns.preferredContentTypes[0];
                    userRecommendations.push({
                        type: 'content_recommendation',
                        title: `More ${topContent.type} Content`,
                        description: `Based on your interests, you might like our ${topContent.type} content.`,
                        priority: 'high',
                        action: `view_${topContent.type}_content`
                    });
                }
                
                // Recommend sections based on visit patterns
                if (userPatterns.mostVisitedSections?.length > 0) {
                    const topSection = userPatterns.mostVisitedSections[0];
                    userRecommendations.push({
                        type: 'section_recommendation',
                        title: `Explore ${topSection.section}`,
                        description: `You frequently visit this section. Check out our latest updates.`,
                        priority: 'medium',
                        action: `visit_${topSection.section}`
                    });
                }
                
                personalizedRecommendations = [...userRecommendations, ...recommendations];
            }
            
            res.json({
                recommendations: personalizedRecommendations,
                userPatterns: userPatterns || null,
                currentSection,
                deviceType
            });
        } else {
            res.json({ error: 'AI service not available' });
        }
    } catch (error) {
        console.error('AI recommendations error:', error);
        res.status(500).json({ error: 'Failed to get recommendations' });
    }
});

app.post('/api/ai/decisions', async (req, res) => {
    try {
        if (aiService) {
            const decisions = aiService.makeAutonomousDecisions();
            res.json({ decisions });
        } else {
            res.json({ error: 'AI service not available' });
        }
    } catch (error) {
        console.error('AI decisions error:', error);
        res.status(500).json({ error: 'Failed to make decisions' });
    }
});

// GitHub Copilot Integration API
app.post('/api/ai/copilot-review', async (req, res) => {
    try {
        const { filePath } = req.body;
        
        if (aiService) {
            const suggestions = await aiService.copilotCodeReview(filePath);
            res.json({ suggestions });
        } else {
            res.json({ error: 'AI service not available' });
        }
    } catch (error) {
        console.error('Copilot review error:', error);
        res.status(500).json({ error: 'Failed to review code' });
    }
});

// Bug Detection and Fixing API
app.get('/api/ai/detect-bugs', async (req, res) => {
    try {
        if (aiService) {
            const bugs = await aiService.detectBugs();
            res.json({ bugs });
        } else {
            res.json({ error: 'AI service not available' });
        }
    } catch (error) {
        console.error('Bug detection error:', error);
        res.status(500).json({ error: 'Failed to detect bugs' });
    }
});

app.post('/api/ai/fix-bug', async (req, res) => {
    try {
        const { bug } = req.body;
        
        if (aiService) {
            const result = await aiService.fixBug(bug);
            res.json(result);
        } else {
            res.json({ error: 'AI service not available' });
        }
    } catch (error) {
        console.error('Bug fixing error:', error);
        res.status(500).json({ error: 'Failed to fix bug' });
    }
});

// SEO Analysis API
app.get('/api/ai/seo-analysis', async (req, res) => {
    try {
        if (aiService) {
            const seoAnalysis = await aiService.analyzeSEO();
            res.json(seoAnalysis);
        } else {
            res.json({ error: 'AI service not available' });
        }
    } catch (error) {
        console.error('SEO analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze SEO' });
    }
});

// AI Blog Generation API
app.post('/api/ai/generate-blogs', async (req, res) => {
    try {
        if (aiService) {
            const blogPosts = await aiService.generateBlogPosts();
            res.json({ blogPosts });
        } else {
            res.json({ error: 'AI service not available' });
        }
    } catch (error) {
        console.error('Blog generation error:', error);
        res.status(500).json({ error: 'Failed to generate blogs' });
    }
});

// Traffic Optimization for India API
app.get('/api/ai/traffic-optimization', async (req, res) => {
    try {
        if (aiService) {
            const optimization = await aiService.optimizeForIndianTraffic();
            res.json(optimization);
        } else {
            res.json({ error: 'AI service not available' });
        }
    } catch (error) {
        console.error('Traffic optimization error:', error);
        res.status(500).json({ error: 'Failed to optimize traffic' });
    }
});

// ChatGPT Integration API
app.post('/api/ai/chat', async (req, res) => {
    try {
        const { message, context } = req.body;
        
        if (aiService) {
            const response = await aiService.chatWithGPT(message, context);
            res.json({ response });
        } else {
            res.json({ error: 'AI service not available' });
        }
    } catch (error) {
        console.error('ChatGPT error:', error);
        res.status(500).json({ error: 'Failed to process chat' });
    }
});

// Auto-optimization for Traffic API
app.post('/api/ai/auto-optimize-traffic', async (req, res) => {
    try {
        if (aiService) {
            const optimizations = await aiService.autoOptimizeForTraffic();
            res.json({ optimizations });
        } else {
            res.json({ error: 'AI service not available' });
        }
    } catch (error) {
        console.error('Auto-optimization error:', error);
        res.status(500).json({ error: 'Failed to auto-optimize' });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 Main site: http://localhost:${PORT}`);
    console.log(`🧪 Test page: http://localhost:${PORT}/test`);
    console.log(`📝 Notepad: http://localhost:${PORT}/more.html`);
});

module.exports = app;
