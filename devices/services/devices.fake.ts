import { DevicesResponse } from '../models/device.model';
import { Device, Hopper, EntryArea, WeighingPlatform } from '../models/device.model';

export const FAKE_DEVICE_DETAIL_RESPONSE: Device = {
  id: 101,
  name: 'Lector RFID entrada (Detalle)',
  type: 'LECT_RFID',
  ip: '192.168.10.5',
  port: 8081,
  power: 27,
  frequency: 2915,
  locationId: 1,
  position: 'ENTRY_AREA',
};

export const FAKE_DEVICES_RESPONSE: DevicesResponse = {
  total: 42,
  offset: 0,
  pageSize: 20,
  hasNext: true,
  hasPrev: false,
  data: {
    locations: [
      {
        id: 1,
        name: 'Santiago',
        zones: [
          {
            type: 'ENTRY_AREA',
            id: 11,
            name: 'Entrada principal',
            devices: [
              {
                id: 101,
                name: 'Lector RFID entrada',
                type: 'LECT_RFID',
                ip: '192.168.10.5',
                port: 8081,
                power: 27,
                frequency: 915,
              },
            ],
          },
          {
            type: 'WEIGHING_PLATFORM',
            id: 12,
            name: 'Plataforma de pesado',
            devices: [
              {
                id: 102,
                name: 'Báscula 1',
                type: 'BASCULA',
                ip: '192.168.10.6',
                port: 8082,
                power: 27,
                frequency: 915,
              },
            ],
          },
        ],
      },
      {
        id: 2,
        name: 'Cuntis',
        zones: [
          {
            type: 'HOPPER',
            id: 21,
            name: 'Tolva',
            devices: [
              {
                id: 201,
                name: 'Cinta transportadora',
                type: 'CONVEYOR',
                ip: '192.168.20.1',
                port: 9001,
                power: 50,
                frequency: 60,
              },
            ],
          },
        ],
      },
    ],
  },
};

export const FAKE_HOPPER: Hopper = {
  hopperId: 999,
  name: 'Tolva A',
  locationId: 1,
  containerRfidDeviceId: '120',
  truckRfidDeviceId: '121',
  hopperType: {
    hopperTypeId: 0,
    description: 'string',
    residueTypeId: [0],
  },
};

export const FAKE_ENTRY_AREA: EntryArea = {
  entryAreaId: 1,
  name: 'Main Entry Area',
  locationId: 1,
  plateReaderDeviceId: 110,
  rfidReaderDeviceId: 111,
  ignoreEntry: true,
};

export const FAKE_WEIGHING_PLATFORM: WeighingPlatform = {
  weighingAreaId: 1,
  name: 'Platform A',
  locationId: 1,
  rfidReaderDeviceId: 100,
  scaleDeviceId: 200,
  entryColumnDeviceId: 101,
  exitColumnDeviceId: 102,
  hopperId: 999,
};
