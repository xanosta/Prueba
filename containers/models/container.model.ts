import { ResidueType } from 'app/features/residue-types/models/residue-type';
import { ContainerState } from './container-state.model';

export interface Container {
  id: number;
  code: string;
  currentState: ContainerState;
  residueTypes: Array<ResidueType>;
  arrivalTractorHead?: SmallTractorHead;
  exitTractorHead?: SmallTractorHead;
  entryDatetime: string;
  exitDatetime?: string;
  lastLoadDatetime?: string;
  lastLoadHopper?: SmallHopper;
  maxCapacity: number;
  currentResidueWeight: number;
  loads: Array<ContainerLoad>;
  residueOrigins: Array<SmallLocation>;
}

interface SmallTractorHead {
  id: number;
  vehiclePlate: string;
}

interface SmallHopper {
  id: number;
  name: string;
}

interface ContainerLoad {
  id: number;
  truckId: number;
  truckPlate: string;
}

interface SmallLocation {
  id: number;
  name: string;
}
