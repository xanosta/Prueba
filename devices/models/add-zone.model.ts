export interface AddZonePayload {
  name: string;
  locationId: number;
  areaType: string;
}

export interface EntryAreaPayload {
  name: string;
  locationId: number;
  plateReaderDevice: null;
  rfidReaderDevice: null;
  ignoreEntry: boolean;
}

export interface WeighingPlatformPayload {
  name: string;
  locationId: number;
  rfidReaderDevice: null;
  scaleDeviceId: null;
  entryColumnDevice: null;
  exitColumnDevice: null;
  hopperId: null;
}

export interface HopperPayload {
  name: string;
  locationId: number;
  containerRfidDevice: null;
  truckRfidDevice: null;
  hopperType: null;
}
