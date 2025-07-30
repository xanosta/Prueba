import { Container } from '../../models/container.model';
import { ContainerViewModel } from '../../view-models/container.view-model';

const FACTOR_OF_WEIGHT_TO_REMOVE_CONTAINER = 0.9;

export function containerListGenerator(
  containers: Array<Container>
): Array<ContainerViewModel> {
  return containers.map((c) => mapToViewModel(c));

  function mapToViewModel(container: Container): ContainerViewModel {
    return {
      id: container.id,
      code: container.code,
      state: container.currentState,
      residueTypes: container.residueTypes,
      exit: container.exitDatetime
        ? new Date(container.exitDatetime)
        : undefined,
      entry: new Date(container.entryDatetime),
      currentWeight: container.currentResidueWeight,
      maxCapacity: container.maxCapacity,
      trucks: container.loads.map((load) => load.truckPlate),
      origins: [...new Set(container.residueOrigins.map((origin) => origin.name))],
      needToBeRemovedFromLocation:
        container.currentResidueWeight >=
        container.maxCapacity * FACTOR_OF_WEIGHT_TO_REMOVE_CONTAINER,
    };
  }
}
