import type { Track } from '../models/track.js';

export interface TrackStorage {
  add(track: Track): void;
  findById(id: string): Track | undefined;
  findAll(): Track[];
}
