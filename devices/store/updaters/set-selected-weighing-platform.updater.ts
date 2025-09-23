import { PartialStateUpdater } from '@ngrx/signals';
import { DevicesSlice } from '../devices.slice';
import { WeighingPlatform } from '../../models/device.model';

export function setSelectedWeighingPlatformUpdater(
  weighingPlatform: WeighingPlatform | null
): PartialStateUpdater<DevicesSlice> {
  return () => ({
    selectedWeighingPlatform: weighingPlatform,
  });
}
