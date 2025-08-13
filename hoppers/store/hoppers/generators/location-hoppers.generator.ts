import { Hopper } from '../../../models/hopper';
import { HopperViewModel } from '../../../view-models/hopper.view-model';

export function locationHopperGenerator(
  hoppers: Array<Hopper>
): Array<HopperViewModel> {
  return hoppers.map((h) => fromModelToViewModel(h));

  function fromModelToViewModel(hopper: Hopper): HopperViewModel {
    return {
      id: hopper.hopperId,
      name: hopper.name,
    };
  }
}
