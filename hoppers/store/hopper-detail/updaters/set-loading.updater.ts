import { PartialStateUpdater } from "@ngrx/signals";
import { DetailHopperEntriesSlice } from "../detail-hopper.slice";

export function setLoadingUpdater(
    isLoading: boolean
): PartialStateUpdater<DetailHopperEntriesSlice> {
    return (_)=>{
        return {
            isLoading
        }
    }
}