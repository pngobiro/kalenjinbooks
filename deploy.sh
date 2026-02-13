#!/bin/bash

# KaleeReads Deployment Script
# This script helps prepare your app for Cloudflare Pages deployment

set -e

echo "🚀 KaleeReads Deployment Preparation"
echo "===================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git repository not initialized"
    echo "Run: git init"
    exit 1
fi

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "📝 You have uncommitted changes"
    echo ""
    git status -s
    echo ""
    read -p "Do you want to commit these changes? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter commit message: " commit_msg
        git add .
        git commit -m "$commit_msg"
        echo "✅ Changes committed"
    fi
fi

# Check if remote is set
if ! git remote | grep -q origin; then
    echo "❌ No git remote 'origin' found"
    echo "Add your repository:"
    echo "  git remote add origin <your-repo-url>"
    exit 1
fi

# Push to remote
echo ""
echo "📤 Pushing to remote repository..."
git push origin main || git push origin master

echo ""
echo "✅ Code pushed successfully!"
echo ""
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. Go to Cloudflare Dashboard:"
echo "   https://dash.cloudflare.com"
echo ""
echo "2. Navigate to: Workers & Pages → Create application → Pages"
echo ""
echo "3. Connect your Git repository"
echo ""
echo "4. Use these build settings:"
echo "   - Framework: Next.js"
echo "   - Build command: npm run build"
echo "   - Output directory: .next"
echo "   - Node version: 20"
echo ""
echo "5. Add environment variables:"
echo "   - NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your-client-id>"
echo "   - NEXT_PUBLIC_WORKER_URL=https://kalenjin-books-worker.pngobiro.workers.dev"
echo "   - DATABASE_URL=file:./dev.db"
echo ""
echo "6. Click 'Save and Deploy'"
echo ""
echo "7. After deployment, update:"
echo "   - Worker CORS settings (add Pages URL)"
echo "   - Google OAuth settings (add Pages URL)"
echo ""
echo "📖 For detailed instructions, see:"
echo "   - QUICK_DEPLOY.md (quick start)"
echo "   - DEPLOYMENT.md (full guide)"
echo "   - .deployment-checklist.md (checklist)"
echo ""
echo "🎉 Good luck with your deployment!"
