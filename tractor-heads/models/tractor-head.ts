import { ResidueType } from "app/features/residue-types/models/residue-type";

export interface TractorHead {
    tractorHeadPlate: string;
    tractorHeadStatus: TractorHeadStatus;
    model: string;
    brand: string;
    arrivalDatetime: string | null;
    exitDatetime: string | null;
    origin: TractorHeadLocation;
    destination: TractorHeadLocation;
    arrivalContainer: TractorHeadContainer;
    exitContainer: TractorHeadContainer;
}

export enum TractorHeadStatus {
    EN_PRANTA = 'EN_PRANTA',
    SALIDO_PRANTA = 'SALIDO_PRANTA',
    DESTINO_PRANTA = 'DESTINO_PRANTA'
}

export interface TractorHeadLocation {
    id: number;
    name: string;
}

export interface TractorHeadContainer {
    id: number;
    code: string;
    residueTypes: Array<ResidueType>;
    currentWeight: number;
}



