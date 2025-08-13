import { PartialStateUpdater } from "@ngrx/signals";
import { DetailHopperEntriesSlice, HopperEventsFilters } from "../detail-hopper.slice";

export function setFiltersUpdater(
    filters: Partial<HopperEventsFilters>
): PartialStateUpdater<DetailHopperEntriesSlice>{
    return (store)=>{
        return {
            _filters: {
                ...store._filters,
                ...filters
            } 
        }
    }
}