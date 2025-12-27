# Freelance Escrow Backend
 TypeScript + Express backend for a freelance escrow service.

## Overview

- REST API managing users, jobs, submissions, escrows, transactions, and disputes.
- MongoDB persistence via Mongoose.
- Structured logging, health checks, and error handling.
- Designed to run locally, in Docker, or on a cloud platform.

## Prerequisites

- Node.js >= 18
- npm (or yarn)
- MongoDB instance (local or managed)
- Optional: Docker, CI/CD provider

## Quick install (local)

1. Copy env template and set values:
   ```bash
   cp .env.example .env
   ```
   Edit .env: set PORT, MONGODB_URI, NODE_ENV, JWT_SECRET, etc.
2. Install:
   ```bash
   npm ci
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```
4. Build & run (production):
   ```bash
   npm run build
   npm start
   ```

## Environment variables (recommended)

- `PORT` (e.g. 4000)
- `MONGODB_URI` (mongodb+srv://... or mongodb://...)
- `NODE_ENV` (development|production)
- `JWT_SECRET`
- `LOG_LEVEL` (info|warn|error|debug)
- `SMTP_*` (if email sending is used)

## Development

- Hot-reload: `npm run dev`
- Lint: `npm run lint`
- Format: `npm run format`
- Tests: `npm test`

## Docker (example)

- Dockerfile (production):
  ```dockerfile
  FROM node:18-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --only=production
  COPY . .
  RUN npm run build
  CMD ["node", "dist/server.js"]
  ```

- Build & run:
  ```bash
  docker build -t freelance-escrow-backend .
  docker run -e MONGODB_URI="..." -p 4000:4000 freelance-escrow-backend
  ```

## Logging & monitoring

- Use the app logger (winston) provided in /src/config/logger.
- Send structured logs (JSON) to centralized logging (CloudWatch, ELK, Datadog).
- Add metrics (Prometheus/OpenTelemetry) and tracing if needed.

## Health & readiness

- `GET /health` — basic liveness check (returns `{ "status": "ok" }`).
- Consider adding `/metrics` and readiness probe for orchestrators.

## Security best practices

- Run behind HTTPS/TLS (load balancer or reverse proxy).
- Store secrets in a secret manager (AWS Secrets Manager, Azure KeyVault).
- Validate and sanitize all inputs; enable schema validation and request-level validation.
- Rate-limit endpoints and protect auth routes.
- Use helmet and CORS with a strict origin whitelist.

## API (curl templates)

Replace `{HOST}:{PORT}` and IDs/tokens before running. Add `-H "Authorization: Bearer <token>"` if endpoints require auth.

### Health

```bash
curl -i http://{HOST}:{PORT}/health
```

### Users (/api/users)

```bash
curl -i http://{HOST}:{PORT}/api/users
curl -i -X POST http://{HOST}:{PORT}/api/users -H "Content-Type: application/json" -d '{"email":"alice@example.com","name":"Alice"}'
curl -i http://{HOST}:{PORT}/api/users/{userId}
curl -i -X PUT http://{HOST}:{PORT}/api/users/{userId} -H "Content-Type: application/json" -d '{"name":"Alice Updated"}'
curl -i -X DELETE http://{HOST}:{PORT}/api/users/{userId}
```

### Jobs (/api/jobs)

```bash
curl -i http://{HOST}:{PORT}/api/jobs
curl -i -X POST http://{HOST}:{PORT}/api/jobs -H "Content-Type: application/json" -d '{"title":"Logo design","description":"Design a logo","budget":200}'
curl -i http://{HOST}:{PORT}/api/jobs/{jobId}
curl -i -X PUT http://{HOST}:{PORT}/api/jobs/{jobId} -H "Content-Type: application/json" -d '{"budget":250}'
curl -i -X DELETE http://{HOST}:{PORT}/api/jobs/{jobId}
```

### Submissions (/api/submissions)

```bash
curl -i http://{HOST}:{PORT}/api/submissions
curl -i -X POST http://{HOST}:{PORT}/api/submissions -H "Content-Type: application/json" -d '{"jobId":"{jobId}","userId":"{userId}","proposal":"My proposal","price":150}'
curl -i http://{HOST}:{PORT}/api/submissions/{submissionId}
curl -i -X PUT http://{HOST}:{PORT}/api/submissions/{submissionId} -H "Content-Type: application/json" -d '{"status":"accepted"}'
curl -i -X DELETE http://{HOST}:{PORT}/api/submissions/{submissionId}
```

### Escrows (/api/escrows)

```bash
curl -i http://{HOST}:{PORT}/api/escrows
curl -i -X POST http://{HOST}:{PORT}/api/escrows -H "Content-Type: application/json" -d '{"amount":500,"buyer":"{buyerId}","seller":"{sellerId}","jobId":"{jobId}"}'
curl -i http://{HOST}:{PORT}/api/escrows/{escrowId}
curl -i -X PUT http://{HOST}:{PORT}/api/escrows/{escrowId} -H "Content-Type: application/json" -d '{"status":"RELEASED"}'
curl -i -X DELETE http://{HOST}:{PORT}/api/escrows/{escrowId}
```

### Transactions (/api/transactions)

```bash
curl -i http://{HOST}:{PORT}/api/transactions
curl -i -X POST http://{HOST}:{PORT}/api/transactions -H "Content-Type: application/json" -d '{"escrowId":"{escrowId}","amount":500,"type":"release"}'
curl -i http://{HOST}:{PORT}/api/transactions/{transactionId}
curl -i -X PUT http://{HOST}:{PORT}/api/transactions/{transactionId} -H "Content-Type: application/json" -d '{"status":"completed"}'
curl -i -X DELETE http://{HOST}:{PORT}/api/transactions/{transactionId}
```

### Disputes (/api/disputes)

```bash
curl -i http://{HOST}:{PORT}/api/disputes
curl -i -X POST http://{HOST}:{PORT}/api/disputes -H "Content-Type: application/json" -d '{"escrowId":"{escrowId}","raisedBy":"{userId}","reason":"issue description"}'
curl -i http://{HOST}:{PORT}/api/disputes/{disputeId}
curl -i -X PUT http://{HOST}:{PORT}/api/disputes/{disputeId} -H "Content-Type: application/json" -d '{"resolution":"refund","status":"resolved"}'
curl -i -X DELETE http://{HOST}:{PORT}/api/disputes/{disputeId}
```

## Operational runbook / troubleshooting

- App won't start: check NODE_ENV, missing env vars, and port conflicts.
- DB connection errors: validate MONGODB_URI and ensure network/credentials are correct.
- Model/schema issues after change: restart server and clear compiled artifacts (dist).
- To silence dev-run headers: use `npx ts-node-dev ...` or run npm script through a shell filter.

## CI/CD notes

- Run lint, tests, and build in CI.
- Build artifacts should be the compiled dist/ directory.
- Use environment-specific config and zero-downtime deploys.

## Contributing

- Follow ESLint and Prettier rules.
- Add tests for new features (Jest + Supertest).
- Use feature branches and open PRs with descriptions.

## Contact & support

- Owner / Team: Project maintainer
- Email: bhandaridheere@gmail.com