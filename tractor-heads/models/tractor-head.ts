import { ResidueType } from "app/features/residue-types/models/residue-type";

export interface TractorHead {
    tractorHeadStayId: number;
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
    id: number | null;
    name: string | null;
}

export interface TractorHeadContainer {
    id: number | null;
    code: string | null;
    residueTypes: Array<ResidueType> | null;
    currentWeight: number | null;
}



