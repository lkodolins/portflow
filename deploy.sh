#!/bin/bash

# 🚀 Portflow Deployment Script
echo "🎯 Deploying Portflow to Vercel..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Deploy to Vercel
    echo "🚀 Deploying to Vercel..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo "🎉 Deployment successful!"
        echo "📱 Your Portflow app is now live!"
        echo ""
        echo "Next steps:"
        echo "• Test your live app thoroughly"
        echo "• Share your portfolio builder with the world"
        echo "• Monitor performance in Vercel dashboard"
    else
        echo "❌ Deployment failed. Check the error messages above."
    fi
else
    echo "❌ Build failed. Please fix the errors before deploying."
fi