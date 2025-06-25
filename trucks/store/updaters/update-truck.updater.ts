import { PartialStateUpdater } from '@ngrx/signals';
import { TrucksEntriesSlice } from '../truck-entries.slice';
import { Truck } from '../../models/truck';

export function updateTruckUpdater(
  truckEntryId: number,
  newValues: Truck
): PartialStateUpdater<TrucksEntriesSlice> {
  return (store) => {
    const trucks = new Map(store._trucks);

    trucks.set(truckEntryId, newValues);

    return {
      _trucks: trucks,
    };
  };
}
