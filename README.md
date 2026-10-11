# Tracks Service

A small RESTful JSON API for managing 'track' objects.

Tracks are held in memory only — nothing is persisted.

## Running

```sh
npm install
npm run dev
```

The service listens on <http://localhost:3000> (override with the `PORT`
environment variable).

## Endpoints

- `GET /tracks/:id` — fetch a track by id.

## Tests

```sh
npm test
```
