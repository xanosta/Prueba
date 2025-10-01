import { DevicesResponse } from '../models/device.model';

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
            name: 'Báscula',
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
            type: 'SORTING_AREA',
            id: 21,
            name: 'Área de clasificación',
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
