import { PartialStateUpdater } from '@ngrx/signals';
import { DevicesSlice } from '../devices.slice';
import { EntryArea } from '../../models/device.model';

export function setSelectedEntryAreaUpdater(
  entryArea: EntryArea | null
): PartialStateUpdater<DevicesSlice> {
  return () => ({
    selectedEntryArea: entryArea,
  });
}
