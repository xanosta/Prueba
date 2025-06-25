import { LocationViewModel } from 'app/features/locations/view-model/location.view-model';
import { HopperViewModel } from '../../hoppers/view-models/hopper.view-model';

export interface TruckViewModel {
  id: number;
  plate: string;
  currentState: string;
  residueType: string;
  datetimeArrival: string | null;
  datetimeArrivalWeight: string | null;
  arrivalWeight: number;
  datetimeUnloadBegin: string | null;
  datetimeExitWeight: string | null;
  exitWeight: number;
  datetimeExit: string | null;
  origins: Array<LocationViewModel>;
  weightResidue: number;
  canBeRemoved: boolean;
  hopper?: HopperViewModel;
  containers: Array<ContainerViewModel>;
  canBeModifyAfter: Date;
}

interface ContainerViewModel {
  id: number;
  code: string;
}
