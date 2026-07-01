> 📦 [Kedhareswer/agentic_browser_automation](https://github.com/Kedhareswer/agentic_browser_automation) · ⭐ 0 · TypeScript · updated 2025-12-11  
> _README.md mirrored from branch `main` on 2026-06-02._

---

# 🤖 Agentic Browser Automation

A production-ready multi-agent orchestrator for safe, intelligent browser automation using LangGraph patterns, Gemini AI, and Browserless.io.

## 🎯 Features

- **Multi-Agent Architecture**: PlannerAgent, ValidatorAgent, and ExecutorAgent working in coordination
- **Natural Language Interface**: Describe automations in plain English
- **Automated Safety Validation**: Blocks dangerous operations before execution
- **Visual Feedback**: Screenshots and execution logs
- **Vercel-Ready**: Serverless deployment with external browser runtime

## 🏗️ Architecture

```
User Request → PlannerAgent → ValidatorAgent → ExecutorAgent → Results
                    ↓              ↓              ↓
                 Gemini AI    Safety Rules   Browserless.io
```

### Components

1. **PlannerAgent**: Converts natural language to structured action plans using Gemini
2. **ValidatorAgent**: Applies automated safety rules to block dangerous operations
3. **ExecutorAgent**: Executes validated plans via Browserless.io browser runtime
4. **Orchestrator**: Coordinates agent flow with retry logic and error handling

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ 
- npm or yarn
- Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
- Browserless.io API key ([Sign up here](https://www.browserless.io/))

### Installation

```bash
# Clone the repository
git clone <your-repo>
cd agentic_browser_automation

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Add your API keys to .env
```

### Configuration

Edit `.env` with your credentials:

```env
BROWSERLESS_API_KEY=your_browserless_key_here
GEMINI_API_KEY=your_gemini_key_here
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

## 📖 Usage Examples

### Example 1: Simple Navigation
```
Navigate to https://example.com and take a screenshot
```

### Example 2: Form Filling
```
Go to https://httpbin.org/forms/post, fill in name as "John Doe" and email as "john@example.com", then submit
```

### Example 3: Web Scraping
```
Visit https://news.ycombinator.com, scroll down, and capture the top 5 post titles
```

## 🔒 Safety Features

The ValidatorAgent automatically blocks:

- ❌ JavaScript accessing localStorage/cookies
- ❌ File:// and javascript: URL schemes
- ❌ Code injection attempts
- ❌ Excessively long wait times
- ❌ Malicious script patterns

All actions are validated before execution.

## 📊 API Reference

### POST /api/automate

Execute an automation request.

**Request Body:**
```json
{
  "request": "Navigate to example.com",
  "options": {
    "maxRetries": 2,
    "timeout": 30000,
    "captureScreenshots": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "plan": { "actions": [...], "risks": [...] },
  "validation": { "safe": true, "warnings": [...] },
  "execution": { "logs": [...], "screenshots": [...] },
  "duration": 5432
}
```

### POST /api/validate

Validate a plan without executing it.

**Request Body:**
```json
{
  "request": "Navigate to example.com"
}
```

**Response:**
```json
{
  "plan": { "actions": [...] },
  "validation": { "safe": true, "blockedActions": [] },
  "report": "=== Validation Report ==="
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run in watch mode
npm run test:watch
```

## 📁 Project Structure

```
agentic_browser_automation/
├── agents/               # Agent implementations
│   ├── planner-agent.ts
│   ├── validator-agent.ts
│   └── executor-agent.ts
├── lib/                  # Core libraries
│   ├── orchestrator.ts
│   ├── browserless-client.ts
│   └── gemini-client.ts
├── pages/
│   ├── api/
│   │   ├── automate.ts
│   │   └── validate.ts
│   └── index.tsx
├── types/
│   └── automation.ts
├── docs/                 # Documentation
└── tests/                # Test files
```

## 🚢 Deployment

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Add environment variables in Vercel dashboard
4. Deploy: `vercel --prod`

### Environment Variables (Vercel)

Set these in your Vercel project settings:
- `BROWSERLESS_API_KEY`
- `GEMINI_API_KEY`

## 🤝 Contributing

See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines.

## 📝 License

MIT License - See LICENSE file for details.

## 🔗 Links

- [Documentation](./docs/)
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [API Reference](./docs/API.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)

## 💡 Support

For issues and questions:
- Check [Troubleshooting Guide](./docs/TROUBLESHOOTING.md)
- Open an issue on GitHub
- Review example automations in `/docs/examples/`
