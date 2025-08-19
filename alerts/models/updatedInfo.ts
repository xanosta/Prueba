import { ResidueType } from "@features/residue-types/models/residue-type"

export type UpdatedInfo = {
    current: CurrentInfo,
    differences: Array<{ field: string, before: any, after: any }>
}

type CurrentInfo = {
    dateTimeArrival: string | null,
    dateTimeExit: string | null,
    dateTimeArrivalWeigh: string,
    dateTimeExitWeigh: string,
    dateTimeUnloadBegin: string,
    dateTimeUnloadEnd: string,
    weightVehicleMaster: number | null,
    arrivalWeightKg: number | null,
    exitWeightKg: number | null,
    plate: string,
    residueType: ResidueType,
    origins: Array<Origin>,
    residueEntryId: number
}

type Origin = {
    id: number,
    name: string
}