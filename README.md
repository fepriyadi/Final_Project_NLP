# Final_Project_NLP

Tokopedia review-rating consistency detector. Uses OpenRouter LLMs to compare review text
against star ratings and flag inconsistencies.

## Prerequisites

- [Node.js](https://nodejs.org/) 22+ (or Docker)

## Install

```bash
npm install
```

Create a `.env` file in the project root with at least:

```env
OPENROUTER_API_KEY=your-openrouter-key
OPENROUTER_MODEL=google/gemini-3.1-flash-lite
OPENROUTER_SITE_URL=http://localhost:3000
OPENROUTER_APP_NAME=Tokopedia Review Consistency Detector
PORT=3000
```

Optional variables:

| Variable | Purpose |
| --- | --- |
| `OPENROUTER_MODELS` | Comma-separated allowlist of models clients may request |
| `SCRAPER_APP_HOST` | Base URL of the external Tokopedia scraper service (required for `/scrape`) |
| `SCRAPER_APP_TOKEN` | Bearer token for the scraper service |
| `LANGFUSE_PUBLIC_KEY` | Enable LLM tracing in [Langfuse](https://langfuse.com) |
| `LANGFUSE_SECRET_KEY` | Langfuse secret key |
| `LANGFUSE_BASE_URL` | Langfuse region or self-hosted URL (e.g. `https://us.cloud.langfuse.com`) |

Restart the server after changing `.env`.

## Run

**Local development** (auto-restarts on file changes):

```bash
npm run dev
```

**Production-style** (no file watching):

```bash
npm start
```

**Docker**:

```bash
docker compose up
```

The API listens on `http://localhost:3000` by default (or the `PORT` in `.env`).

Verify it is up:

```bash
curl http://localhost:3000/health
```

## Observability (Langfuse)

LLM calls are traced with [Langfuse](https://langfuse.com). Set `LANGFUSE_PUBLIC_KEY`
and `LANGFUSE_SECRET_KEY` (from https://cloud.langfuse.com) in `.env` to enable it;
optionally set `LANGFUSE_BASE_URL` for the US region or a self-hosted instance. Tracing
is automatically disabled when the keys are absent — the app runs normally either way.
Each request becomes a trace, and every OpenRouter call is recorded as a generation
with its prompt, response, model, and token usage. Confirm the status via `GET /health`
(`langfuse_enabled`).

## Endpoints

Interactive docs: `GET /api-docs` (Swagger UI)

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/health` | Service status, default/allowed models, API key presence, and Langfuse status |
| `GET` | `/models` | List the default model and allowed OpenRouter models |
| `GET` | `/openapi.json` | Machine-readable OpenAPI 3 spec |
| `GET` | `/api-docs` | Swagger UI for trying endpoints in the browser |
| `POST` | `/analyze` | Analyze one review (`review_text`, `rating`, optional `model`) |
| `POST` | `/analyze-batch` | Analyze multiple reviews in one JSON payload (`reviews` array, optional `model`) |
| `POST` | `/analyze-bulk` | Upload a CSV (`file` field) with `review_text` and `rating` columns; returns all results |
| `POST` | `/scrape` | Scrape reviews from a Tokopedia product URL via the external scraper, then analyze each one (`url`, `total_reviews` 1–100, optional `model`) |

Analysis responses include `predicted_sentiment`, `rating_sentiment`, `is_consistent`,
`explanation`, and `confidence_percentage`.
