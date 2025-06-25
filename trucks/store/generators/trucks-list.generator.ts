import { Truck } from '../../models/truck';
import { TruckFilters } from '../../models/truck-filters';
import { TruckViewModel } from '../../view-models/truck.view-model';

export function trucksListGenerator(
  trucks: Array<Truck>,
  filters: TruckFilters
): Array<TruckViewModel> {
  return trucks
    .filter((truck) => applyFilters(truck, filters))
    .map((truck) => fromModelToViewModel(truck));

  function applyFilters(truck: Truck, filters: TruckFilters): boolean {
    if (
      filters.plate &&
      !truck.plate.toLowerCase().includes(filters.plate.toLowerCase())
    ) {
      return false;
    }

    if (
      Array.isArray(filters.state) &&
      filters.state.length > 0 &&
      !filters.state.includes(truck.currentState)
    ) {
      return false;
    }

    if (filters.residueType && truck.residueType !== filters.residueType) {
      return false;
    }

    if (
      filters.originId &&
      filters.originId.length > 0 &&
      !filters.originId.includes(truck.locationId)
    ) {
      return false;
    }

    return true;
  }

  function fromModelToViewModel(truck: Truck): TruckViewModel {
    return {
      id: truck?.residueEntryId,
      plate: truck?.plate,
      currentState: truck.currentState,
      residueType: truck.residueType,
      datetimeArrival: truck.dateTimeArrival,
      datetimeArrivalWeight: truck.dateTimeArrivalWeigh,
      datetimeUnloadBegin: truck.dateTimeUnloadBegin,
      datetimeExitWeight: truck.dateTimeExitWeigh,
      exitWeight: truck.exitWeightKg ? truck.exitWeightKg : 0,
      datetimeExit: truck.dateTimeExit,
      weightResidue: truck.weightResidue,
      hopper: truck.hopper && {
        id: truck.hopper.id,
        name: truck.hopper.name,
      },
      canBeRemoved: true,
      arrivalWeight: truck.weightVehicleEntry,
      origins: truck.residueLocationOrigins.map((origin) => ({
        id: origin.id,
        name: origin.name,
      })),
      containers: truck.containerList.map((container) => ({
        id: container.containerId,
        code: container.identificationCode,
      })),
      canBeModifyAfter: new Date(truck.allowedModifyDate),
    };
  }
}
