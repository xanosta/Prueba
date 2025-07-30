import { PartialStateUpdater } from '@ngrx/signals';
import { Container } from '../../models/container.model';
import { ContainersSlice } from '../containers.slice';

export function setContainersUpdater(
  containers: Array<Container>
): PartialStateUpdater<ContainersSlice> {
  return (_) => {
    const result = containers.reduce(
      (acc, container) => acc.set(container.containerStayId, container),
      new Map<number, Container>()
    );
    return {
      _containers: result,
    };
  };
}
