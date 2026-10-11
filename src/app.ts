import express, { type Express } from 'express';

import type { TrackStorage } from './trackStorage.js';
import { createTracksRouter } from './tracksRouter.js';

export function createApp(storage: TrackStorage): Express {
  const app = express();

  app.use(express.json());
  app.use('/tracks', createTracksRouter(storage));

  return app;
}
