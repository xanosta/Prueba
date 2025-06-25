import { PartialStateUpdater } from '@ngrx/signals';
import { TrucksEntriesSlice } from '../truck-entries.slice';
import { Truck } from '../../models/truck';
import { EventTypes, SseEvent } from '@shared/services/sse/sseEvent';

function applyTruckEvent(
  map: Map<number, Truck>,
  event: SseEvent<Truck>
): void {
  const { data: truckEntry, action } = event;

  switch (action) {
    case EventTypes.CREATION:
    case EventTypes.LOAD:
    case EventTypes.UPDATE:
      map.set(truckEntry.residueEntryId, truckEntry);
      break;
    case EventTypes.DELETE:
      map.delete(truckEntry.residueEntryId);
      break;
    default:
      console.error(`Unhandled event type: "${action}" in applyTruckEvent.`);
  }
}

export function processTruckEntryEventsUpdater(
  truckEntries: Array<SseEvent<Truck>>
): PartialStateUpdater<TrucksEntriesSlice> {
  return (store) => {
    const updatedTrucks = new Map(store._trucks);

    for (const event of truckEntries) {
      applyTruckEvent(updatedTrucks, event);
    }

    return {
      _trucks: updatedTrucks,
    };
  };
}
