import type { Track } from '../types/track.js';

export interface TrackStorage {
  add(track: Track): void;
  findById(id: string): Track | undefined;
  findAll(): Track[];
}
