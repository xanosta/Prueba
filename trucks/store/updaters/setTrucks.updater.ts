import { PartialStateUpdater } from '@ngrx/signals';
import { TrucksEntriesSlice } from '../truck-entries.slice';
import { Truck } from '../../models/truck';

export function setTrucksUpdater(
  trucks: Array<Truck>
): PartialStateUpdater<TrucksEntriesSlice> {
  return (_) => {
    const result = trucks.reduce((acc, truckEntry) => {
      acc.set(truckEntry.residueEntryId, truckEntry);
      return acc;
    }, new Map<number, Truck>());

    return {
      _trucks: result,
    };
  };
}
