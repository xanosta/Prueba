import { PartialStateUpdater } from '@ngrx/signals';

import { Location } from '@features/locations/models/location';
import { TractorHeadOperatorConfigSlice } from '../tractor-head-operator-config.slice';

export function setLocationsUpdater(
  locations: Array<Location>
): PartialStateUpdater<TractorHeadOperatorConfigSlice> {
  return (_) => {
    return {
      locations: locations,
    };
  };
}
