import express, { Express } from 'express';
import { TrackRepository } from './repositories/TrackRepository';
import { createTrackRouter } from './routes/tracks';

export function createApp(repository: TrackRepository): Express {
  const app = express();

  app.use('/tracks', createTrackRouter(repository));

  return app;
}
