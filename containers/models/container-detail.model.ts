import { ResidueType } from '@features/residue-types/models/residue-type';
import { ContainerState } from './container-state.model';

export interface ContainerDetail {
  id: number;
  code: string;
  currentState: ContainerState;
  arrivalTractorHead: TractorHead;
  exitTractorHead: TractorHead;
  residueTypes: ResidueType[];
  entryDatetime: string;
  exitDatetime: string;
  lastLoadDatetime: string;
  lastLoadHopper: LastLoadHopper;
  loads: Load[];
  maxCapacity: number;
  currentResidueWeight: number;
  residueOrigins: LastLoadHopper[];
  residueContainerId: number;
}

export interface TractorHead {
  id: number;
  vehiclePlate: string;
}

export interface LastLoadHopper {
  id: number;
  name: string;
}

export interface Load {
  id: number;
  truckId: number;
  truckPlate: string;
  residueTypes: string[];
  unloadDatetime: string;
  unloadHopper: LastLoadHopper;
  unloadPercentage: number;
  truckResidueWeight: number;
  unloadWeight: number;
  changeInContainer: boolean;
}
