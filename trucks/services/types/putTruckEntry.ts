export interface PutTruckEntry {
  originIds?:             number[];
  residueTypeId?:         string;
  arrivalWeight?:         number;
  exitWeight?:            number;
  hopperId?:              number;
  validatedByLocationId?: number;
  dateTimeUnload?:        Date;
  pin?:                   string;
  vehicleId?:             number;
}
