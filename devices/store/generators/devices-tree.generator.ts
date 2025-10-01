import { Location } from '../../models/device.model';
import { DeviceTreeNode } from '../../view-model/device.view-model';

export function devicesTreeGenerator(locations: Location[]): DeviceTreeNode[] {
  return locations.map(location => ({
    key: `loc-${location.id}`,
    data: {
      id: location.id,
      name: location.name,
      level: 0,
    },
    children: location.zones.map(zone => ({
      key: `zone-${zone.id}`,
      data: {
        id: zone.id,
        name: zone.name,
        type: zone.type,
        level: 1,
      },
      children: zone.devices.map(device => ({
        key: `dev-${device.id}`,
        data: {
          id: device.id,
          name: device.name,
          type: device.type,
          ip: device.ip,
          port: device.port,
          power: device.power,
          frequency: device.frequency,
          level: 2,
        },
      })),
    })),
  }));
}
