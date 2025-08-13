import { PartialStateUpdater } from "@ngrx/signals";
import { Subscription } from "rxjs";
import { DetailHopperEntriesSlice } from "../detail-hopper.slice";

export function subscribeToEventsUpdater(
  eventsSubscription: Subscription
): PartialStateUpdater<DetailHopperEntriesSlice> {
  return (store) => {
    if (store._eventsSubscription) return {};

    return {
      _eventsSubscription: eventsSubscription
    };
  };
}
