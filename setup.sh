#!/bin/bash

# AI Resume Maker Setup Script

echo "🚀 Setting up AI Resume Maker..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Python
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.8+ first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install Python dependencies
echo "📦 Installing Python dependencies..."
if command -v pip3 &> /dev/null; then
    pip3 install -r backend/requirements.txt
else
    pip install -r backend/requirements.txt
fi

# Download spaCy model
echo "📦 Downloading spaCy language model..."
if command -v python3 &> /dev/null; then
    python3 -m spacy download en_core_web_sm || echo "⚠️ Warning: Could not download spaCy model. You may need to install it manually."
else
    python -m spacy download en_core_web_sm || echo "⚠️ Warning: Could not download spaCy model. You may need to install it manually."
fi

# Make Python scripts executable
echo "🔧 Making Python scripts executable..."
chmod +x backend/nlp/resume_parser.py
chmod +x backend/nlp/ats_scorer.py

# Create environment files
echo "📝 Creating environment files..."
if [ ! -f backend/.env ]; then
    cp backend/env.example backend/.env
    echo "✅ Created backend/.env - Please update with your OpenAI API key"
else
    echo "⚠️ backend/.env already exists, skipping..."
fi

if [ ! -f frontend/.env.local ]; then
    cp frontend/env.example frontend/.env.local
    echo "✅ Created frontend/.env.local"
else
    echo "⚠️ frontend/.env.local already exists, skipping..."
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your OpenAI API key"
echo "2. Start the backend: cd backend && npm run dev"
echo "3. Start the frontend: cd frontend && npm run dev"
echo ""
echo "Happy resume building! 🎉"
