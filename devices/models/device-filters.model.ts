interface OptionalFilters {
  locationId: number;
  locationName: string;
  areaType: string;
  deviceType: string;
}

interface MandatoryFilters {
  currentPage: number;
}

export type DevicesFilters = MandatoryFilters & Partial<OptionalFilters>;
