import { ResidueType } from 'app/features/residue-types/models/residue-type';

export interface Truck {
    residueEntryId: number;
    vehicleId: number;
    brandVehicle: string;
    plate: string;
    locationId: number;
    modelVehicle: string;
    currentState: TruckState;
    residueType: ResidueType;
    dateTimeArrival: string | null;
    dateTimeExit: string | null;
    dateTimeArrivalWeigh: string | null;
    dateTimeExitWeigh: string | null;
    dateTimeUnloadBegin: string | null;
    weightResidue: number;
    weightVehicleEntry: number;
    weightVehicleMaster: number;
    exitWeightKg: number | null;
    hopper?: Hopper;
    residueLocationOrigins: SmallOrigin[];
    containerList: ContainerList[];
    allowedModifyDate: string;
    validatedByLocationId: number | null;
    vehicleCompanyName: string;
}

export interface SmallOrigin {
    locationId: number;
    name: string;
}

export enum TruckState {
    ENTRADO = 'ENTRADO',
    PESADO_EN_ENTRADA = 'PESADO_EN_ENTRADA',
    DESCARGANDO = 'DESCARGANDO',
    DESCARGADO = 'DESCARGADO',
    PESADO_EN_SALIDA = 'PESADO_EN_SALIDA',
    SALIDO = 'SALIDO',
}

export type ContainerList = {
    containerId: number;
    identificationCode: string;
};

export type SmallTruck = {
    type: string;
    plate: string;
    model: string;
    brand: string;
    weightKg: number;
    id: number;
};

export interface Hopper {
    name: string;
    id: number;
}

export interface ResidueLocationOrigin {
    locationId: number;
    name: string;
}
