import { PartialStateUpdater } from "@ngrx/signals";
import { LocationsSlice } from "../locations.slice";
import { Location } from '../../models/location';

export function setDefaultLocationUpdater (
  locations: Array<Location>
): PartialStateUpdater<LocationsSlice> {
  return(store) => {
    if(store._selectedLocationId) return{};
    if(locations.length === 0) return{};
    return {
      _selectedLocationId: locations[0].locationId
    }
  }
}
