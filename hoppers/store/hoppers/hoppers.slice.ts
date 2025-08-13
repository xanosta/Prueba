import { Hopper } from '../../models/hopper';

export interface HoppersSlice {
  readonly hoppers: Array<Hopper>;
}

export const hoppersSliceInitialValue: HoppersSlice = {
  hoppers: [],
};
