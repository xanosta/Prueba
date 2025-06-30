import { Location } from '../../models/location';

export function canChangeGenerator(
  locations: Map<number, Location>
): boolean {
  return locations.size > 1;
}
