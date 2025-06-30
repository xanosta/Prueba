import { TractorHead } from '../../models/tractor-head';
import { TractorHeadFilters } from '../../models/tractor-head-filters';
import { TractorHeadOrder } from '../../models/tractor-head-orders';
import { TractorHeadViewModel } from '../../view-models/tractor-head.view-model';


export function tractorHeadsListGenerator(
  tractorHeads: Array<TractorHead>,
  order: TractorHeadOrder
): Array<TractorHeadViewModel> {
  return tractorHeads
    .slice()
    .sort((a, b) => {
      const field = order.by;
      const dateA = a[field] ? new Date(a[field]!).getTime() : null;
      const dateB = b[field] ? new Date(b[field]!).getTime() : null;

      if (dateA === null && dateB === null) return 0;
      if (dateA === null) return 1; // Mover nulos al final
      if (dateB === null) return -1; // Mover nulos al final

      const result = dateA - dateB;
      return order.direction === 'asc' ? result : -result;
    })
    .map((tractorHead) => fromModelToViewModel(tractorHead));
}


function fromModelToViewModel(
  tractorHead: TractorHead
): TractorHeadViewModel {
  return {
    id: tractorHead.tractorHeadStayId,
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