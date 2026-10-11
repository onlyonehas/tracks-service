# Tracks Service

A small RESTful JSON API for managing 'track' objects. Tracks are held in
memory only, so nothing is persisted.

## Requirements

- Node.js 24 (see `.node-version`)

## Getting started

```sh
npm install
npm run dev
```

The service listens on <http://localhost:3000>, which can be overridden with the
`PORT` environment variable.

## API

The API is JSON over HTTP.

| Method | Path          | Description                                            |
| ------ | ------------- | ------------------------------------------------------ |
| POST   | `/tracks`     | Add a track, or update it when the id already exists   |
| GET    | `/tracks/:id` | Fetch a track by id                                    |
| GET    | `/tracks`     | List tracks                                            |

See [docs/API.md](docs/API.md) for request and response details.

## Design

- Tracks are held in memory, so nothing is persisted.
- The data layer sits behind the `TrackStorage` interface.
- A persistent implementation, such as a database or another service, can
  replace `MemoryTrackStorage` without changing the routes.

## Scripts

- `npm run dev` start the service with reload
- `npm test` run the tests
- `npm run build` type check the project
- `npm run lint` check formatting and lint rules with Biome
- `npm run lint:fix` fix formatting and lint issues
- `npm start` run the service

## Future work / production considerations

This is a small in-memory service, so plenty would need doing before running it
for real. Briefly:

- **Config** – move settings like the port into a validated `.env` file rather
  than reading `process.env` directly, with sensible defaults per environment.
- **CI/CD** – add a pipeline (GitHub Actions) that runs lint, build and tests on
  every push, then deploys automatically once merged.
- **Deployment** – the app is stateless, so it would suit something serverless
  like AWS Lambda behind API Gateway. Local testing could use a tool such as
  SAM or LocalStack to run that setup on a laptop.
- **Scaling** – in-memory storage only works for a single instance. Any real
  deployment needs a shared backing store (e.g. DynamoDB or Postgres) behind the
  existing `TrackStorage` interface so multiple instances see the same data.
- **Caching** – popular reads (e.g. `GET /tracks/:id`) could be cached at the
  edge or in front of the database to cut latency and load.
- **Observability** – add structured logging, error tracking (e.g. Sentry) and
  health/metrics endpoints so problems are visible in production.
- **Security** – require API keys or tokens for access, put the service behind
  TLS, and add rate limiting to protect against abuse.
