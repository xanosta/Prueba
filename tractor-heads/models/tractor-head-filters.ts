import { ResidueType } from "app/features/residue-types/models/residue-type";
import { TractorHeadStatus } from "./tractor-head";

export interface TractorHeadFilters {
    tractorHeadPlate?: string;
    originId?: number;
    destinationId?: number;
    tractorHeadStatus?: TractorHeadStatus;
    ArrivalResidueTypes?: Array<ResidueType>;
    ExitResidueTypes?: Array<ResidueType>;
    from?: Date;
    to?: Date;
}