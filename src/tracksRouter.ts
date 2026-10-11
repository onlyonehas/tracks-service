import { Router } from 'express';

import type { TrackStorage } from './trackStorage.js';
import { validateTrack } from './trackValidation.js';

export function createTracksRouter(storage: TrackStorage): Router {
  const router = Router();

  router.post('/', (req, res) => {
    const result = validateTrack(req.body);

    if (!result.ok) {
      res.status(400).json({ error: result.error });
      return;
    }

    storage.add(result.track);

    res.location(`/tracks/${result.track.id}`).status(201).json(result.track);
  });

  router.get('/', (_req, res) => {
    res.json({ tracks: storage.findAll() });
  });

  router.get('/:id', (req, res) => {
    const track = storage.findById(req.params.id);

    if (!track) {
      res.status(404).json({ error: 'Track not found' });
      return;
    }

    res.json(track);
  });

  return router;
}
