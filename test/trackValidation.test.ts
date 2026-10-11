import { describe, expect, it } from 'vitest';

import type { Track } from '../src/types/track.js';
import { validateTrack } from '../src/validation/trackValidation.js';
import highwayToHellJson from './fixtures/highway-to-hell.json' with {
  type: 'json',
};

const highwayToHell = highwayToHellJson as unknown as Track;

const from = '2019-02-13T11:03:05Z';
const to = '2019-03-15T11:00:00Z';

const invalidCases: Array<[string, Record<string, unknown>, string]> = [
  [
    'without a valid type',
    { ...highwayToHell, type: 'album' },
    'A track must have a valid type',
  ],
  [
    'without a valid id',
    { ...highwayToHell, id: '' },
    'A track must have a valid id',
  ],
  [
    'without a valid urn',
    { ...highwayToHell, urn: '' },
    'A track must have a valid urn',
  ],
  [
    'without a primary title',
    { ...highwayToHell, titles: {} },
    'A track must have a valid titles.primary',
  ],
  [
    'with an availability that is not an object',
    { ...highwayToHell, availability: 'soon' },
    'A track must have a valid availability',
  ],
  [
    'without an availability.from',
    { ...highwayToHell, availability: { to, label: 'Available for 29 days' } },
    'A track must have a valid availability.from',
  ],
  [
    'with an availability.from that is not a UTC timestamp',
    {
      ...highwayToHell,
      availability: { from: '2019-02-13', to, label: 'Available for 29 days' },
    },
    'A track must have a valid availability.from',
  ],
  [
    'without an availability.to',
    {
      ...highwayToHell,
      availability: { from, label: 'Available for 29 days' },
    },
    'A track must have a valid availability.to',
  ],
  [
    'with an availability.to that is not a UTC timestamp',
    {
      ...highwayToHell,
      availability: {
        from,
        to: '2019-03-15T11:00:00.000Z',
        label: 'Available for 29 days',
      },
    },
    'A track must have a valid availability.to',
  ],
  [
    'without an availability.label',
    { ...highwayToHell, availability: { from, to } },
    'A track must have a valid availability.label',
  ],
  [
    'with an availability.from that is not before to',
    {
      ...highwayToHell,
      availability: { from: to, to: from, label: 'Available for 29 days' },
    },
    'A track must have availability.from before availability.to',
  ],
];

describe('validateTrack', () => {
  it('accepts a valid track', () => {
    expect(validateTrack(highwayToHell)).toEqual({
      ok: true,
      track: highwayToHell,
    });
  });

  it('accepts a track without availability', () => {
    const { availability: _availability, ...withoutAvailability } =
      highwayToHell;

    expect(validateTrack(withoutAvailability)).toEqual({
      ok: true,
      track: withoutAvailability,
    });
  });

  it('accepts a track with only the primary title', () => {
    const track = { ...highwayToHell, titles: { primary: 'AC/DC' } };

    expect(validateTrack(track)).toEqual({ ok: true, track });
  });

  it('ignores unknown fields', () => {
    expect(validateTrack({ ...highwayToHell, extra: 'ignored' })).toEqual({
      ok: true,
      track: highwayToHell,
    });
  });

  it('rejects a body that is not an object', () => {
    expect(validateTrack('not an object')).toEqual({
      ok: false,
      error: 'A track must be a JSON object',
    });
  });

  it.each(invalidCases)('rejects a track %s', (_description, body, error) => {
    expect(validateTrack(body)).toEqual({ ok: false, error });
  });
});
