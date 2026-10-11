import { describe, expect, it } from 'vitest';

import { MemoryTrackStorage } from '../src/memoryTrackStorage.js';
import type { Track } from '../src/types.js';

const highwayToHell: Track = {
  type: 'track',
  id: 'nznx3r',
  urn: 'urn:bbc:sounds:track:nznx3r',
  titles: { primary: 'AC/DC', secondary: 'Highway to Hell', tertiary: null },
  availability: {
    from: '2019-02-13T11:03:05Z',
    to: '2019-03-15T11:00:00Z',
    label: 'Available for 29 days',
  },
};

describe('MemoryTrackStorage', () => {
  it('returns undefined for an unknown id', () => {
    const storage = new MemoryTrackStorage();

    expect(storage.findById('missing')).toBeUndefined();
  });

  it('stores a track and finds it by id', () => {
    const storage = new MemoryTrackStorage();

    storage.add(highwayToHell);

    expect(storage.findById('nznx3r')).toEqual(highwayToHell);
  });

  it('replaces a track when the same id is added again', () => {
    const storage = new MemoryTrackStorage();
    storage.add(highwayToHell);
    const updated: Track = {
      ...highwayToHell,
      availability: { ...highwayToHell.availability, label: 'Available for 1 day' },
    };

    storage.add(updated);

    expect(storage.findById('nznx3r')).toEqual(updated);
  });

  it('lists every stored track', () => {
    const storage = new MemoryTrackStorage();
    storage.add(highwayToHell);

    expect(storage.findAll()).toEqual([highwayToHell]);
  });
});
