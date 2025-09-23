import { PartialStateUpdater } from '@ngrx/signals';
import { DevicesSlice } from '../devices.slice';
import { Hopper } from '../../models/device.model';

export function setSelectedHopperUpdater(hopper: Hopper | null): PartialStateUpdater<DevicesSlice> {
  return () => ({
    selectedHopper: hopper,
  });
}
