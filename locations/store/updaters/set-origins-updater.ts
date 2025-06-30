import { PartialStateUpdater } from '@ngrx/signals';
import { SmallLocation } from '../../models/location';
import { LocationsSlice } from '../locations.slice';

export function SetOriginsUpdater(
  origins: Array<SmallLocation>
): PartialStateUpdater<LocationsSlice> {
  return (_) => {
    return {
      _origins: origins,
    };
  };
}
