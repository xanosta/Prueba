import { PartialStateUpdater } from '@ngrx/signals';
import { LocationsSlice } from '../locations.slice';

export function setLocationUpdater(
  location: number
): PartialStateUpdater<LocationsSlice> {
  return (_) => {
    return {
      _selectedLocationId: location,
    };
  };
}
