import { ResidueType } from '@features/residue-types/models/residue-type';
import { ContainerStatus } from '../../models/container-status.model';

type OptionalFilters = {
  code: string;
  residueTypes: Array<ResidueType>;
  containerTypeId: number;
  transporterContainerStatus: ContainerStatus;
};

type RequiredFilters = {
  offset: number;
  limit: number;
  locationId: number;
};

export type GetContainersWaitingForPickUpFilters = RequiredFilters &
  Partial<OptionalFilters>;
