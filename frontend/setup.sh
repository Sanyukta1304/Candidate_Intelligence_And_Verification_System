#!/usr/bin/env bash

# CredVerify Frontend - Quick Setup Script
# This script sets up the frontend project quickly

echo "🚀 CredVerify Frontend Setup"
echo "=============================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
else
    echo "⚠️  .env file already exists"
fi

echo ""
echo "=============================="
echo "✨ Setup complete!"
echo ""
echo "📝 Available commands:"
echo "   npm run dev     - Start development server"
echo "   npm run build   - Build for production"
echo "   npm run preview - Preview production build"
echo ""
echo "🌐 Frontend will run at: http://localhost:3000"
echo "🔗 Backend should run at: http://localhost:5000"
echo ""
echo "To start developing:"
echo "   npm run dev"
echo ""
