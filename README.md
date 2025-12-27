# AI Resume Maker

A full-stack AI-powered resume builder with hybrid architecture featuring a Next.js frontend and Node.js/Express backend with Python NLP integration.

## Features

- **Multi-Section Resume Editor**: Comprehensive editor for all resume sections (Personal Info, Experience, Education, Projects, Skills, Certifications, Languages)
- **Live Preview**: Real-time preview with three professional templates (Modern, Classic, Creative)
- **AI-Powered Features**:
  - Generate professional resume bullet points
  - Create compelling professional summaries
  - Tailor resumes to specific job descriptions
  - ATS (Applicant Tracking System) scoring and feedback
  - Parse uploaded PDF/Word resumes using NLP
- **PDF Generation**: Export resumes as professional PDFs using Puppeteer
- **Custom NLP Models**: 
  - spaCy Named Entity Recognition (NER) for extracting entities
  - BERT-based section classification
  - TF-IDF keyword extraction and matching

## Architecture

```
├── frontend/              # Next.js + Tailwind CSS frontend
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   │   ├── sections/     # Form section components
│   │   └── templates/    # Resume templates
│   ├── store/            # Zustand state management
│   └── utils/            # Utility functions
├── backend/              # Node.js/Express backend
│   ├── routes/           # API routes
│   ├── services/         # Business logic services
│   ├── nlp/              # Python NLP scripts
│   │   ├── resume_parser.py
│   │   └── ats_scorer.py
│   └── uploads/          # Uploaded file storage
├── prompts/              # LLM prompt templates
└── models/               # Data models (if needed)
```

## Tech Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **OpenAI API** - LLM integration
- **Puppeteer** - PDF generation
- **Multer** - File upload handling
- **pdf-parse** - PDF text extraction
- **mammoth** - DOCX text extraction
- **python-shell** - Python script execution

### NLP (Python)
- **spaCy** - Named Entity Recognition
- **Transformers** - BERT models
- **scikit-learn** - TF-IDF vectorization
- **NumPy & Pandas** - Data processing

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- OpenAI API key (for LLM features)

### 1. Install Dependencies

```bash
# Install root dependencies (if any)
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Install Python dependencies
pip install -r requirements.txt

# Download spaCy language model
python -m spacy download en_core_web_sm
```

### 2. Environment Configuration

#### Backend Environment Variables

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo
PYTHON_PATH=python
CORS_ORIGIN=http://localhost:3000
```

#### Frontend Environment Variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Run the Application

#### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

#### Production Build

```bash
# Build frontend
cd frontend
npm run build
npm start

# Start backend
cd ../backend
npm start
```

## API Endpoints

### LLM Endpoints

- `POST /api/llm/generate-bullet` - Generate resume bullet points
- `POST /api/llm/generate-summary` - Generate professional summary
- `POST /api/llm/tailor-resume` - Tailor resume to job description

### ATS Endpoints

- `POST /api/ats/score` - Score resume against job description

### Parser Endpoints

- `POST /api/parser/parse` - Parse uploaded resume file (PDF/DOCX)

### PDF Endpoints

- `POST /api/pdf/generate` - Generate PDF from resume data

## Usage Guide

### Creating a Resume

1. **Fill Personal Information**: Add your name, contact details, and professional summary
2. **Add Experience**: Enter work experience with AI-generated bullet points
3. **Add Education**: Include your educational background
4. **Add Projects**: Showcase your projects and achievements
5. **Add Skills**: Organize skills by category
6. **Add Additional Info**: Include certifications and languages

### Using AI Features

1. **Generate Bullet Points**: Click "AI Generate" on any experience bullet point
2. **Generate Summary**: Use the AI Assistant tab to create a professional summary
3. **Tailor Resume**: Paste a job description and click "Tailor Resume"
4. **ATS Scoring**: Get your resume scored against a job description
5. **Parse Resume**: Upload an existing resume to extract information

### Exporting

Click the "Export PDF" button in the header to download your resume as a PDF.

## Customization

### Adding New Templates

1. Create a new template component in `frontend/components/templates/`
2. Follow the structure of existing templates
3. Add the template option to the template selector

### Modifying Prompts

Edit prompt files in the `prompts/` directory:
- `bullet-point.txt` - Bullet point generation prompts
- `summary.txt` - Summary generation prompts
- `tailor-resume.txt` - Resume tailoring prompts

### Customizing NLP Models

Modify Python scripts in `backend/nlp/`:
- `resume_parser.py` - Adjust parsing logic
- `ats_scorer.py` - Modify scoring algorithm

## Troubleshooting

### Python Scripts Not Running

- Ensure Python is installed and accessible via `python` command
- Install all required Python packages: `pip install -r backend/requirements.txt`
- Download spaCy model: `python -m spacy download en_core_web_sm`

### OpenAI API Errors

- Verify your API key is set correctly in `backend/.env`
- Check your OpenAI account has sufficient credits
- Ensure you have access to the specified model

### PDF Generation Issues

- Ensure Puppeteer dependencies are installed
- On Linux, you may need: `sudo apt-get install -y libnss3 libatk-bridge2.0-0 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2`

## License

MIT License - feel free to use this project for your own purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on the repository.
