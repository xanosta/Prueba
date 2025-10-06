import { PartialStateUpdater } from '@ngrx/signals';
import { DevicesSlice } from '../devices.slice';
import { Location, Zone } from '../../models/device.model';

export function addZoneUpdater(newZone: Zone): PartialStateUpdater<DevicesSlice> {
  return store => {
    const locations = store._locations.map(location => {
      if (location.id === newZone.locationId) {
        return {
          ...location,
          zones: [...location.zones, newZone],
        };
      }
      return location;
    });

    return {
      _locations: locations as Location[],
    };
  };
}
