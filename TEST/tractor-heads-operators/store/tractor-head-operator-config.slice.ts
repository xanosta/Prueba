import { Location } from '@features/locations/models/location';
import { TractorHead } from '../features/tractor-heads/models/tractor-head.model';
import { ContainerType } from '../features/containers/models/container-type.model';

export interface TractorHeadOperatorConfigSlice {
  locations: Array<Location>;
  tractorHeads: Array<TractorHead>;
  _containerTypes: Array<ContainerType>;
  isBusy: boolean;
}

export const tractorHeadOperatorsConfigInitialValue: TractorHeadOperatorConfigSlice =
  {
    locations: [],
    tractorHeads: [],
    _containerTypes: [],
    isBusy: false,
  };
