import { Router } from 'express';
import { TrackRepository } from '../repositories/TrackRepository';

export function createTrackRouter(repository: TrackRepository): Router {
  const router = Router();

  router.get('/:id', (req, res) => {
    const track = repository.findById(req.params.id);
    res.json(track);
  });

  return router;
}
