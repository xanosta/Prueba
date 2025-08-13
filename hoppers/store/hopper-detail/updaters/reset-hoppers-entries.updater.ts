import { PartialStateUpdater } from '@ngrx/signals';
import { DetailHopperEntriesSlice } from '../detail-hopper.slice';

export function resetHopperEntriesUpdater(): PartialStateUpdater<DetailHopperEntriesSlice> {
  return (_) => {
    return {
      _hopperEvents: new Map(),
    };
  };
}
