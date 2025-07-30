import { ContainerDetail } from '../../models/container-detail.model';
import { ContainerDetailViewModel } from '../../view-models/container-detail.view-model';

export function containerDetailGenerator(
  container?: ContainerDetail
): ContainerDetailViewModel | undefined {
  if (!container) return;

  return fromModelToViewModel(container);

  function fromModelToViewModel(
    container: ContainerDetail
  ): ContainerDetailViewModel {
    return {
      id: container.id,
      residueContainerId: container.residueContainerId,
      code: container.code,
      lastLoadHopper: container.lastLoadHopper?.name,
      currentWeight: container.currentResidueWeight,
      entry: new Date(container.entryDatetime),
      exit: container.exitDatetime
        ? new Date(container.exitDatetime)
        : undefined,
      state: container.currentState,
      residueTypes: container.residueTypes,
      origins: [...new Set(container.residueOrigins.map((origin) => origin.name))],
      loads: container.loads.map((load) => ({
        ...load,
        unloadDatetime: new Date(load.unloadDatetime),
        hopper: {
          ...load.unloadHopper,
        },
      })),
    };
  }
}
