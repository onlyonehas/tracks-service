import type { TrackStorage } from './trackStorage.js';
import type { Track } from './types.js';

export class MemoryTrackStorage implements TrackStorage {
  private readonly tracks = new Map<string, Track>();

  add(track: Track): void {
    this.tracks.set(track.id, track);
  }
}
