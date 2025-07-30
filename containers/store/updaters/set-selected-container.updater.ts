import { PartialStateUpdater } from '@ngrx/signals';
import { ContainerDetail } from '../../models/container-detail.model';
import { ContainersSlice } from '../containers.slice';

export function setSelectedContainerUpdater(
  container: ContainerDetail
): PartialStateUpdater<ContainersSlice> {
  return (_) => {
    return {
      _selectedContainer: container,
    };
  };
}
