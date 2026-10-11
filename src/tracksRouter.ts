import { Router } from 'express';

import type { TrackStorage } from './trackStorage.js';
import type { Track } from './types.js';

export function createTracksRouter(storage: TrackStorage): Router {
  const router = Router();

  router.post('/', (req, res) => {
    const track = req.body as Partial<Track>;

    if (typeof track?.id !== 'string' || track.id.trim() === '') {
      res.status(400).json({ error: 'A track must have a valid id' });
      return;
    }

    storage.add(track as Track);

    res.location(`/tracks/${track.id}`).status(201).json(track);
  });

  return router;
}
