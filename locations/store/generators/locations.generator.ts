import { LocationViewModel } from '../../view-model/location.view-model';
import { Location } from '../../models/location';

export function locationsGenerator(
  locations: Map<number, Location>
): Array<LocationViewModel> {
  return Array.from(locations.values())
}
