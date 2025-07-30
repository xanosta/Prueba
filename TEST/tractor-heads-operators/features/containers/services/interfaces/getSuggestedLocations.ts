import { SmallLocation } from '@features/locations/models/location';

export interface GetSuggestedLocations {
  defaultLocations: SmallLocation[] | null;
  otherLocations: SmallLocation[];
}
