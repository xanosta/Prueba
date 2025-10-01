export interface Device {
  id: number;
  name: string;
  type: string;
  ip: string;
  port: number;
  power: number;
  frequency: number;
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
