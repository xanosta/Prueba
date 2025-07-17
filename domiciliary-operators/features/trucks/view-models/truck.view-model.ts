import { SmallLocationViewModel } from 'app/features/locations/view-model/location.view-model';
import { HopperViewModel } from 'app/modules/plant-operators/features/hoppers/view-models/hopper.view-model';
import { ResidueType } from 'app/features/residue-types/models/residue-type';

export interface TruckViewModel {
    id: number;
    plate: string;
    currentState: string;
    residueType: Array<ResidueType>;
    datetimeArrival: string | null;
    datetimeArrivalWeight: string | null;
    arrivalWeight: number;
    datetimeUnloadBegin: string | null;
    datetimeExitWeight: string | null;
    exitWeight: number;
    datetimeExit: string | null;
    origins: Array<SmallLocationViewModel>;
    weightResidue: number;
    canBeRemoved: boolean;
    hopper?: HopperViewModel;
    containers: Array<ContainerViewModel>;
    canBeModifyAfter: Date;
    isValidated: boolean;
    vehicleCompanyName?: string;
}

interface ContainerViewModel {
    id: number;
    code: string;
}
