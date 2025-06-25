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

// import { PartialStateUpdater } from '@ngrx/signals';
// import { TractorHeadsSlice } from '../tractor-heads.slice';
// import { TractorHead } from '../../models/tractor-head';

// // La función ahora recibe directamente un objeto TractorHead
// function applyTractorHeadEvent(
//     map: Map<string, TractorHead>,
//     tractorHead: TractorHead
// ): void {
//     // Creamos una clave única temporal combinando matrícula y fecha de llegada.
//     const uniqueKey = `${tractorHead.tractorHeadPlate}-${tractorHead.arrivalDatetime}`;
//     // Simplemente añadimos o actualizamos la entrada en el mapa.
//     map.set(uniqueKey, tractorHead);
// }

// export function processTractorHeadEventsUpdater(
//     // El tipo de `events` es `any` para manejar la respuesta real del backend.
//     events: Array<any>
// ): PartialStateUpdater<TractorHeadsSlice> {
//     return (state) => {
//         const updatedTractorHeads = new Map(state._tractorHeads);

//         // El servicio SSE puede enviar un array de tractoras por mensaje,
//         // y `bufferTime` en el store puede agruparlos en otro array.
//         // El método `flat()` asegura que tengamos una única lista de eventos para procesar.
//         const flattenedEvents: Array<TractorHead> = events.flat();

//         for (const tractorHead of flattenedEvents) {
//             // Comprobamos que el objeto no sea nulo antes de procesarlo
//             if (tractorHead) {
//                 applyTractorHeadEvent(updatedTractorHeads, tractorHead);
//             }
//         }

//         return {
//             _tractorHeads: updatedTractorHeads,
//         };
//     };
// }