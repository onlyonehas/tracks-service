import { Track } from '../types';

export interface TrackRepository {
  findById(id: string): Track | undefined;
}
