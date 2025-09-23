import { PartialStateUpdater } from '@ngrx/signals';
import { DevicesSlice } from '../devices.slice';
import { Device } from '../../models/device.model';

export function setSelectedDeviceUpdater(device: Device | null): PartialStateUpdater<DevicesSlice> {
  return () => ({
    selectedDeviceDetail: device,
  });
}
