import { SmallLocationViewModel } from "app/features/locations/view-model/location.view-model";
import { ResidueType } from "app/features/residue-types/models/residue-type";
import { HopperViewModel } from "../../hoppers/view-models/hopper.view-model";

export interface TruckDetailViewModel {
  id: number;
  plate: string;
  model: string;
  vehicleCompanyName: string;
  weightResidue: number;
  datetimeArrival: string | null;
  datetimeExit: string | null;
  currentState: TruckState;
  containers: Array<ContainerViewModel>;
  residueTypes: Array<ResidueType>;
  origins: Array<SmallLocationViewModel>;
  dateTimeArrivalWeight: string | null;
  arrivalWeight: number;
  dateTimeExitWeight: string | null;
  exitWeight: number | null;
  dateTimeUnloadBegin: string | null;
  hopper?: HopperViewModel;
  canBeRemoved: boolean;
  isValidated: boolean;
  canBeModifyAfter: Date;
  validatedByLocationId: number | null;
}

export enum TruckState {
  ENTRADO = 'ENTRADO',
  PESADO_EN_ENTRADA = 'PESADO_EN_ENTRADA',
  DESCARGANDO = 'DESCARGANDO',
  DESCARGADO = 'DESCARGADO',
  PESADO_EN_SALIDA = 'PESADO_EN_SALIDA',
  SALIDO = 'SALIDO',
}

export interface ContainerViewModel {
  id: number;
  code: string;
}
