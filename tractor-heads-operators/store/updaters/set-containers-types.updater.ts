import { PartialStateUpdater } from '@ngrx/signals';
import { TractorHeadOperatorConfigSlice } from '../tractor-head-operator-config.slice';
import { ContainerType } from '../../features/containers/models/container-type.model';

export function setContainerTypes(
  types: Array<ContainerType>
): PartialStateUpdater<TractorHeadOperatorConfigSlice> {
  return (store) => {
    return {
      _containerTypes: types,
    };
  };
}
