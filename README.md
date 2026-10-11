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
- `npm start` run the service
