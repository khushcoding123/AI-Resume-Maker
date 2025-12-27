# Quick Start Guide

Get up and running with AI Resume Maker in minutes!

## Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **OpenAI API Key** - [Get one here](https://platform.openai.com/api-keys)

## Installation

### Option 1: Automated Setup (Recommended)

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows:**
```powershell
.\setup.ps1
```

### Option 2: Manual Setup

1. **Install dependencies:**
```bash
# Root
npm install

# Frontend
cd frontend
npm install
cd ..

# Backend
cd backend
npm install
cd ..

# Python
pip install -r backend/requirements.txt
python -m spacy download en_core_web_sm
```

2. **Configure environment:**

Create `backend/.env`:
```env
PORT=5000
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-3.5-turbo
PYTHON_PATH=python
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Running the Application

### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```

### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## First Steps

1. **Fill in your information** in the Personal Info section
2. **Add your experience** - Use the "AI Generate" button to create bullet points
3. **Add education, projects, and skills**
4. **Generate a summary** using the AI Assistant
5. **Choose a template** (Modern, Classic, or Creative)
6. **Export as PDF** when ready

## Troubleshooting

### Python scripts not working?
- Ensure Python is in your PATH
- Install dependencies: `pip install -r backend/requirements.txt`
- Download spaCy model: `python -m spacy download en_core_web_sm`

### OpenAI API errors?
- Check your API key in `backend/.env`
- Verify you have credits in your OpenAI account
- Check the model name matches your access level

### Port already in use?
- Change `PORT` in `backend/.env`
- Update `NEXT_PUBLIC_API_URL` in `frontend/.env.local` to match

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check out [CONTRIBUTING.md](CONTRIBUTING.md) if you want to contribute
- Explore the codebase and customize to your needs

Happy resume building! 🚀
