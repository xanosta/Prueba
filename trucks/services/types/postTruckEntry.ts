export interface PostTruckEntry {
  vehicleData: VehicleData;
  residueEntryData: ResidueEntryData;
}

export interface ResidueEntryData {
  hopperId: number;
  residueType: string;
  origins: Array<number>;
  arrivalWeight: number;
  UnloadDatetime: Date;
  exitWeight: number;
}

export interface VehicleData {
  plate: string;
  brand?: string;
  model?: string;
  weightKg?: number;
}
