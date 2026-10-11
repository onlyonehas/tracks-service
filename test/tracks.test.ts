import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../src/app.js';
import type { Track } from '../src/models/track.js';
import { MemoryTrackStorage } from '../src/storage/memoryTrackStorage.js';
import highwayToHellJson from './fixtures/highway-to-hell.json' with { type: 'json' };

const highwayToHell = highwayToHellJson as unknown as Track;

describe('POST /tracks adds a track', () => {
  it('returns 201 and stores the provided track', async () => {
    const app = createApp(new MemoryTrackStorage());

    const response = await request(app).post('/tracks').send(highwayToHell);

    expect(response.status).toBe(201);
    expect(response.headers.location).toBe('/tracks/nznx3r');
    expect(response.body).toEqual(highwayToHell);
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

  it('rejects a track without a valid id', async () => {
    const app = createApp(new MemoryTrackStorage());

    const response = await request(app)
      .post('/tracks')
      .send({ ...highwayToHell, id: '' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'A track must have a valid id' });
  });

  it('rejects a body whose type is not a track', async () => {
    const app = createApp(new MemoryTrackStorage());

    const response = await request(app)
      .post('/tracks')
      .send({ ...highwayToHell, type: 'album' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'A track must have a valid type' });
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
