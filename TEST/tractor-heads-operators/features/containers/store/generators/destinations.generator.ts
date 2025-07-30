import { SmallLocation } from '@features/locations/models/location';
import { SmallLocationViewModel } from '@features/locations/view-model/location.view-model';

export function destinationsGenerators(locations: {
  suggested: Array<SmallLocation>;
  others: Array<SmallLocation>;
}): {
  suggestions: Array<SmallLocationViewModel>;
  others: Array<SmallLocationViewModel>;
} {
  return {
    suggestions: locations.suggested.map((loc) => mapToViewModel(loc)),
    others: locations.others.map((loc) => mapToViewModel(loc)),
  };

  function mapToViewModel(loc: SmallLocation): SmallLocationViewModel {
    return {
      locationId: loc.locationId,
      name: loc.name,
    };
  }
}
