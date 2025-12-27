# Project Structure

Complete overview of the AI Resume Maker project structure.

```
ai-resume-maker/
├── frontend/                      # Next.js Frontend Application
│   ├── app/                      # Next.js 14 App Router
│   │   ├── layout.tsx           # Root layout with Toaster
│   │   ├── page.tsx             # Main page component
│   │   ├── globals.css          # Global styles with Tailwind
│   │   └── next-env.d.ts        # Next.js TypeScript definitions
│   ├── components/              # React Components
│   │   ├── Header.tsx           # Header with template selector & export
│   │   ├── ResumeEditor.tsx     # Main editor with tabs
│   │   ├── LivePreview.tsx      # Live preview component
│   │   ├── AIAssistant.tsx      # AI features interface
│   │   ├── sections/            # Form section components
│   │   │   ├── PersonalInfoSection.tsx
│   │   │   ├── ExperienceSection.tsx
│   │   │   ├── EducationSection.tsx
│   │   │   ├── ProjectSection.tsx
│   │   │   ├── SkillSection.tsx
│   │   │   └── AdditionalSection.tsx
│   │   └── templates/           # Resume templates
│   │       ├── ModernTemplate.tsx
│   │       ├── ClassicTemplate.tsx
│   │       └── CreativeTemplate.tsx
│   ├── store/                   # State Management
│   │   └── resumeStore.ts       # Zustand store with persistence
│   ├── utils/                   # Utility Functions
│   │   ├── api.ts              # API client functions
│   │   └── pdfGenerator.ts     # PDF generation utility
│   ├── package.json            # Frontend dependencies
│   ├── tsconfig.json           # TypeScript configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── postcss.config.js       # PostCSS configuration
│   ├── next.config.js          # Next.js configuration
│   └── env.example             # Environment variables template
│
├── backend/                     # Node.js/Express Backend
│   ├── routes/                 # API Routes
│   │   ├── llm.js             # LLM generation endpoints
│   │   ├── ats.js             # ATS scoring endpoints
│   │   ├── parser.js          # Resume parsing endpoints
│   │   └── pdf.js             # PDF generation endpoints
│   ├── services/              # Business Logic Services
│   │   ├── llmService.js      # OpenAI integration
│   │   ├── atsService.js      # ATS scoring service
│   │   ├── parserService.js   # Resume parsing service
│   │   └── pdfService.js      # PDF generation service
│   ├── nlp/                   # Python NLP Scripts
│   │   ├── resume_parser.py   # spaCy NER + BERT classifier
│   │   └── ats_scorer.py      # TF-IDF ATS scorer
│   ├── uploads/               # Uploaded file storage (created at runtime)
│   ├── server.js              # Express server setup
│   ├── package.json           # Backend dependencies
│   ├── requirements.txt       # Python dependencies
│   └── env.example            # Environment variables template
│
├── prompts/                    # LLM Prompt Templates
│   ├── bullet-point.txt       # Bullet point generation prompt
│   ├── summary.txt            # Summary generation prompt
│   └── tailor-resume.txt      # Resume tailoring prompt
│
├── models/                     # Data Models (if needed)
│
├── package.json               # Root package.json
├── .gitignore                 # Git ignore rules
├── README.md                  # Main documentation
├── QUICKSTART.md              # Quick start guide
├── CONTRIBUTING.md            # Contribution guidelines
├── PROJECT_STRUCTURE.md       # This file
├── setup.sh                   # Linux/Mac setup script
└── setup.ps1                  # Windows PowerShell setup script
```

## Key Files Explained

### Frontend

- **app/page.tsx**: Main application page combining editor and preview
- **store/resumeStore.ts**: Centralized state management with localStorage persistence
- **components/ResumeEditor.tsx**: Tabbed interface for editing all resume sections
- **components/LivePreview.tsx**: Real-time preview with template switching
- **components/AIAssistant.tsx**: Interface for all AI-powered features

### Backend

- **server.js**: Express server with middleware and route configuration
- **routes/llm.js**: Handles all LLM-based generation (bullets, summary, tailoring)
- **routes/ats.js**: ATS scoring endpoint
- **routes/parser.js**: File upload and parsing endpoint
- **routes/pdf.js**: PDF generation endpoint
- **services/llmService.js**: OpenAI API integration with error handling
- **services/atsService.js**: Calls Python ATS scorer
- **services/parserService.js**: Handles PDF/DOCX parsing and NLP extraction
- **services/pdfService.js**: Puppeteer-based PDF generation

### Python NLP

- **nlp/resume_parser.py**: 
  - spaCy NER for entity extraction (names, organizations, locations)
  - BERT-based section classification
  - TF-IDF keyword extraction
  - Structured resume data generation

- **nlp/ats_scorer.py**:
  - TF-IDF vectorization for keyword matching
  - Cosine similarity calculation
  - Keyword matching analysis
  - Feedback generation

### Prompts

- **bullet-point.txt**: Template for generating resume bullet points
- **summary.txt**: Template for professional summary generation
- **tailor-resume.txt**: Template for tailoring resume to job descriptions

## Data Flow

1. **User Input** → Frontend components update Zustand store
2. **AI Request** → Frontend calls backend API
3. **Backend Processing**:
   - LLM requests → OpenAI API
   - ATS scoring → Python script via python-shell
   - Resume parsing → Python script + pdf-parse/mammoth
   - PDF generation → Puppeteer
4. **Response** → Frontend updates UI

## State Management

Zustand store (`resumeStore.ts`) manages:
- Personal information
- Experience entries
- Education entries
- Projects
- Skills
- Certifications and languages
- Selected template
- All mutations (add, update, remove)

Persistence: localStorage via Zustand persist middleware

## API Architecture

RESTful API with Express:
- `/api/llm/*` - LLM generation endpoints
- `/api/ats/*` - ATS scoring endpoints
- `/api/parser/*` - Resume parsing endpoints
- `/api/pdf/*` - PDF generation endpoints

All routes use JSON for request/response except file uploads (multipart/form-data).
