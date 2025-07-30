import { Container } from '../../models/container.model';
import { ContainersFilters } from '../../models/containers-filters.model';
import { ContainerPickUpViewModel } from '../../view-model/container.view-model';

export function pickUpListGenerator(
  containers: Array<Container>,
  filter: ContainersFilters
): Array<ContainerPickUpViewModel> {
  return containers.map((container) => mapToViewModel(container));

  function mapToViewModel(container: Container): ContainerPickUpViewModel {
    const scheduledPickup =
      container.scheduledPickup &&
        container.scheduledPickup.scheduledTractorHeadPlate &&
        container.scheduledPickup.scheduledDestination &&
        container.scheduledPickup.scheduledDateTimeExit
        ? {
          tractorHeadPlate:
            (container.scheduledPickup.scheduledTractorHeadPlate as any).vehiclePlate || container.scheduledPickup.scheduledTractorHeadPlate.plate,
          destination: container.scheduledPickup.scheduledDestination,
          date: new Date(container.scheduledPickup.scheduledDateTimeExit),
        }
        : undefined;

    const pickUpAsignee =
      container.notifiedTractorHeadPlate &&
        container.destinationLocation &&
        container.notifiedDateTimeExit
        ? {
          tractorHeadPlate: container.notifiedTractorHeadPlate.plate,
          destination: container.destinationLocation,
          date: new Date(container.notifiedDateTimeExit),
        }
        : undefined;

    return {
      id: container.containerStayId,
      code: container.code || '',
      containerType: container.containerType?.code || '',
      state: container.currentState,
      residueTypes: container.residueTypes,
      scheduledPickup,
      pickUpAsignee,
      isAlreadyPicked: !!pickUpAsignee,
      isBooked: !!scheduledPickup,
      capacity: container.capacity,
      currentWeight: container.currentWeight,
      arrivalDateTime: container.arrivalDateTime,
      fullLoadDateTime: container.fullLoadDateTime,
    };
  }
}