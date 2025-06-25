import { PartialStateUpdater } from '@ngrx/signals';
import { TrucksEntriesSlice } from '../truck-entries.slice';

export function deleteTruckUpdater(
  truckEntryId: number
): PartialStateUpdater<TrucksEntriesSlice> {
  return (store) => {
    const resultingTrucks = new Map(store._trucks);

    resultingTrucks.delete(truckEntryId);

    return {
      _trucks: resultingTrucks,
    };
  };
}
