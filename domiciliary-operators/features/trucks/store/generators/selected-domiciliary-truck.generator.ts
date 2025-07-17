import { Truck } from '../../models/truck';
import { TruckViewModel } from '../../view-models/truck.view-model';

export function selectedDomiciliaryTruckGenerator(
  trucks: Array<Truck>,
  selectedTruckId: number
): TruckViewModel | null {
  if (trucks.length <= 0) return null;

  const selectedTruck = trucks.find(
    (truck) => truck.residueEntryId === selectedTruckId
  );

  if (!selectedTruck) return null;

  return mapToViewModel(selectedTruck);

  function mapToViewModel(truck: Truck): TruckViewModel {
    return {
      id: truck.residueEntryId,
      plate: truck.plate,
      currentState: truck.currentState,
      datetimeArrival: truck.dateTimeArrival,
      exitWeight: truck.exitWeightKg ? truck.exitWeightKg : 0,
      datetimeExit: truck.dateTimeExit,
      weightResidue: truck.weightResidue,
      hopper: truck.hopper && {
        id: truck.hopper.id,
        name: truck.hopper.name,
      },
      canBeRemoved: false,
      arrivalWeight: truck.weightVehicleEntry,
      origins: truck.residueLocationOrigins.map((origin) => ({
        locationId: origin.locationId,
        name: origin.name,
      })),
      containers: truck.containerList.map((container) => ({
        id: container.containerId,
        code: container.identificationCode,
      })),
      canBeModifyAfter: new Date(truck.allowedModifyDate),
      isValidated: !!truck.validatedByLocationId,
      datetimeArrivalWeight: truck.dateTimeArrivalWeigh,
      datetimeExitWeight: truck.dateTimeExitWeigh,
      datetimeUnloadBegin: truck.dateTimeUnloadBegin,
      residueType: [truck.residueType],
      vehicleCompanyName: truck.vehicleCompanyName
    };
  }
}
