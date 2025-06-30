import { ResidueType } from 'app/features/residue-types/models/residue-type';
import { TruckFilters } from '../../models/truck-filters';

type OptionalFilters = {
  plate: string;
  originLoctationIds: Array<number>;
  currentStates: Array<TruckState>;
  residueTypes: Array<ResidueType>;
  fromDateTime: Date;
  toDateTime: Date;
  orderBy: 'dateTimeArrival' | 'dateTimeExit';
  orderType: 'ASC' | 'DESC';
};

type TruckState =
  | 'ENTRADO'
  | 'PESADO_EN_ENTRADA'
  | 'DESCARGANDO'
  | 'DESCARGADO'
  | 'PESADO_EN_SALIDA'
  | 'SALIDO';

type RequiredFilters = {
  locationId: number;
};

export type GetTrucksFilters = RequiredFilters & Partial<OptionalFilters>;

export function mapToGetTruckFilters(
  filters: TruckFilters,
  locationId: number
): GetTrucksFilters {
  const mapped: GetTrucksFilters = {
    locationId,
  };

  if (filters.plate) {
    mapped.plate = filters.plate;
  }

  if (filters.originId?.length) {
    mapped.originLoctationIds = filters.originId;
  }

  if (filters.state?.length) {
    mapped.currentStates = filters.state as TruckState[];
  }

  if (filters.residueType) {
    mapped.residueTypes = [filters.residueType];
  }

  if (filters.from instanceof Date && !isNaN(filters.from.getTime())) {
    mapped.fromDateTime = filters.from;
  }

  if (filters.to instanceof Date && !isNaN(filters.to.getTime())) {
    mapped.toDateTime = filters.to;
  }

  return mapped;
}
