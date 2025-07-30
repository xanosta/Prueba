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

    if (!containerStay)
      return {
        _containers: new Map(store._containers),
      };

    const selectedLocation = locations.find(
      (loc) => loc.locationId === pickupOrder.destinationId
    );
    const selectedTractorHead = tractorHeads.find(
      (th) => th.id === pickupOrder.tractorHeadId
    );

    if (!selectedLocation || !selectedTractorHead)
      return {
        _containers: new Map(store._containers),
      };

    const result = new Map(store._containers);
    containerStay.scheduledPickup = {
      scheduledDateTimeExit: pickupOrder.scheduledExit.toISOString(),
      scheduledDestination: selectedLocation,
      scheduledTractorHeadPlate: selectedTractorHead,
    };

    result.set(containerStayId, containerStay);

    return {
      _containers: result,
    };
  };
}
