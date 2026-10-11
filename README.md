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

## Design

- Tracks are held in memory, so nothing is persisted.
- Storage sits behind the `TrackStorage` interface.
- A persistent implementation, such as a database or another service, can
  replace `MemoryTrackStorage` without changing the routes.

## Scripts

- `npm run dev` start the service with reload
- `npm test` run the tests
- `npm run build` type check the project
- `npm start` run the service
