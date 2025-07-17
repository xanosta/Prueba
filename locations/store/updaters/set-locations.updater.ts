import { PartialStateUpdater } from "@ngrx/signals";
import { LocationsSlice } from "../locations.slice";
import { Location } from '../../models/location';

export function setLocationsUpdater(
  locations: Array<Location>
): PartialStateUpdater<LocationsSlice> {
  return (_) => ({
    _locations: mapArrayToMap(locations)
  });

  function mapArrayToMap(locations: Array<Location>): Map<number, Location> {
    const result = new Map<number, Location>();

    locations.forEach(location => result.set(location.locationId, location))

    return result;
  }
}
