import type { Track, TrackAvailability, TrackTitles } from '../types/track.js';

export type ValidationResult =
  | { ok: true; track: Track }
  | { ok: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

function buildTitles(source: Record<string, unknown>): TrackTitles {
  const titles: TrackTitles = { primary: source.primary as string };

  if (typeof source.secondary === 'string') {
    titles.secondary = source.secondary;
  }

  if (source.tertiary === null || typeof source.tertiary === 'string') {
    titles.tertiary = source.tertiary;
  }

  return titles;
}

export function validateTrack(input: unknown): ValidationResult {
  if (!isRecord(input)) {
    return { ok: false, error: 'A track must be a JSON object' };
  }

  if (input.type !== 'track') {
    return { ok: false, error: 'A track must have a valid type' };
  }

  if (!isNonEmptyString(input.id)) {
    return { ok: false, error: 'A track must have a valid id' };
  }

  if (!isNonEmptyString(input.urn)) {
    return { ok: false, error: 'A track must have a valid urn' };
  }

  if (!isRecord(input.titles) || !isNonEmptyString(input.titles.primary)) {
    return { ok: false, error: 'A track must have a valid titles.primary' };
  }

  let availability: TrackAvailability | undefined;

  if (input.availability !== undefined) {
    if (!isRecord(input.availability)) {
      return { ok: false, error: 'A track must have a valid availability' };
    }

    if (!isNonEmptyString(input.availability.from)) {
      return {
        ok: false,
        error: 'A track must have a valid availability.from',
      };
    }

    if (!isNonEmptyString(input.availability.to)) {
      return { ok: false, error: 'A track must have a valid availability.to' };
    }

    if (!isNonEmptyString(input.availability.label)) {
      return {
        ok: false,
        error: 'A track must have a valid availability.label',
      };
    }

    availability = {
      from: input.availability.from,
      to: input.availability.to,
      label: input.availability.label,
    };
  }

  const track: Track = {
    type: 'track',
    id: input.id,
    urn: input.urn,
    titles: buildTitles(input.titles),
  };

  if (availability) {
    track.availability = availability;
  }

  return { ok: true, track };
}
