# LLM-Agentic Chess

**Status:** Done - Deployed · **Score:** 5/5

**Idea:** 2026-01-15   **Started:** 2026-01-20   **Completed:** 2026-02-01

## Skills & Tech
`Other`

## Tags
`Web` · `AI`

## Links
- **GitHub:** <https://github.com/Kedhareswer/llm-chess-agentic>
- **Live:** <https://llm-chess-agentic.vercel.app/>

## 🔬 Research & Enrichment

### Overview
LLM-Agentic Chess (repo `Kedhareswer/llm-chess-agentic`, live at llm-chess-agentic.vercel.app) is a full-stack chess tournament system where different Large Language Models play complete games against each other. Each model acts as an agent: it receives the board state, proposes a move, and the system validates and records it along with the model's reasoning and timing. The live app exposes per-side model selection, skill tiers (e.g. "Scholar"), game history, and a leaderboard, with results aggregated into ELO-style ratings.

### Why it matters
Chess is a clean, fully-observable benchmark for probing LLM reasoning, planning, and instruction-following beyond text Q&A. Unlike trivia, it requires multi-step lookahead and strict adherence to legal-move constraints, so it surfaces hallucination and reasoning failures vividly. A self-serve arena that pits commercial models head-to-head makes those differences tangible and shareable, which is valuable both as a portfolio demo and as an informal model-evaluation harness.

### How it works / Recommended approach
Grounded in the README: it is a Next.js 16 + React 19 + Tailwind app using the App Router for API routes. Game rules and legality are delegated to the `chess.js` library (board representation, legal-move generation, checkmate/draw detection), so the LLM never has authority over correctness. Models are reached through a unified AI SDK abstraction spanning Groq, Google Gemini, and OpenAI (plus a gateway option). The loop: serialize position → prompt model → parse returned move → validate with `chess.js` → on illegal output, apply error handling/retry → persist move, reasoning, and latency to PostgreSQL via Drizzle ORM. Vitest and Playwright cover unit and e2e testing; Docker Compose and `vercel.json` support deployment.

### State of the art & comparable work
Research shows reasoning models dominate this task: o4-mini blunders ~4.2% of plies vs ~31% for GPT-4.1-mini per the LLM CHESS benchmark ([arXiv:2512.01992](https://arxiv.org/abs/2512.01992)). The famous result that `gpt-3.5-turbo-instruct` reaches ~1750–1800 Elo via PGN completion is analyzed by [dynomight](https://dynomight.net/more-chess/). Direct comparables: [maxim-saplin/llm_chess](https://github.com/maxim-saplin/llm_chess) (agentic leaderboard with engine Elo anchoring), [Louis Guichard's LLM Chess Arena](https://chess.louisguichard.fr/), [adamkarvonen/chess_gpt_eval](https://github.com/adamkarvonen/chess_gpt_eval), and Google's [Kaggle Game Arena](https://www.chess.com/news/view/which-ai-model-is-the-best-at-chess-kaggle-game-arena).

### Tech stack
Next.js 16, React 19, TypeScript, Tailwind CSS, `chess.js`, AI SDK (Groq / Gemini / OpenAI), PostgreSQL, Drizzle ORM, Vitest, Playwright, Docker Compose, Vercel.

### Key challenges & risks
- Illegal/hallucinated moves: models drift in long games; retry loops add latency and cost.
- Non-determinism and prompt sensitivity make ELO estimates noisy without many games.
- API cost and rate limits cap tournament scale; no engine baseline means ratings are relative-only.
- `chess.js` correctness is trusted, but PGN/FEN serialization bugs can silently corrupt state.

### Suggested next steps
- Add a calibrated opponent (Stockfish/Komodo Dragon at fixed skill) to anchor absolute Elo, as the LLM CHESS benchmark does.
- Log per-ply move quality vs Stockfish eval (blunder/mistake/best%) for richer leaderboards.
- Add 2025-era reasoning models (o4-mini, o3, DeepSeek-R1) and structured tool-calling (`get_legal_moves`/`make_move`) to cut illegal moves.
- Publish the README's stack consistently (repo language shows mostly HTML/TS) and add a public methodology page for reproducibility.
- Cache identical positions and batch API calls to reduce cost per tournament.

### References
- [LLM CHESS benchmark (arXiv:2512.01992)](https://arxiv.org/abs/2512.01992)
- [maxim-saplin/llm_chess](https://github.com/maxim-saplin/llm_chess)
- [dynomight: explaining LLM chess weirdness](https://dynomight.net/more-chess/)
- [adamkarvonen/chess_gpt_eval](https://github.com/adamkarvonen/chess_gpt_eval)
- [LLM Chess Arena (Louis Guichard)](https://chess.louisguichard.fr/)
- [Kaggle Game Arena chess (Chess.com)](https://www.chess.com/news/view/which-ai-model-is-the-best-at-chess-kaggle-game-arena)

_Researched via web search · 6 sources · done_

---
_Source: Working Projects sheet · generated 2026-06-02 from project.xlsx_
