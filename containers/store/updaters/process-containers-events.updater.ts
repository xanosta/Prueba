import { PartialStateUpdater } from '@ngrx/signals';
import { EventTypes, SseEvent } from '@shared/services/sse/sseEvent';
import { ContainersSlice } from '../containers.slice';
import { Container } from '../../models/container.model';

function processContainerEvent(
  map: Map<number, Container>,
  containerEvent: SseEvent<Container>
): void {
  const { data: container, action } = containerEvent;

  switch (action) {
    case EventTypes.CREATION:
    case EventTypes.LOAD:
    case EventTypes.UPDATE:
      map.set(container.id, container);
      break;
    case EventTypes.DELETE:
      map.delete(container.id);
      break;
    default:
      console.error(`Unhandled event type: "${action}" in applyTruckEvent.`);
  }
}

export function processContainersEventsUpdater(
  events: Array<SseEvent<Container>>
): PartialStateUpdater<ContainersSlice> {
  return (store) => {
    const currentContainers = new Map(store._containers);

    for (const containerEvent of events) {
      processContainerEvent(currentContainers, containerEvent);
    }

    return {
      _containers: currentContainers,
    };
  };
}
