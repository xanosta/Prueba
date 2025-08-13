import { HopperEvent } from "../../../models/hopper-event";
import { HopperEventViewModel } from "../../../view-models/hopper-event.view-model";

export function selectedHopperEventsGenerator(hopperEvents: Array<HopperEvent>): Array<HopperEventViewModel>{
    return hopperEvents;
}