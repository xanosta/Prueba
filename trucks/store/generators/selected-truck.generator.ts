import { Truck } from '../../models/truck';
import { TruckViewModel } from '../../view-models/truck.view-model';

export function selectedTruckGenerator(
  trucks: Array<Truck>,
  selectedTruckId: number
): TruckViewModel | null {
  if (trucks.length <= 0) return null;

  const selectedTruck = trucks.find(
    (truck) => truck.residueEntryId === selectedTruckId
  );

  if (!selectedTruck) throw new Error();

  return {
    id: selectedTruck?.residueEntryId,
    plate: selectedTruck?.plate,
    currentState: selectedTruck.currentState,
    residueType: selectedTruck.residueType,
    datetimeArrival: selectedTruck.dateTimeArrival
      ? selectedTruck.dateTimeArrival.toString()
      : '-',
    datetimeArrivalWeight: selectedTruck.dateTimeArrivalWeigh
      ? selectedTruck.dateTimeArrivalWeigh.toString()
      : '-',
    datetimeUnloadBegin: selectedTruck.dateTimeUnloadBegin
      ? selectedTruck.dateTimeUnloadBegin.toString()
      : '-',
    datetimeExitWeight: selectedTruck.dateTimeExitWeigh
      ? selectedTruck.dateTimeExitWeigh.toString()
      : '-',
    exitWeight: selectedTruck.exitWeightKg ? selectedTruck.exitWeightKg : 0,
    datetimeExit: selectedTruck.dateTimeExit
      ? selectedTruck.dateTimeExit.toString()
      : '-',
    weightResidue: selectedTruck.weightResidue,
    hopper: selectedTruck.hopper && {
      id: selectedTruck.hopper.id,
      name: selectedTruck.hopper.name,
    },
    canBeRemoved: false,
    arrivalWeight: selectedTruck.weightVehicleEntry,
    origins: selectedTruck.residueLocationOrigins.map((origin) => ({
      id: origin.id,
      name: origin.name,
    })),
    containers: selectedTruck.containerList.map((container) => ({
      id: container.containerId,
      code: container.identificationCode,
    })),
    canBeModifyAfter: new Date(selectedTruck.allowedModifyDate),
  };
}
