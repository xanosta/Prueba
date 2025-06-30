import { PartialStateUpdater } from '@ngrx/signals';
import { TrucksEntriesSlice } from '../truck-entries.slice';
import { Truck } from '../../models/truck';

export function resetTruckListUpdater(): PartialStateUpdater<TrucksEntriesSlice> {
  return (_) => {
    return {
      _trucks: new Map<number, Truck>(),
    };
  };
}
