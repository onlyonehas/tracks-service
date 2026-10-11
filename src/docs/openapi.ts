export const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'Tracks API',
    version: '1.0.0',
    description: "A small RESTful JSON API for managing 'track' objects.",
  },
  servers: [{ url: 'http://localhost:3000' }],
  paths: {
    '/tracks': {
      get: {
        summary: 'List tracks',
        responses: {
          '200': {
            description: 'The stored tracks',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['tracks'],
                  properties: {
                    tracks: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Track' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Add a track',
        description: 'Adds a track. Posting the same id again updates it.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Track' },
            },
          },
        },
        responses: {
          '201': {
            description: 'The stored track',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Track' },
              },
            },
          },
          '400': {
            description: 'Invalid request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/tracks/{id}': {
      get: {
        summary: 'Fetch a track by id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'The track',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Track' },
              },
            },
          },
          '404': {
            description: 'No track matches the id',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Track: {
        type: 'object',
        required: ['type', 'id', 'urn', 'titles'],
        properties: {
          type: { type: 'string', enum: ['track'] },
          id: { type: 'string', example: 'nznx3r' },
          urn: { type: 'string', example: 'urn:bbc:sounds:track:nznx3r' },
          titles: { $ref: '#/components/schemas/TrackTitles' },
          availability: { $ref: '#/components/schemas/TrackAvailability' },
        },
      },
      TrackTitles: {
        type: 'object',
        required: ['primary'],
        properties: {
          primary: { type: 'string', example: 'AC/DC' },
          secondary: { type: 'string', example: 'Highway to Hell' },
          tertiary: { type: 'string', nullable: true },
        },
      },
      TrackAvailability: {
        type: 'object',
        description: 'from must be earlier than to.',
        required: ['from', 'to', 'label'],
        properties: {
          from: {
            type: 'string',
            pattern: '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$',
            example: '2019-02-13T11:03:05Z',
          },
          to: {
            type: 'string',
            pattern: '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$',
            example: '2019-03-15T11:00:00Z',
          },
          label: { type: 'string', example: 'Available for 29 days' },
        },
      },
      Error: {
        type: 'object',
        required: ['error'],
        properties: {
          error: { type: 'string' },
        },
      },
    },
  },
};
