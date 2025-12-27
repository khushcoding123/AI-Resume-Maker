# AI Resume Maker Setup Script for Windows PowerShell

Write-Host "🚀 Setting up AI Resume Maker..." -ForegroundColor Cyan

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python is not installed. Please install Python 3.8+ first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Prerequisites check passed" -ForegroundColor Green

# Install root dependencies
Write-Host "📦 Installing root dependencies..." -ForegroundColor Yellow
npm install

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
Set-Location ..

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
Set-Location ..

# Install Python dependencies
Write-Host "📦 Installing Python dependencies..." -ForegroundColor Yellow
pip install -r backend/requirements.txt

# Download spaCy model
Write-Host "📦 Downloading spaCy language model..." -ForegroundColor Yellow
python -m spacy download en_core_web_sm
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Warning: Could not download spaCy model. You may need to install it manually." -ForegroundColor Yellow
}

# Create environment files
Write-Host "📝 Creating environment files..." -ForegroundColor Yellow
if (-Not (Test-Path "backend\.env")) {
    Copy-Item "backend\env.example" "backend\.env"
    Write-Host "✅ Created backend/.env - Please update with your OpenAI API key" -ForegroundColor Green
} else {
    Write-Host "⚠️ backend/.env already exists, skipping..." -ForegroundColor Yellow
}

if (-Not (Test-Path "frontend\.env.local")) {
    Copy-Item "frontend\env.example" "frontend\.env.local"
    Write-Host "✅ Created frontend/.env.local" -ForegroundColor Green
} else {
    Write-Host "⚠️ frontend/.env.local already exists, skipping..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✨ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update backend/.env with your OpenAI API key"
Write-Host "2. Start the backend: cd backend; npm run dev"
Write-Host "3. Start the frontend: cd frontend; npm run dev"
Write-Host ""
Write-Host "Happy resume building! 🎉" -ForegroundColor Green
