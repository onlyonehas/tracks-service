# AGENTS.md

Project conventions for contributors and coding agents.

## Commands

- `npm run dev` run the service with reload
- `npm test` run the tests
- `npm run build` type check the project
- `npm run lint` check formatting and lint rules
- `npm run lint:fix` fix formatting and lint issues
- `npm run format` format the source
- `npm run audit` check dependencies for critical vulnerabilities
- `npm start` run the service

## Stack

- Node.js 24 (see `.node-version` and `.nvmrc`)
- TypeScript 7, the native compiler. It does not expose a JavaScript
  compiler API, so tools that need one (typescript-eslint, ts-jest) do not work.
  Use Biome for lint and format, and Vitest for tests.
- Express 5, ESM with `nodenext`.

## Layout

- `src/app.ts` builds the Express app
- `src/server.ts` starts it
- `src/routes/` HTTP routes
- `src/model/` the data layer (`TrackStorage` and `MemoryTrackStorage`)
- `src/models/` domain types
- `src/validation/` request validation
- `src/docs/` the OpenAPI document
- `test/` tests, with shared payloads in `test/fixtures`

## Conventions

- ESM only. Relative imports need a `.js` extension.
- Keep functions small and focused, and follow DRY.
- Keep dependencies minimal.
- Write prose in UK English.
- Do not add code comments unless asked.
- Use conventional commit messages (`feat`, `fix`, `docs`, `chore`, `ci`,
  `test`).

## Testing

- Write the failing test first, then the code.
- Name tests after the requirement they cover.
- Test the API at its boundary, and share fixtures rather than repeating
  payloads.
