import { ResidueType } from 'app/features/residue-types/models/residue-type';
import { ContainerState } from './container-state.model';

type Filters = {
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

export type ContainerFilters = Partial<Filters>;
