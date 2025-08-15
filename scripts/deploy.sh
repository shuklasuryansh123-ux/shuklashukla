#!/bin/bash

# Deployment script for Shukla Law Firm Website
# This script handles GitHub commits and Render deployment

set -e

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Check if we have uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 You have uncommitted changes. Please commit them first."
    git status --short
    exit 1
fi

# Get commit message
if [ -z "$1" ]; then
    echo "📝 No commit message provided. Using default message."
    COMMIT_MESSAGE="Update website content via admin panel"
else
    COMMIT_MESSAGE="$1"
fi

# Add all changes
echo "📦 Adding all changes to git..."
git add .

# Commit changes
echo "💾 Committing changes with message: $COMMIT_MESSAGE"
git commit -m "$COMMIT_MESSAGE"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin $CURRENT_BRANCH

echo "✅ Deployment process completed!"
echo "🌐 Your website will be automatically deployed to Render."
echo "📊 Check deployment status at: https://dashboard.render.com"
