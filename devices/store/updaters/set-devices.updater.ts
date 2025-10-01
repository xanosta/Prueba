import { PartialStateUpdater } from '@ngrx/signals';
import { DevicesSlice } from '../devices.slice';
import { Location } from '../../models/device.model';

export function setDevicesUpdater(locations: Location[]): PartialStateUpdater<DevicesSlice> {
  return () => ({
    _locations: locations,
  });
}
