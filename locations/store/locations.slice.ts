import { Location, SmallLocation } from '../models/location'

export interface LocationsSlice {
  readonly _locations: Map<number, Location>;
  readonly _selectedLocationId: number | null;
  readonly _origins: Array<SmallLocation>
}

export const locationsSliceInitialValue: LocationsSlice = {
  _locations: new Map<number, Location>(),
  _selectedLocationId: null,
  _origins: []
};
