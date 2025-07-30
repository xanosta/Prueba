import { PartialStateUpdater } from '@ngrx/signals';
import { ContainersSlice } from '../containers.slice';
import { SmallLocation } from '@features/locations/models/location';

export function setLocationsUpdater(
  suggestions: Array<SmallLocation>,
  others: Array<SmallLocation>
): PartialStateUpdater<ContainersSlice> {
  return (store) => {
    return {
      _locations: {
        suggested: suggestions,
        others: others,
      },
    };
  };
}
