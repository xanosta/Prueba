import { LocationViewModel } from '../../view-model/location.view-model';
import { Location } from '../../models/location';

export function selectedLocationGenerator(
  locations: Map<number, Location>,
  selectedLocationId: number | null
): LocationViewModel | null {
  if (locations.size <= 0 || !selectedLocationId) return null;

  const selectedLocation = locations.get(selectedLocationId)

  if (!selectedLocation) return null;

  return mapToViewModel(selectedLocation);

  function mapToViewModel(loc: Location): LocationViewModel {
    return { ...loc };
  }
}
