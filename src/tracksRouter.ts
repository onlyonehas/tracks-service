import { Router } from 'express';

import type { TrackStorage } from './trackStorage.js';
import type { Track } from './types.js';

export function createTracksRouter(storage: TrackStorage): Router {
  const router = Router();

  router.post('/', (req, res) => {
    const track = req.body as Track;

    storage.add(track);

    res.location(`/tracks/${track.id}`).status(201).json(track);
  });

  return router;
}
