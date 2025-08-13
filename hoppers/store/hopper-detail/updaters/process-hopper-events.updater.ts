import { EventTypes, SseEvent } from "@shared/services/sse/sseEvent";
import { HopperEvent } from "../../../models/hopper-event";
import { PartialStateUpdater } from "@ngrx/signals";
import { DetailHopperEntriesSlice } from "../detail-hopper.slice";

function applyHopperEvent(
  map: Map<number, HopperEvent>,
  event: SseEvent<HopperEvent>
): void {
  const { data: hopperEvent, action } = event;

  switch (action) {
    case EventTypes.CREATION:
    case EventTypes.LOAD:
    case EventTypes.UPDATE:
      map.set(hopperEvent.containerCompact.id, hopperEvent);
      break;
    case EventTypes.DELETE:
      map.delete(hopperEvent.containerCompact.id);
      break;
    default:
      console.error(`Unhandled event type: "${action}" in applyHopperEvent.`);
  }
}

export function processHoppersEventsUpdater(
  hopperEvents: Array<SseEvent<HopperEvent>>
): PartialStateUpdater<DetailHopperEntriesSlice> {
  return (store) => {
    const updatedHopper = new Map(store._hopperEvents);

    for (const event of hopperEvents) {
      applyHopperEvent(updatedHopper, event);
    }

    return {
      _hopperEvents: updatedHopper,
    };
  };
}
