import express, { type Express } from 'express';

import { errorHandler, notFoundHandler } from './middleware/errors.js';
import { createTracksRouter } from './routes/tracks.js';
import type { TrackStorage } from './model/trackStorage.js';

export function createApp(storage: TrackStorage): Express {
  const app = express();

  app.use(express.json());
  app.use('/tracks', createTracksRouter(storage));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
