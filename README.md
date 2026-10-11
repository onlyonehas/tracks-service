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

## Scripts

- `npm run dev` start the service with reload
- `npm test` run the tests
- `npm run typecheck` type check the project
- `npm run build` compile to `dist`
- `npm start` run the compiled service
