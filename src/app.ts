import express, {
  type ErrorRequestHandler,
  type Express,
  type RequestHandler,
} from 'express';

import type { TrackStorage } from './trackStorage.js';
import { createTracksRouter } from './tracksRouter.js';

function isJsonParseError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as { type?: unknown }).type === 'entity.parse.failed'
  );
}

export function createApp(storage: TrackStorage): Express {
  const app = express();

  app.use(express.json());
  app.use('/tracks', createTracksRouter(storage));

  const notFound: RequestHandler = (_req, res) => {
    res.status(404).json({ error: 'Not found' });
  };
  app.use(notFound);

  const handleError: ErrorRequestHandler = (error, _req, res, _next) => {
    if (isJsonParseError(error)) {
      res.status(400).json({ error: 'Invalid JSON body' });
      return;
    }

    res.status(500).json({ error: 'Internal server error' });
  };
  app.use(handleError);

  return app;
}
