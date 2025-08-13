import { PartialStateUpdater } from '@ngrx/signals';
import { HoppersSlice } from '../hoppers.slice';
import { Hopper } from '../../../models/hopper';

export function setLocationHoppersUpdater(
  hoppers: Array<Hopper>
): PartialStateUpdater<HoppersSlice> {
  return (_) => {
    return {
      hoppers,
    };
  };
}
