import { Subscription } from "rxjs";
import { HopperEvent } from "../../models/hopper-event";

export interface HopperEventsFilters {
    from?: string;
    to?: string;
}

export interface DetailHopperEntriesSlice {
    _hopperEvents: Map<number, HopperEvent>;
    _eventsSubscription: Subscription | null;
    _selectedHopperId: number | undefined;
    _filters: HopperEventsFilters;
    isLoading: boolean
}

export const detailHopperEntriesSliceInitialValue: DetailHopperEntriesSlice = {
    _hopperEvents: new Map(),
    _eventsSubscription: null,
    _selectedHopperId: undefined,
    _filters: {
        from: undefined,
        to: undefined
    },
    isLoading: true
};
