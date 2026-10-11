export interface TrackTitles {
  primary: string;
  secondary?: string;
  tertiary?: string | null;
}

export interface TrackAvailability {
  from: string;
  to: string;
  label: string;
}

export interface Track {
  type: 'track';
  id: string;
  urn: string;
  titles: TrackTitles;
  availability: TrackAvailability;
}
