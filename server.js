// Load environment variables
require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const fs = require('fs').promises;
const https = require('https');
const http = require('http');

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
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", "https://cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://www.google-analytics.com"],
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
    lastModified: true,
    setHeaders: (res, filePath) => {
        if (/\.(css|js|mjs|png|jpg|jpeg|gif|svg|webp|ico|woff|woff2)$/.test(filePath)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (/\.(html)$/.test(filePath)) {
            res.setHeader('Cache-Control', 'no-cache');
        }
    }
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

app.get('/debug-admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'debug-admin.html'));
});

app.get('/test-modern.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'test-modern.html'));
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Validate input
        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }
        
        // Here you would typically send an email or save to database
        console.log('Contact form submission:', { name, email, message });
        
        res.json({ 
            success: true, 
            message: 'Thank you for your message! We will get back to you soon.' 
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred. Please try again.' 
        });
    }
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

// Helper: Commit files to GitHub
async function commitFilesToGitHub(files, message = 'Update content via API') {
    try {
        if (!GitHubService) return false;
        const githubService = new GitHubService();
        await githubService.init();
        await githubService.updateMultipleFiles(files, message);
        return true;
    } catch (error) {
        console.log('GitHub commit skipped/failed:', error.message || error);
        return false;
    }
}

// API Routes for Content Management
app.get('/api/content/:section', async (req, res) => {
    try {
        const { section } = req.params;
        if (!/^[a-zA-Z0-9_-]+$/.test(section)) {
            return res.status(400).json({ error: 'Invalid section name' });
        }
        const filePath = path.join(__dirname, 'content', `${section}.json`);
        
        const content = await fs.readFile(filePath, 'utf8');
        res.json(JSON.parse(content));
    } catch (error) {
        console.error('Error reading content:', error);
        res.status(404).json({ error: 'Content not found' });
    }
});

app.post('/api/content/:section', async (req, res) => {
    try {
        const { section } = req.params;
        if (!/^[a-zA-Z0-9_-]+$/.test(section)) {
            return res.status(400).json({ error: 'Invalid section name' });
        }
        const filePath = path.join(__dirname, 'content', `${section}.json`);
        
        const serialized = JSON.stringify(req.body, null, 2);
        await fs.writeFile(filePath, serialized);
        await commitFilesToGitHub([
            { path: `content/${section}.json`, content: serialized }
        ], `Update content: ${section}.json`);
        res.json({ success: true });
    } catch (error) {
        console.error('Error writing content:', error);
        res.status(500).json({ error: 'Failed to save content' });
    }
});

// Password Reset API
app.post('/api/forgot-password', async (req, res) => {
    try {
        if (!PasswordResetService) {
            return res.status(500).json({ error: 'Password reset service not available' });
        }
        
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });
        const passwordService = new PasswordResetService();
        await passwordService.sendPasswordResetEmail(email);
        
        res.json({ success: true, message: 'Password reset email sent' });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ error: 'Failed to send password reset email' });
    }
});

app.post('/api/reset-password', async (req, res) => {
    try {
        if (!PasswordResetService) {
            return res.status(500).json({ error: 'Password reset service not available' });
        }
        
        const { token, newPassword } = req.body;
        const passwordService = new PasswordResetService();
        await passwordService.resetPassword(token, newPassword);
        
        res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
});

// GitHub Integration API
app.post('/api/deploy', async (req, res) => {
    try {
        if (!GitHubService) {
            return res.status(500).json({ error: 'GitHub service not available' });
        }
        
        const githubService = new GitHubService();
        await githubService.init();
        await githubService.triggerDeployment();
        
        res.json({ success: true, message: 'Deployment triggered' });
    } catch (error) {
        console.error('Deployment error:', error);
        res.status(500).json({ error: 'Failed to trigger deployment' });
    }
});

app.get('/api/deployment-status', async (req, res) => {
    try {
        if (!GitHubService) {
            return res.status(500).json({ error: 'GitHub service not available' });
        }
        
        const githubService = new GitHubService();
        await githubService.init();
        const status = await githubService.getDeploymentStatus();
        
        res.json(status);
    } catch (error) {
        console.error('Deployment status error:', error);
        res.status(500).json({ error: 'Failed to get deployment status' });
    }
});

// Save All Changes API
app.post('/api/save-all', async (req, res) => {
    try {
        const { websiteData } = req.body;
        if (!websiteData || typeof websiteData !== 'object') {
            return res.status(400).json({ error: 'Invalid website data' });
        }
        
        // Save to content files
        const contentDir = path.join(__dirname, 'content');
        await fs.mkdir(contentDir, { recursive: true });
        
        const filesForGit = [];
        for (const [section, data] of Object.entries(websiteData)) {
            if (!/^[a-zA-Z0-9_-]+$/.test(section)) {
                return res.status(400).json({ error: `Invalid section name: ${section}` });
            }
            const filePath = path.join(contentDir, `${section}.json`);
            const serialized = JSON.stringify(data, null, 2);
            await fs.writeFile(filePath, serialized);
            filesForGit.push({ path: `content/${section}.json`, content: serialized });
        }
        
        if (filesForGit.length) {
            await commitFilesToGitHub(filesForGit, 'Save all content changes');
        }
        
        res.json({ success: true, message: 'All changes saved' });
    } catch (error) {
        console.error('Save all error:', error);
        res.status(500).json({ error: 'Failed to save changes' });
    }
});

// Upload API - accepts base64 file and saves to uploads/
app.post('/api/upload', async (req, res) => {
    try {
        const { path: relPath, base64, contentType } = req.body || {};
        if (!relPath || !base64) {
            return res.status(400).json({ error: 'path and base64 are required' });
        }
        if (relPath.includes('..') || relPath.startsWith('/') || !relPath.startsWith('uploads/')) {
            return res.status(400).json({ error: 'Invalid upload path' });
        }
        const allowed = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
        const ext = relPath.substring(relPath.lastIndexOf('.')).toLowerCase();
        if (!allowed.includes(ext)) {
            return res.status(400).json({ error: 'Unsupported file type' });
        }
        const uploadAbs = path.join(__dirname, relPath);
        await fs.mkdir(path.dirname(uploadAbs), { recursive: true });
        const buffer = Buffer.from(base64.replace(/^data:[^;]+;base64,/, ''), 'base64');
        await fs.writeFile(uploadAbs, buffer);
        await commitFilesToGitHub([{ path: relPath, content: buffer.toString('base64'), encoding: 'base64' }], `Upload file: ${relPath}`);
        res.json({ success: true, url: `/${relPath}`, contentType: contentType || null });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
});

// AI Intelligence API Routes
app.post('/api/ai/track', async (req, res) => {
    try {
        if (!aiService) {
            return res.status(500).json({ error: 'AI service not available' });
        }
        
        const { userId, action, data } = req.body;
        aiService.trackUserBehavior(userId, action, data);
        
        res.json({ success: true });
    } catch (error) {
        console.error('AI tracking error:', error);
        res.status(500).json({ error: 'Failed to track user behavior' });
    }
});

app.get('/api/ai/insights', async (req, res) => {
    try {
        if (!aiService) {
            return res.status(500).json({ error: 'AI service not available' });
        }
        
        const insights = await aiService.getAIInsights();
        res.json(insights);
    } catch (error) {
        console.error('AI insights error:', error);
        res.status(500).json({ error: 'Failed to get AI insights' });
    }
});

app.post('/api/ai/recommendations', async (req, res) => {
    try {
        if (!aiService) {
            return res.status(500).json({ error: 'AI service not available' });
        }
        
        const recommendations = aiService.generateRecommendations();
        res.json(recommendations);
    } catch (error) {
        console.error('AI recommendations error:', error);
        res.status(500).json({ error: 'Failed to generate recommendations' });
    }
});

app.post('/api/ai/decisions', async (req, res) => {
    try {
        if (!aiService) {
            return res.status(500).json({ error: 'AI service not available' });
        }
        
        const decisions = aiService.makeAutonomousDecisions();
        res.json(decisions);
    } catch (error) {
        console.error('AI decisions error:', error);
        res.status(500).json({ error: 'Failed to make AI decisions' });
    }
});

app.post('/api/ai/copilot-review', async (req, res) => {
    try {
        if (!aiService) {
            return res.status(500).json({ error: 'AI service not available' });
        }
        
        const { filePath } = req.body;
        const review = await aiService.copilotCodeReview(filePath);
        res.json(review);
    } catch (error) {
        console.error('Copilot review error:', error);
        res.status(500).json({ error: 'Failed to review code' });
    }
});

app.get('/api/ai/detect-bugs', async (req, res) => {
    try {
        if (!aiService) {
            return res.status(500).json({ error: 'AI service not available' });
        }
        
        const bugs = await aiService.detectBugs();
        res.json(bugs);
    } catch (error) {
        console.error('Bug detection error:', error);
        res.status(500).json({ error: 'Failed to detect bugs' });
    }
});

app.post('/api/ai/fix-bug', async (req, res) => {
    try {
        if (!aiService) {
            return res.status(500).json({ error: 'AI service not available' });
        }
        
        const { bug } = req.body;
        const result = await aiService.fixBug(bug);
        res.json(result);
    } catch (error) {
        console.error('Bug fix error:', error);
        res.status(500).json({ error: 'Failed to fix bug' });
    }
});

app.get('/api/ai/seo-analysis', async (req, res) => {
    try {
        if (!aiService) {
            return res.status(500).json({ error: 'AI service not available' });
        }
        
        const analysis = await aiService.analyzeSEO();
        res.json(analysis);
    } catch (error) {
        console.error('SEO analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze SEO' });
    }
});

app.post('/api/ai/generate-blogs', async (req, res) => {
    try {
        if (!aiService) {
            return res.status(500).json({ error: 'AI service not available' });
        }
        
        const blogs = await aiService.generateBlogPosts();
        res.json(blogs);
    } catch (error) {
        console.error('Blog generation error:', error);
        res.status(500).json({ error: 'Failed to generate blogs' });
    }
});

app.get('/api/ai/traffic-optimization', async (req, res) => {
    try {
        if (!aiService) {
            return res.status(500).json({ error: 'AI service not available' });
        }
        
        const optimization = await aiService.optimizeForIndianTraffic();
        res.json(optimization);
    } catch (error) {
        console.error('Traffic optimization error:', error);
        res.status(500).json({ error: 'Failed to optimize traffic' });
    }
});

app.post('/api/ai/chat', async (req, res) => {
    try {
        if (!aiService) {
            return res.status(500).json({ error: 'AI service not available' });
        }
        
        const { message, context } = req.body;
        const response = await aiService.chatWithGPT(message, context);
        res.json({ response });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to process chat message' });
    }
});

app.post('/api/ai/auto-optimize-traffic', async (req, res) => {
    try {
        if (!aiService) {
            return res.status(500).json({ error: 'AI service not available' });
        }
        
        const result = await aiService.autoOptimizeForTraffic();
        res.json(result);
    } catch (error) {
        console.error('Auto-optimize error:', error);
        res.status(500).json({ error: 'Failed to auto-optimize traffic' });
    }
});

app.post('/api/admin/login', async (req, res) => {
    try {
        if (!PasswordResetService) {
            return res.status(500).json({ error: 'Auth service not available' });
        }
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const passwordService = new PasswordResetService();
        const ok = await passwordService.verifyCredentials(email, password);
        if (ok) return res.json({ success: true });
        return res.status(401).json({ error: 'Invalid credentials' });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Page not found' });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 Main site: http://localhost:${PORT}`);
    console.log(`🧪 Test page: http://localhost:${PORT}/test`);
    console.log(`📝 Notepad: http://localhost:${PORT}/more.html`);
    console.log(`⚙️ Admin panel: http://localhost:${PORT}/admin.html`);
    console.log(`🔧 Debug admin: http://localhost:${PORT}/debug-admin.html`);
});
