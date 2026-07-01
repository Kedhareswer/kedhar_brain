> 📦 [Kedhareswer/interviewai-navigator](https://github.com/Kedhareswer/interviewai-navigator) · ⭐ 0 · TypeScript · updated 2025-12-05 · 🌐 [live](https://interviewai-navigator.vercel.app)  
> _README.md mirrored from branch `main` on 2026-06-02._

---

# InterviewOS - AI-Powered Interview Platform

A full-stack Next.js application for conducting AI-powered technical and behavioral interviews using multi-agent orchestration, RAG, and voice capabilities. Everything runs in the browser with serverless backend - deploy once to Vercel, no separate backend needed.

## 🎯 What It Does

InterviewOS automates the entire interview process:
1. **Ingests** job descriptions and candidate profiles (resume, LinkedIn, GitHub, portfolio)
2. **Builds** a candidate knowledge graph using RAG (Retrieval-Augmented Generation)
3. **Runs** multi-agent interviews (technical + HR) via an intelligent planner
4. **Outputs** structured, defensible evaluations with scores and recommendations

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: Supabase (PostgreSQL with pgvector)
- **Storage**: Supabase Storage (for artifacts)
- **AI/Agents**: Google Gemini 2.0, Custom agent orchestration
- **Vector Store**: Supabase pgvector extension (768-dimensional embeddings)
- **Deployment**: Vercel (single deployment - frontend + backend)

### System Components

1. **API & Session Backend** - Next.js API routes handling all backend logic
2. **Ingestion & RAG Service** - Processes job descriptions and candidate data
3. **Agent Orchestrator** - Multi-agent system for interview execution
4. **Voice Bridge** - Browser-based TTS/STT layer (Web Speech API + external services)
5. **Storage** - Supabase for relational data, vector embeddings, and file storage

## ✨ Features

### ✅ Implemented

- **Complete Database Schema** - 7 tables with proper relations and RLS security
- **Full CRUD API** - Jobs, candidates, interviews with ingestion endpoints
- **Multi-Agent System** - Planner, Expert, HR, and Evaluation agents
- **Interview Orchestration** - Automated interview flow with state management
- **RAG Vector Store** - Candidate context retrieval using Gemini embeddings
- **Data Ingestion**:
  - Resume parsing (PDF/text) with section detection
  - GitHub API integration with README extraction
  - Portfolio web scraping (multi-page)
  - LinkedIn structure (ready for API/scraping service)
  - Job description normalization using LLM
- **Frontend Dashboard**:
  - Job management interface
  - Candidate management with ingestion controls
  - Interview management and real-time interface
  - Event streaming and evaluation display
- **Voice Layer Structure** - Browser-based TTS/STT ready for integration
- **Security** - RLS enabled on all tables with comprehensive policies

### 🚧 Future Enhancements

- Enhanced LinkedIn integration (API or scraping service)
- Voice interview UI integration
- Advanced analytics and reporting
- Multi-language support
- Custom agent configurations

## 📦 Installation

See [SETUP.md](./SETUP.md) for detailed setup instructions.

Quick start:
```bash
npm install
cp env.example .env.local
# Fill in your keys in .env.local
npm run dev
```

## 📊 Database Schema

### Core Tables
- `jobs` - Job descriptions with normalized competencies
- `candidates` - Candidate profiles with links
- `interviews` - Interview sessions
- `interview_events` - Audit trail of all interview events
- `evaluations` - Final interview evaluations
- `hr_config` - HR question library and configuration
- `candidate_embeddings` - Vector embeddings for RAG (768 dimensions)

### Relations
- Jobs → Interviews (one-to-many)
- Candidates → Interviews (one-to-many)
- Interviews → Interview Events (one-to-many)
- Interviews → Evaluations (one-to-one)
- Candidates → Candidate Embeddings (one-to-many)

All tables have Row Level Security (RLS) enabled with proper policies.

## 🔌 API Routes

### Jobs
- `GET /api/jobs` - List all jobs
- `POST /api/jobs` - Create a job
- `GET /api/jobs/[id]` - Get job details
- `PATCH /api/jobs/[id]` - Update job
- `DELETE /api/jobs/[id]` - Delete job
- `POST /api/jobs/[id]/ingest` - Trigger job ingestion (normalize JD)

### Candidates
- `GET /api/candidates` - List all candidates
- `POST /api/candidates` - Create candidate
- `GET /api/candidates/[id]` - Get candidate details
- `PATCH /api/candidates/[id]` - Update candidate
- `POST /api/candidates/[id]/ingest` - Trigger candidate ingestion (parse resume, fetch GitHub, scrape portfolio)

### Interviews
- `GET /api/interviews` - List interviews (with filters: ?status=, ?job_id=, ?candidate_id=)
- `POST /api/interviews` - Create interview
- `GET /api/interviews/[id]` - Get interview details with events
- `PATCH /api/interviews/[id]` - Update interview
- `POST /api/interviews/[id]/start` - Start interview (triggers agent system)
- `POST /api/interviews/[id]/answer` - Submit candidate answer
- `GET /api/interviews/[id]/stream` - Stream interview events (Server-Sent Events)
- `GET /api/interviews/[id]/evaluation` - Get final evaluation

## 🤖 Agent System

### Agents

1. **PlannerAgent** - Orchestrates interview flow
   - Decides which competency to probe next
   - Chooses appropriate agent (domain vs HR)
   - Determines when to stop
   - Maintains interview state

2. **ExpertDomainAgent** - Technical questions
   - Generates domain-specific questions based on competency and difficulty
   - Evaluates answers with evidence-based scoring
   - Uses RAG to retrieve candidate context

3. **HRBehavioralAgent** - Behavioral questions
   - Selects questions from configurable library
   - Adapts questions to candidate/job context
   - Evaluates answers using behavioral rubrics

4. **EvaluationAgent** - Final evaluation
   - Synthesizes all interview events and scores
   - Generates comprehensive evaluation
   - Provides clear hiring recommendation

### Interview Flow

1. HR creates job and candidate
2. Ingestion services process and index data (async)
3. Interview is created and started
4. Planner initializes state from job and candidate
5. Planner decides next competency/agent
6. Expert agent generates question using RAG context
7. Question sent to frontend via SSE
8. Candidate answers
9. Agent evaluates answer and scores
10. Planner updates state and decides next action
11. Process repeats until completion
12. Evaluation agent generates final report

## 🗂️ Project Structure

```
src/
├── app/
│   ├── api/              # Next.js API routes (serverless)
│   ├── dashboard/        # Frontend dashboard pages
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/           # React components
├── lib/
│   ├── agents/          # AI agent system
│   ├── ingestion/       # Data ingestion services
│   ├── rag/             # RAG/vector store
│   ├── voice/           # Voice layer
│   ├── storage.ts       # Storage utilities
│   ├── supabase/        # Supabase clients
│   ├── gemini/          # Gemini AI client
│   └── types/           # TypeScript types
└── hooks/               # React hooks
```

## 🔒 Security

- **Row Level Security (RLS)** enabled on all tables
- **Secure RLS policies** with relation checks
- **Function security** (search_path fixed to prevent attacks)
- **Proper permissions** granted to authenticated role
- **Service role key** only used server-side (never exposed to client)

## 🚀 Deployment

Deploy to Vercel:
```bash
vercel
```

Make sure to set all environment variables in Vercel dashboard. The entire application (frontend + backend) deploys as a single Next.js app.

## 📝 Environment Variables

See `env.example` for all required and optional environment variables.

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)
- `GEMINI_API_KEY` - Google Gemini API key

**Optional:**
- `GITHUB_TOKEN` - For higher GitHub API rate limits
- `ELEVENLABS_API_KEY` - For voice TTS
- `GOOGLE_SPEECH_API_KEY` - For voice STT

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) folder:

- **[Documentation Index](./docs/README.md)** - Overview and navigation
- **[Architecture](./docs/architecture.md)** - System architecture and design
- **[Agent System](./docs/agents.md)** - Multi-agent orchestration (DeepAgents)
- **[Candidate Flow](./docs/candidate-flow.md)** - Candidate user journey
- **[HR Flow](./docs/hr-flow.md)** - HR user journey and management
- **[API Documentation](./docs/api.md)** - REST API endpoints
- **[Database Schema](./docs/database.md)** - Database structure and relationships
- **[Deployment Guide](./docs/deployment.md)** - Production deployment instructions

**Quick Start Guides:**
- [SETUP.md](./SETUP.md) - Detailed setup guide
- [supabase/migrations/](./supabase/migrations/) - Database migrations

Code is well-documented with TypeScript types.

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📄 License

Private - All rights reserved
