import { PartialStateUpdater } from '@ngrx/signals';
import { ContainersSlice } from '../containers.slice';

export function disconnectFromSseUpdater(): PartialStateUpdater<ContainersSlice> {
    return (store) => {
        if (store._sseSubscription) {
            store._sseSubscription.unsubscribe();
        }
        return {
            _sseSubscription: undefined,
        };
    };
}