import { TractorHead } from '../../features/tractor-heads/models/tractor-head.model';
import { TractorHeadViewModel } from '../../view-models/tractor-head.view-model';

export function assignedTractorHeadsGenerator(
  tractorHeads: Array<TractorHead>,
  assignedTractorHeadIds: Array<number>
): Array<TractorHeadViewModel> {
  return tractorHeads
    .filter(({ id }) => assignedTractorHeadIds.includes(id))
    .map((th) => mapToViewModel(th));

  function mapToViewModel(th: TractorHead): TractorHeadViewModel {
    return {
      id: th.id,
      plate: th.plate,
    };
  }
}
