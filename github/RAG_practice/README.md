> 📦 [Kedhareswer/RAG_practice](https://github.com/Kedhareswer/RAG_practice) · ⭐ 0 · TypeScript · updated 2025-10-23  
> _README.md mirrored from branch `main` on 2026-06-02._

---

# RAG Q&A Application Suite

A comprehensive suite of Retrieval Augmented Generation (RAG) applications that have evolved from research prototypes to production-ready solutions. This project demonstrates the complete lifecycle of building AI-powered document Q&A systems using different technologies and frameworks.

## 🎯 Project Overview

This repository contains multiple implementations of a RAG-based Q&A system that allows users to upload documents and ask questions about their content. The system uses local embeddings for privacy and Google's Gemini API for natural language responses.

### Key Features
- 📄 **Multi-format Document Support**: PDF, DOCX, TXT, CSV, Excel, JSON, Markdown, Images (with OCR)
- 🧠 **Local Embeddings**: Client-side processing using Transformer.js
- 💬 **Conversational AI**: Powered by Google Gemini 2.0 Flash
- 🔄 **Persistent Storage**: Documents and conversations saved between sessions
- 🎨 **Modern UI**: Clean, responsive interface with dark theme
- 📱 **Cross-platform**: Works on desktop and mobile devices

## 🏗️ Architecture Evolution

This project showcases the evolution of a RAG system through different implementation stages:

### Phase 1: Research Prototype (Jupyter Notebook)
- **Location**: `jupyter_notebook/RAG.ipynb`
- **Tech Stack**: Python, LangChain, FAISS, HuggingFace Embeddings
- **Purpose**: Initial research and experimentation
- **Features**: Basic document loading, chunking, and vector search

### Phase 2: Web Prototype (Streamlit)
- **Location**: `streamlite/`
- **Tech Stack**: Streamlit, LangChain, FAISS, EasyOCR
- **Purpose**: First web interface for document Q&A
- **Features**: Drag-and-drop uploads, real-time chat interface

### Phase 3: Production App (Next.js)
- **Location**: `Application/`
- **Tech Stack**: Next.js 14, TypeScript, Transformer.js, Tailwind CSS
- **Purpose**: Production-ready, scalable web application
- **Features**: Advanced UI, persistent storage, optimized performance

## 🚀 Current Implementation (Next.js App)

The main application is built with modern web technologies and provides the most advanced features.

### Tech Stack

#### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **Icons**: Lucide React

#### AI & ML
- **Embeddings**: Transformer.js with `all-MiniLM-L6-v2`
- **LLM**: Google Gemini 2.0 Flash API
- **Vector Search**: Cosine similarity with in-memory storage

#### Document Processing
- **PDF**: pdf-parse
- **DOCX**: mammoth
- **Excel/CSV**: xlsx
- **Images**: tesseract.js (OCR)
- **JSON/Markdown**: Native parsing

#### Storage
- **Vectors**: File system persistence (`.cache/vector-store.json`)
- **State**: Browser localStorage
- **Session**: Automatic state management

## 📁 Project Structure

```
RAG/
├── Application/                    # Main Next.js application
│   ├── src/
│   │   ├── app/                    # Next.js app router
│   │   │   ├── api/                # API endpoints
│   │   │   │   ├── upload/         # Document processing
│   │   │   │   ├── query/          # RAG query handling
│   │   │   │   └── vector-store/   # Storage management
│   │   │   ├── globals.css         # Global styles
│   │   │   ├── layout.tsx          # Root layout
│   │   │   └── page.tsx            # Main application page
│   │   ├── components/             # React components
│   │   │   ├── ui/                 # Reusable UI components
│   │   │   ├── FileUpload.tsx      # File upload interface
│   │   │   ├── ChatInterface.tsx   # Chat UI components
│   │   │   ├── LeftSidebar.tsx     # Document management
│   │   │   ├── RightSidebar.tsx    # Settings panel
│   │   │   └── ChatGPTInterface.tsx # Main chat interface
│   │   ├── lib/                    # Core business logic
│   │   │   ├── documentLoader.ts   # Document processing
│   │   │   ├── embeddings.ts       # Text embeddings
│   │   │   ├── vectorStore.ts      # Vector database
│   │   │   └── gemini.ts           # LLM integration
│   │   └── types/                  # TypeScript definitions
│   ├── public/                     # Static assets
│   ├── .cache/                     # Persistent vector storage
│   ├── package.json                # Dependencies
│   └── README.md                   # Application documentation
├── streamlite/                     # Streamlit prototype
│   ├── streamlit_app.py            # Main application
│   └── requirements.txt            # Python dependencies
├── jupyter_notebook/               # Research prototype
│   └── RAG.ipynb                   # Jupyter notebook
├── input/                          # Sample documents
│   ├── outline_data.json          # Academic project outline
│   ├── AI and Plag Report_chunks.md # Research content
│   ├── ICMLA_329_Comment_Response.pdf # Academic paper
│   └── ...                        # Additional sample files
├── .env                           # Environment variables
└── README.md                      # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ (LTS recommended)
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
- npm or yarn package manager

### Quick Start

1. **Clone and navigate to the Application directory:**
   ```bash
   cd Application
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.local.example` to `.env.local` (if it exists)
   - Or add your Google API key directly in the app UI

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

### Alternative: Run Streamlit Version

1. **Navigate to streamlite directory:**
   ```bash
   cd streamlite
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Streamlit app:**
   ```bash
   streamlit run streamlit_app.py
   ```

## 📖 Usage Guide

### Getting Started
1. **Enter API Key**: Paste your Google Gemini API key in the top input field
2. **Upload Documents**: Click "Upload Documents" or drag files to upload
3. **Ask Questions**: Type your questions in the chat input and press Enter
4. **View Sources**: Check the sources panel for document citations

### Supported File Types
- **Documents**: PDF, DOCX, TXT, MD
- **Data Files**: CSV, XLSX, JSON
- **Images**: JPG, PNG (with OCR text extraction)

### Features
- **Persistent Storage**: Documents remain available between sessions
- **Multiple Chat Sessions**: Create and manage separate conversations
- **Settings Panel**: Adjust AI parameters (temperature, model, etc.)
- **Source Citations**: View which documents contain relevant information
- **Responsive Design**: Works on all screen sizes

## 📊 Sample Data

The `input/` directory contains sample documents to test the system:

- **Academic Content**: Capstone project reports, research papers
- **Data Files**: CSV datasets, JSON configurations
- **Images**: Screenshots and diagrams (processed via OCR)
- **Mixed Formats**: Demonstrates multi-format document processing

### Example Queries
- "What is the main objective of this capstone project?"
- "Summarize the research methodology used"
- "What datasets were used in the experiments?"
- "What are the key findings from the results?"

## 🔧 Configuration

### Environment Variables
```bash
GOOGLE_API_KEY=your_gemini_api_key_here
```

### Application Settings
- **Model**: Choose between different Gemini models
- **Temperature**: Control response creativity (0.0 - 1.0)
- **Chunk Size**: Text chunk size for processing (default: 1000)
- **Overlap**: Chunk overlap for context preservation (default: 200)
- **Top-K**: Number of similar chunks to retrieve (default: 4)

## 🧪 Development & Testing

### Running Tests
```bash
cd Application
npm run lint
npm run build
```

### Development Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🤝 Contributing

Contributions are welcome! This project demonstrates the evolution of RAG systems and can benefit from:

- Additional document format support
- Performance optimizations
- UI/UX improvements
- New AI model integrations
- Testing and documentation improvements

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📈 Performance & Limitations

### Strengths
- **Privacy**: Local embeddings, no data sent to external servers
- **Speed**: Optimized for real-time responses
- **Accuracy**: Context-aware responses with source citations
- **Flexibility**: Multiple implementation approaches

### Current Limitations
- **Memory**: Large document sets may impact performance
- **Session-based**: Vector store resets on server restart
- **Single-user**: Not designed for concurrent multi-user access
- **API Dependency**: Requires Google Gemini API key

### Future Enhancements
- Persistent vector database (PostgreSQL + pgvector)
- Multi-user support with authentication
- Streaming responses for better UX
- Advanced filtering and search capabilities

## 📚 Technical Documentation

### Core Components

#### Document Processing Pipeline
1. **Upload**: Files received via multipart form data
2. **Processing**: Format-specific parsers extract text
3. **Chunking**: RecursiveCharacterTextSplitter creates overlapping chunks
4. **Embedding**: Transformer.js generates vector representations
5. **Storage**: Vectors saved to persistent file storage

#### Query Processing Pipeline
1. **Input**: Natural language query received
2. **Embedding**: Query converted to vector representation
3. **Retrieval**: Cosine similarity search finds relevant chunks
4. **Generation**: Gemini API generates contextual response
5. **Response**: Answer with sources returned to user

### API Endpoints

#### `/api/upload`
- **Method**: POST
- **Purpose**: Process and store uploaded documents
- **Input**: FormData with files
- **Output**: Processing statistics

#### `/api/query`
- **Method**: POST
- **Purpose**: Handle RAG queries
- **Input**: Query text, API key, settings
- **Output**: AI response with sources and metrics

#### `/api/vector-store`
- **Method**: GET/POST
- **Purpose**: Manage vector storage
- **Features**: Status checking, data clearing

## 🔗 Related Resources

- [Transformer.js Documentation](https://huggingface.co/docs/transformers.js)
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [LangChain Documentation](https://python.langchain.com/)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Transformer.js** team for local embedding capabilities
- **Google AI** for Gemini API access
- **Next.js** team for the excellent framework
- **Hugging Face** for the embedding model
- **LangChain** community for initial inspiration

---

*Built with ❤️ using modern web technologies and AI*
