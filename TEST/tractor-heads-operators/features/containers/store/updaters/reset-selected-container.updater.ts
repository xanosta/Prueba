import { PartialStateUpdater } from '@ngrx/signals';
import { ContainersSlice } from '../containers.slice';

export function resetSelectedContainerUpdater(): PartialStateUpdater<ContainersSlice> {
  return (store) => {
    return {
      _selectedContainer: null,
      _suggestedLocations: [],
    };
  };
}
