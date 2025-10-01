import { PartialStateUpdater } from '@ngrx/signals';
import { DevicesSlice } from '../devices.slice';
import { Zone } from '../../models/device.model';

export function addZoneToLocationUpdater(
  locationId: number,
  zone: Zone
): PartialStateUpdater<DevicesSlice> {
  return state => ({
    _locations: state._locations.map(location =>
      location.id === locationId
        ? {
            ...location,
            zones: [...location.zones, zone],
          }
        : location
    ),
  });
}
