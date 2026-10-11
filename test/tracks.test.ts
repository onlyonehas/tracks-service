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

  it('rejects a track without a valid id', async () => {
    const app = createApp(new MemoryTrackStorage());
    const bodyWithoutId: Partial<Track> = {
      type: 'track',
      urn: highwayToHell.urn,
      titles: highwayToHell.titles,
      availability: highwayToHell.availability,
    };

    const response = await request(app).post('/tracks').send(bodyWithoutId);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'A track must have a valid id' });
  });

  it('rejects a track missing another required field', async () => {
    const app = createApp(new MemoryTrackStorage());
    const bodyWithoutUrn = {
      type: 'track',
      id: 'nznx3r',
      titles: { primary: 'AC/DC' },
      availability: {
        from: '2019-02-13T11:03:05Z',
        to: '2019-03-15T11:00:00Z',
        label: 'Available for 29 days',
      },
    };

    const response = await request(app).post('/tracks').send(bodyWithoutUrn);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'A track must have a valid urn' });
  });

  it('inserts or replaces a track with the same id', async () => {
    const app = createApp(new MemoryTrackStorage());
    await request(app).post('/tracks').send(highwayToHell);
    const updated = {
      ...highwayToHell,
      availability: { ...highwayToHell.availability, label: 'Available for 1 day' },
    };

    const secondResponse = await request(app).post('/tracks').send(updated);
    const found = await request(app).get('/tracks/nznx3r');

    expect(secondResponse.status).toBe(201);
    expect(found.body).toEqual(updated);
  });
});

describe('GET /tracks/:id returns a track by id', () => {
  it('returns the track that was added', async () => {
    const app = createApp(new MemoryTrackStorage());
    await request(app).post('/tracks').send(highwayToHell);

    const response = await request(app).get('/tracks/nznx3r');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(highwayToHell);
  });

  it('returns a meaningful response when no track matches the id', async () => {
    const app = createApp(new MemoryTrackStorage());

    const response = await request(app).get('/tracks/does-not-exist');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Track not found' });
  });
});

describe('GET /tracks lists tracks', () => {
  it('returns an empty list when no tracks have been added', async () => {
    const app = createApp(new MemoryTrackStorage());

    const response = await request(app).get('/tracks');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ tracks: [] });
  });

  it('returns every track that has been added', async () => {
    const app = createApp(new MemoryTrackStorage());
    await request(app).post('/tracks').send(highwayToHell);
    const another = {
      ...highwayToHell,
      id: 'abc123',
      urn: 'urn:bbc:sounds:track:abc123',
    };
    await request(app).post('/tracks').send(another);

    const response = await request(app).get('/tracks');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ tracks: [highwayToHell, another] });
  });
});

describe('the API handles bad requests', () => {
  it('returns a meaningful error for malformed JSON', async () => {
    const app = createApp(new MemoryTrackStorage());

    const response = await request(app)
      .post('/tracks')
      .set('Content-Type', 'application/json')
      .send('{"type":');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid JSON body' });
  });

  it('returns a meaningful error for an unknown route', async () => {
    const app = createApp(new MemoryTrackStorage());

    const response = await request(app).get('/not-a-route');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Not found' });
  });
});
