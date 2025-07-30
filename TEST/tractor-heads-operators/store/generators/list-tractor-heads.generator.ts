import { TractorHead } from '../../features/tractor-heads/models/tractor-head.model';
import { TractorHeadViewModel } from '../../view-models/tractor-head.view-model';

export function listTractorHeadsGenerator(
  tractorHeads: Array<TractorHead>
): Array<TractorHeadViewModel> {
  return tractorHeads.map((th) => mapToViewModel(th));

  function mapToViewModel(th: TractorHead): TractorHeadViewModel {
    return {
      id: th.id,
      plate: th.plate,
    };
  }
}
