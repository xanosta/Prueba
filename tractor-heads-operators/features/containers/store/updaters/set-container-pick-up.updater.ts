import { PartialStateUpdater } from '@ngrx/signals';
import { ContainersSlice } from '../containers.slice';
import { PickUpOrder } from '../../models/pick-up-order.model';
import { TractorHead } from '../../../tractor-heads/models/tractor-head.model';
import { Location } from '@features/locations/models/location';

export function setContainerPickUpUpdater(
  containerStayId: number,
  pickupOrder: PickUpOrder,
  locations: Array<Location>,
  tractorHeads: Array<TractorHead>
): PartialStateUpdater<ContainersSlice> {
  return (store) => {
    const containerStay = store._containers.get(containerStayId);

    if (!containerStay) {
      console.warn(`Container with ID ${containerStayId} not found`);
      return {
        _containers: new Map(store._containers),
      };
    }

    // ✅ ARREGLO 1: Buscar por locationId en lugar de destinationId
    const selectedLocation = locations.find(
      (loc) => loc.locationId === pickupOrder.destinationId
    );

    const selectedTractorHead = tractorHeads.find(
      (th) => th.id === pickupOrder.tractorHeadId
    );

    if (!selectedLocation) {
      console.warn(`Location with ID ${pickupOrder.destinationId} not found`);
      return {
        _containers: new Map(store._containers),
      };
    }

    if (!selectedTractorHead) {
      console.warn(`TractorHead with ID ${pickupOrder.tractorHeadId} not found`);
      return {
        _containers: new Map(store._containers),
      };
    }

    // ✅ ARREGLO 2: Crear una nueva instancia del Map y del container
    const result = new Map(store._containers);

    // ✅ ARREGLO 3: Crear una copia del container para evitar mutaciones
    const updatedContainer = {
      ...containerStay,
      scheduledPickup: {
        scheduledDateTimeExit: pickupOrder.scheduledExit.toISOString(),
        scheduledDestination: selectedLocation,
        scheduledTractorHeadPlate: selectedTractorHead,
      }
    };

    result.set(containerStayId, updatedContainer);

    return {
      _containers: result,
    };
  };
}