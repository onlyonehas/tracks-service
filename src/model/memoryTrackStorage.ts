import type { Track } from '../types/track.js';
import type { TrackStorage } from './trackStorage.js';

export class MemoryTrackStorage implements TrackStorage {
  private readonly tracks = new Map<string, Track>();

  add(track: Track): void {
    this.tracks.set(track.id, track);
  }

  findById(id: string): Track | undefined {
    return this.tracks.get(id);
  }

  findAll(): Track[] {
    return [...this.tracks.values()];
  }
}
