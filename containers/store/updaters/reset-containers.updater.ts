import { PartialStateUpdater } from '@ngrx/signals';
import { ContainersSlice } from '../containers.slice';

export function resetContainersUpdater(): PartialStateUpdater<ContainersSlice> {
  return (store) => {
    return {
      _containers: new Map(),
    };
  };
}
