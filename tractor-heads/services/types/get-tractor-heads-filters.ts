import { TractorHeadFilters } from '../../models/tractor-head-filters';


type RequiredFilters = {
  locationId: number;
};

export type GetTractorHeadsFilters = RequiredFilters &
  Partial<TractorHeadFilters>;

export function mapToGetTractorHeadFilters(
  filters: TractorHeadFilters,
  locationId: number
): GetTractorHeadsFilters {
  const mapped: GetTractorHeadsFilters = {
    locationId,
  };

  if (filters.tractorHeadPlate) {
    mapped.tractorHeadPlate = filters.tractorHeadPlate;
  }
  if (filters.originId) {
    mapped.originId = filters.originId;
  }
  if (filters.destinationId) {
    mapped.destinationId = filters.destinationId;
  }
  if (filters.tractorHeadStatus) {
    mapped.tractorHeadStatus = filters.tractorHeadStatus;
  }
  if (filters.ArrivalResidueTypes?.length) {
    mapped.ArrivalResidueTypes = filters.ArrivalResidueTypes;
  }
  if (filters.ExitResidueTypes?.length) {
    mapped.ExitResidueTypes = filters.ExitResidueTypes;
  }
  if (filters.from instanceof Date && !isNaN(filters.from.getTime())) {
    mapped.from = filters.from;
  }
  if (filters.to instanceof Date && !isNaN(filters.to.getTime())) {
    mapped.to = filters.to;
  }

  return mapped;
}