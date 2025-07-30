import { PartialStateUpdater } from '@ngrx/signals';
import { ContainersSlice } from '../containers.slice';

export function selectContainerToSchedulePickUpContainer(
  containerId: number
): PartialStateUpdater<ContainersSlice> {
  return (store) => {
    return {
      _selectedContainer: store._containers.get(containerId),
    };
  };
}
