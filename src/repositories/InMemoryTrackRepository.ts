import { Track } from '../types';
import { TrackRepository } from './TrackRepository';

const SEED_TRACK: Track = {
  type: 'track',
  id: 'nznx3r',
  urn: 'urn:bbc:sounds:track:nznx3r',
  titles: {
    primary: 'AC/DC',
    secondary: 'Highway to Hell',
    tertiary: null,
  },
  availability: {
    from: '2019-02-13T11:03:05Z',
    to: '2019-03-15T11:00:00Z',
    label: 'Available for 29 days',
  },
};

// With more time: replace the in-memory Map with a persistent store behind the
// same TrackRepository interface, without touching the routes.
export class InMemoryTrackRepository implements TrackRepository {
  private readonly tracks = new Map<string, Track>([[SEED_TRACK.id, SEED_TRACK]]);

  findById(id: string): Track | undefined {
    return this.tracks.get(id);
  }
}
