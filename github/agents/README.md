> 📦 [Kedhareswer/agents](https://github.com/Kedhareswer/agents) · ⭐ 0 · TypeScript · updated 2025-12-05  
> _README.md mirrored from branch `main` on 2026-06-02._

---

# Data Scientist Copilot

A production-ready AI-powered data analysis platform built with Next.js, LangChain, LangGraph, DeepAgents, and Google Gemini. Upload CSV files and get instant exploratory data analysis, visualizations, and expert guidance from an AI senior data scientist.

## Features

- **Automatic EDA**: Comprehensive exploratory data analysis with statistics, correlations, and data quality checks
- **Smart Visualizations**: AI-generated plots (histograms, bar charts, scatter plots) tailored to your data
- **Expert Chat Interface**: Interactive chat with an AI data scientist powered by Google Gemini
- **LangGraph Workflows**: Multi-step EDA orchestration with state management
- **Persistent Storage**: Neon Postgres for datasets, EDA results, and chat history
- **Real-time Streaming**: Live updates during analysis and chat responses

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Recharts
- **AI/ML**: LangChain, LangGraph, DeepAgents, Google Gemini (via @langchain/google-genai)
- **Database**: Neon Postgres with Drizzle ORM
- **Data Processing**: PapaParse (CSV), simple-statistics

## Prerequisites

1. **Neon Database**
   - Sign up at [neon.tech](https://neon.tech)
   - Create a new project and get your connection string

2. **Google AI Studio API Key**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create an API key for Gemini

## Installation

1. Clone and navigate to the project:
```bash
cd data-scientist-copilot
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:
```env
DATABASE_URL=your_neon_connection_string
GOOGLE_API_KEY=your_google_ai_studio_api_key
```

4. Generate and push database schema:
```bash
npx drizzle-kit generate
npx drizzle-kit push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Usage

1. **Upload Dataset**: Upload a CSV file (up to 50MB)
2. **Wait for EDA**: Automatic analysis runs in the background
3. **Explore Results**: View statistics, correlations, and default visualizations
4. **Chat with AI**: Ask questions about your data or request custom plots

### Example Chat Prompts

- "What are the key characteristics of this dataset?"
- "Show me a histogram of the price column"
- "What columns have the most missing values?"
- "Create a scatter plot of age vs income"
- "How should I approach building a churn prediction model?"
- "What feature engineering steps would you recommend?"

## Architecture

### LangGraph EDA Workflow

```
START → load_dataset → compute_stats → generate_plots → generate_summary → save_results → END
```

### Chat Agent Tools

- `get_dataset_info`: Fetch dataset metadata and EDA results
- `get_column_stats`: Get detailed statistics for specific columns
- `generate_plot`: Create visualizations on demand
- `recommend_next_steps`: Get analysis recommendations

### Database Schema

- `datasets`: Dataset metadata and sample data
- `eda_runs`: EDA results, correlations, and plots
- `chat_sessions`: Chat session management
- `chat_messages`: Message history
- `checkpoints`: LangGraph state persistence

## Project Structure

```
data-scientist-copilot/
├── app/
│   ├── api/
│   │   ├── upload/          # CSV upload endpoint
│   │   ├── datasets/[id]/   # Dataset info endpoint
│   │   └── chat/            # Chat endpoint
│   ├── datasets/[id]/       # Dataset detail page
│   └── page.tsx             # Home/upload page
├── components/
│   ├── upload-panel.tsx     # File upload UI
│   ├── eda-summary.tsx      # EDA results display
│   ├── plot-panel.tsx       # Chart rendering
│   └── chat-panel.tsx       # Chat interface
├── lib/
│   ├── agents/
│   │   ├── eda-graph.ts     # LangGraph EDA workflow
│   │   ├── chat-agent.ts    # Chat agent with tools
│   │   └── tools.ts         # LangChain tools
│   ├── data/
│   │   ├── profiler.ts      # Data profiling logic
│   │   └── types.ts         # TypeScript types
│   └── db/
│       ├── schema.ts        # Drizzle schema
│       └── index.ts         # Database client
└── drizzle.config.ts        # Drizzle configuration
```

## Development

### Adding New Tools

1. Define tool in `lib/agents/tools.ts`
2. Add to `allTools` array
3. Update agent system prompt in `lib/agents/chat-agent.ts`

### Adding New Plot Types

1. Extend `PlotConfig` type in `lib/data/types.ts`
2. Add generation logic in `lib/agents/tools.ts` (`generatePlot`)
3. Add rendering in `components/plot-panel.tsx`

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

```env
DATABASE_URL=your_neon_connection_string
GOOGLE_API_KEY=your_google_ai_studio_api_key
NODE_ENV=production
```

## Troubleshooting

### Database Connection Issues
- Verify your Neon connection string
- Ensure database schema is pushed: `npx drizzle-kit push`

### Google AI API Errors
- Check API key is valid
- Verify API quotas in Google AI Studio

### CSV Upload Fails
- Ensure file is valid CSV with headers
- Check file size (max 50MB)
- Verify column names don't have special characters

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.

## Acknowledgments

- Built with [LangChain](https://langchain.com)
- Powered by [Google Gemini](https://deepmind.google/technologies/gemini/)
- Database by [Neon](https://neon.tech)
- Framework by [Next.js](https://nextjs.org)
