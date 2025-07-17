import { PartialStateUpdater } from '@ngrx/signals';
import { DomiciliaryTrucksSlice } from '../domiciliary-trucks.slice';
import { Truck } from '../../models/truck';

export function resetTruckListUpdater(): PartialStateUpdater<DomiciliaryTrucksSlice> {
  return (_) => {
    return {
      _trucks: new Map<number, Truck>(),
    };
  };
}
