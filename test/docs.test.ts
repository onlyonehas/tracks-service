import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../src/app.js';
import { MemoryTrackStorage } from '../src/model/memoryTrackStorage.js';

describe('GET /openapi.json', () => {
  it('serves the OpenAPI document', async () => {
    const app = createApp(new MemoryTrackStorage());

    const response = await request(app).get('/openapi.json');

    expect(response.status).toBe(200);
    expect(response.body.info.title).toBe('Tracks API');
    expect(response.body.paths['/tracks']).toBeDefined();
    expect(response.body.paths['/tracks/{id}']).toBeDefined();
  });
});

describe('GET /docs', () => {
  it('serves the Swagger UI', async () => {
    const app = createApp(new MemoryTrackStorage());

    const response = await request(app).get('/docs/');

    expect(response.status).toBe(200);
    expect(response.type).toBe('text/html');
  });
});
