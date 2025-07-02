import { Truck } from '../../models/truck';
import { TruckDetailViewModel } from '../../view-models/truck-detail.view-model';

export function selectedTruckGenerator(
  trucks: Array<Truck>,
  selectedTruckId: number
): TruckDetailViewModel | null {
  if (trucks.length <= 0) return null;

  const selectedTruck = trucks.find(
    (truck) => truck.residueEntryId === selectedTruckId
  );

  if (!selectedTruck) return null;

  return mapToViewModel(selectedTruck);

  function mapToViewModel(truck: Truck): TruckDetailViewModel {
    return {
      id: truck.residueEntryId,
      plate: truck.plate,
      model: `${truck.brandVehicle} ${truck.modelVehicle}`,
      vehicleCompanyName: truck.vehicleCompanyName,
      currentState: truck.currentState,
      residueTypes: [truck.residueType],
      datetimeArrival: truck.dateTimeArrival,
      dateTimeArrivalWeight: truck.dateTimeArrivalWeigh,
      dateTimeUnloadBegin: truck.dateTimeUnloadBegin,
      dateTimeExitWeight: truck.dateTimeExitWeigh,
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
      validatedByLocationId: truck.validatedByLocationId || null,
    };
  }
}
