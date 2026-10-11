import { describe, expect, it } from 'vitest';

import { validateTrack } from '../src/trackValidation.js';
import type { Track } from '../src/types.js';

const sampleTrack: Track = {
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

describe('validateTrack', () => {
  it('accepts the sample track', () => {
    expect(validateTrack(sampleTrack)).toEqual({ ok: true, track: sampleTrack });
  });

  it('accepts a track with only the primary title', () => {
    const track = { ...sampleTrack, titles: { primary: 'AC/DC' } };

    expect(validateTrack(track)).toEqual({ ok: true, track });
  });

  it('ignores unknown fields', () => {
    const result = validateTrack({ ...sampleTrack, extra: 'ignored' });

    expect(result).toEqual({ ok: true, track: sampleTrack });
  });

  const invalidCases: Array<[string, unknown, string]> = [
    ['a non-object body', 'not an object', 'A track must be a JSON object'],
    ['a wrong type', { ...sampleTrack, type: 'album' }, 'A track must have a valid type'],
    ['a missing id', { ...sampleTrack, id: undefined }, 'A track must have a valid id'],
    ['an empty id', { ...sampleTrack, id: '   ' }, 'A track must have a valid id'],
    ['a missing urn', { ...sampleTrack, urn: undefined }, 'A track must have a valid urn'],
    [
      'missing titles',
      { ...sampleTrack, titles: undefined },
      'A track must have a valid titles.primary',
    ],
    [
      'a missing primary title',
      { ...sampleTrack, titles: { secondary: 'Highway to Hell' } },
      'A track must have a valid titles.primary',
    ],
    [
      'missing availability',
      { ...sampleTrack, availability: undefined },
      'A track must have a valid availability',
    ],
    [
      'a missing availability.from',
      { ...sampleTrack, availability: { to: 'to', label: 'label' } },
      'A track must have a valid availability.from',
    ],
    [
      'a missing availability.to',
      { ...sampleTrack, availability: { from: 'from', label: 'label' } },
      'A track must have a valid availability.to',
    ],
    [
      'a missing availability.label',
      { ...sampleTrack, availability: { from: 'from', to: 'to' } },
      'A track must have a valid availability.label',
    ],
  ];

  it.each(invalidCases)('rejects %s', (_description, body, error) => {
    expect(validateTrack(body)).toEqual({ ok: false, error });
  });
});
