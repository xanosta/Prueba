export interface Device {
  id: number;
  name: string;
  type: string;
  ip: string;
  port: number;
  power: number;
  frequency: number;
  locationId?: number;
  position?: string;
}

export interface Zone {
  id: number;
  name: string;
  type: string;
  devices: Device[];
}

export interface Location {
  id: number;
  name: string;
  zones: Zone[];
}

export interface DevicesResponse {
  total: number;
  offset: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
  data: {
    locations: Location[];
  };
}

export interface Hopper {
  hopperId: number;
  name: string;
  locationId: number;
  containerRfidDeviceId: string;
  truckRfidDeviceId: string;
  hopperType: {
    hopperTypeId: number;
    description: string;
    residueTypeId: number[];
  };
}

export interface EntryArea {
  entryAreaId: number;
  name: string;
  locationId: number;
  plateReaderDeviceId: number;
  rfidReaderDeviceId: number;
  ignoreEntry: boolean;
}

export interface WeighingPlatform {
  weighingAreaId: number;
  name: string;
  locationId: number;
  rfidReaderDeviceId: number;
  scaleDeviceId: number;
  entryColumnDeviceId: number;
  exitColumnDeviceId: number;
  hopperId: number;
}
