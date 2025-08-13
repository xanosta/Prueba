import { PartialStateUpdater } from "@ngrx/signals"
import { DetailHopperEntriesSlice } from "../detail-hopper.slice"

export function setSelectedHopperIdUpdater(
    hopperId: number
): PartialStateUpdater<DetailHopperEntriesSlice>{
    return (_)=>{
        return {
            _selectedHopperId: hopperId
        }
    }
}