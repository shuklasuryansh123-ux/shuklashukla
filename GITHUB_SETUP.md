# 🔗 GitHub & Render Integration Setup Guide

This guide will help you set up GitHub and Render integration for your law firm website.

## 📋 Prerequisites

1. **GitHub Account**: You need a GitHub account (suryansh-shukla)
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Git Installed**: Make sure Git is installed on your computer

## 🚀 Step 1: Create GitHub Repository

### Option A: Create New Repository
1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Repository name: `shukla-law-firm`
5. Description: `Professional law firm website with admin panel`
6. Make it **Public** (for free Render deployment)
7. Don't initialize with README (we already have one)
8. Click "Create repository"

### Option B: Use Existing Repository
If you already have a repository, skip this step.

## 🔑 Step 2: Generate GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. Give it a name: `Shukla Law Firm Website`
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)

## 🌐 Step 3: Set Up Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub account
4. Select the `shukla-law-firm` repository
5. Configure the service:
   - **Name**: `shukla-law-firm`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

## ⚙️ Step 4: Configure Environment Variables

### In Render Dashboard:
1. Go to your web service
2. Click "Environment" tab
3. Add these variables:

```
NODE_ENV=production
PORT=10000
GITHUB_TOKEN=your_github_token_here
GITHUB_REPO=suryansh-shukla/shukla-law-firm
GITHUB_BRANCH=main
EMAIL_USER=shukla.suryansh123@gmail.com
EMAIL_PASS=your_gmail_app_password
SITE_URL=https://your-app-name.onrender.com
```

### Get Gmail App Password:
1. Go to Google Account settings
2. Security → 2-Step Verification → App passwords
3. Generate app password for "Mail"
4. Use this password in `EMAIL_PASS`

## 🔄 Step 5: Push Your Code to GitHub

Run these commands in your project directory:

```bash
# Initialize git (if not already done)
git init

# Add your GitHub repository as remote
git remote add origin https://github.com/suryansh-shukla/shukla-law-firm.git

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - Law firm website with admin panel"

# Push to GitHub
git push -u origin main
```

## 🎯 Step 6: Test the Integration

1. **Check Render Deployment**:
   - Go to your Render dashboard
   - Your service should be deploying automatically
   - Wait for it to complete (2-3 minutes)

2. **Test Admin Panel**:
   - Visit: `https://your-app-name.onrender.com/admin.html`
   - Login with: `shukla.suryansh123@gmail.com` / `12032003`
   - Try the "Save & Deploy" button

3. **Test Password Reset**:
   - Click "Forgot Password" in admin panel
   - Enter your email
   - Check your email for reset link

## 🔧 Step 7: Configure GitHub Secrets (Optional)

For GitHub Actions deployment:

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add these secrets:
   - `RENDER_TOKEN`: Your Render API token
   - `RENDER_SERVICE_ID`: Your Render service ID

## 📱 Step 8: Update Your Website

### Using Admin Panel:
1. Go to your admin panel
2. Make changes to any section
3. Click "🚀 Save & Deploy"
4. Changes will be automatically pushed to GitHub and deployed to Render

### Using Command Line:
```bash
# Make changes to your files
# Then run:
./scripts/deploy.sh "Your commit message"
```

## 🔍 Troubleshooting

### Common Issues:

**1. GitHub Token Not Working**
- Check if token has correct permissions
- Verify token is not expired
- Ensure repository name is correct

**2. Render Deployment Fails**
- Check build logs in Render dashboard
- Verify environment variables are set
- Ensure all dependencies are in package.json

**3. Email Not Working**
- Verify Gmail app password is correct
- Check if 2-factor authentication is enabled
- Ensure EMAIL_USER and EMAIL_PASS are set

**4. Admin Panel Not Loading**
- Check if server is running
- Verify admin credentials
- Check browser console for errors

## 📞 Support

If you encounter issues:

1. Check the error logs in Render dashboard
2. Verify all environment variables are set correctly
3. Test locally first: `npm start`
4. Check GitHub repository for any issues

## 🎉 Success!

Once everything is set up:

- **Website**: `https://your-app-name.onrender.com`
- **Admin Panel**: `https://your-app-name.onrender.com/admin.html`
- **GitHub Repository**: `https://github.com/suryansh-shukla/shukla-law-firm`

Your website will automatically deploy whenever you:
- Push changes to GitHub
- Use the "Save & Deploy" button in admin panel
- Run the deployment script

---

**Need help?** Contact: shukla.suryansh123@gmail.com
