import { ResidueType } from 'app/features/residue-types/models/residue-type';
import { ContainerState } from '../../models/container-state.model';

type OptionalFilters = {
  code: string;
  residueTypes: Array<ResidueType>;
  truckPlate: string;
  tractorHeadPlate: string;
  residueOriginId: string;
  destinationId: string;
  currentState: ContainerState;
  fromDateTime: Date;
  toDateTime: Date;
};

type RequiredFilters = {
  locationId: number;
  token: string;
};

export type ContainerSseFilters = RequiredFilters & Partial<OptionalFilters>;
