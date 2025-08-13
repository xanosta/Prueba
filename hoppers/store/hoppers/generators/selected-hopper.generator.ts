import { Hopper } from '../../../models/hopper';
import { HopperViewModel } from '../../../view-models/hopper.view-model';

export function selectedHopperGenerator(
  locationsHopper: Array<Hopper>,
  selectedHopperId: number | undefined
): HopperViewModel | undefined {
  if (!selectedHopperId) return;

  const selectedHopper = locationsHopper.find(
    ({ hopperId }) => hopperId === selectedHopperId
  );

  if (!selectedHopper) return;

  return mapToViewModel(selectedHopper);

  function mapToViewModel(hopper: Hopper): HopperViewModel {
    return {
      id: hopper.hopperId,
      name: hopper.name,
    };
  }
}
