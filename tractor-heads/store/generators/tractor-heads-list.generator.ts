import { TractorHead } from '../../models/tractor-head';
import { TractorHeadFilters } from '../../models/tractor-head-filters';
import { TractorHeadViewModel } from '../../view-models/tractor-head.view-model';


export function tractorHeadsListGenerator(
  tractorHeads: Array<TractorHead>,
): Array<TractorHeadViewModel> {
  return tractorHeads
    .map((tractorHead) => fromModelToViewModel(tractorHead));
}


function fromModelToViewModel(
  tractorHead: TractorHead
): TractorHeadViewModel {
  return {
    plate: tractorHead.tractorHeadPlate,
    status: tractorHead.tractorHeadStatus,
    model: tractorHead.model,
    brand: tractorHead.brand,
    arrivalDatetime: tractorHead.arrivalDatetime,
    exitDatetime: tractorHead.exitDatetime,
    origin: {
      id: tractorHead.origin.id,
      name: tractorHead.origin.name,
    },
    destination: {
      id: tractorHead.destination.id,
      name: tractorHead.destination.name,
    },
    arrivalContainer: {
      id: tractorHead.arrivalContainer.id,
      code: tractorHead.arrivalContainer.code,
      residueTypes: tractorHead.arrivalContainer.residueTypes,
      currentWeight: tractorHead.arrivalContainer.currentWeight,
    },
    exitContainer: {
      id: tractorHead.exitContainer.id,
      code: tractorHead.exitContainer.code,
      residueTypes: tractorHead.exitContainer.residueTypes,
      currentWeight: tractorHead.exitContainer.currentWeight,
    },
  };
}