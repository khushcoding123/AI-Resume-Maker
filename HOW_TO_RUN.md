# How to Run AI Resume Maker

## Step-by-Step Instructions

### 1. Install Dependencies

**First time setup (choose one method):**

#### Option A: Automated Setup (Easiest)
```powershell
# Windows PowerShell
.\setup.ps1
```

#### Option B: Manual Setup
```powershell
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..

# Install Python dependencies
pip install -r backend/requirements.txt

# Download spaCy language model
python -m spacy download en_core_web_sm
```

### 2. Configure Environment Variables

**Backend Configuration:**
1. Copy `backend/env.example` to `backend/.env`
2. Open `backend/.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

**Frontend Configuration:**
1. Copy `frontend/env.example` to `frontend/.env.local`
2. The default should work, but verify it contains:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   ```

### 3. Run the Application

**You need TWO terminal windows open:**

#### Terminal 1 - Start Backend Server
```powershell
cd backend
npm run dev
```

You should see:
```
Server running on port 5000
Environment: development
```

#### Terminal 2 - Start Frontend
```powershell
cd frontend
npm run dev
```

You should see:
```
Ready in [time]
Local: http://localhost:3000
```

### 4. Access the Application

Open your browser and go to:
**http://localhost:3000**

## Quick Commands Reference

```powershell
# Start Backend (Terminal 1)
cd backend
npm run dev

# Start Frontend (Terminal 2)
cd frontend
npm run dev

# Build for Production (Frontend)
cd frontend
npm run build
npm start

# Start Production Backend
cd backend
npm start
```

## Troubleshooting

### Port 5000 Already in Use?
Change the port in `backend/.env`:
```
PORT=5001
```

Then update `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### Python Scripts Not Working?
1. Verify Python is installed: `python --version`
2. Install dependencies: `pip install -r backend/requirements.txt`
3. Download spaCy model: `python -m spacy download en_core_web_sm`

### OpenAI API Errors?
- Check your API key is correct in `backend/.env`
- Verify you have credits in your OpenAI account
- Make sure the model name matches your access level

### Module Not Found Errors?
Run these commands:
```powershell
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install

# Python
pip install -r backend/requirements.txt
```

## What You'll See

1. **Resume Editor** (left side) - Fill in your information
2. **Live Preview** (right side) - See your resume update in real-time
3. **Template Selector** - Choose Modern, Classic, or Creative
4. **AI Assistant Tab** - Generate summaries, tailor resume, get ATS scores
5. **Export PDF** - Download your resume as PDF

Enjoy building your resume! 🚀
