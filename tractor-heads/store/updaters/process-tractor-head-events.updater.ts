import { PartialStateUpdater } from '@ngrx/signals';
import { TractorHeadsSlice } from '../tractor-heads.slice';
import { TractorHead } from '../../models/tractor-head';
import { EventTypes, SseEvent } from '@shared/services/sse/sseEvent';

// Similar a process-truck-entry-events.updater.ts
function applyTractorHeadEvent(
    map: Map<string, TractorHead>,
    event: SseEvent<TractorHead>
): void {
    const { data: tractorHead, action } = event;

    switch (action) {
        case EventTypes.CREATION:
        case EventTypes.LOAD:
        case EventTypes.UPDATE:
            map.set(tractorHead.tractorHeadPlate, tractorHead);
            break;
        case EventTypes.DELETE:
            map.delete(tractorHead.tractorHeadPlate);
            break;
        default:
            console.error(`Unhandled event type: "${action}" in applyTractorHeadEvent.`);
    }
}

export function processTractorHeadEventsUpdater(
    events: Array<SseEvent<TractorHead>>
): PartialStateUpdater<TractorHeadsSlice> {
    return (state) => {
        const updatedTractorHeads = new Map(state._tractorHeads);

        for (const event of events) {
            applyTractorHeadEvent(updatedTractorHeads, event);
        }

        return {
            _tractorHeads: updatedTractorHeads,
        };
    };
}