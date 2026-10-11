import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../src/app.js';
import { MemoryTrackStorage } from '../src/memoryTrackStorage.js';
import type { Track } from '../src/types.js';

const highwayToHell: Track = {
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

describe('POST /tracks adds a track', () => {
  it('returns 201 and stores the provided track', async () => {
    const app = createApp(new MemoryTrackStorage());

    const response = await request(app).post('/tracks').send(highwayToHell);

    expect(response.status).toBe(201);
    expect(response.headers.location).toBe('/tracks/nznx3r');
    expect(response.body).toEqual(highwayToHell);
  });
});
