import { PartialStateUpdater } from '@ngrx/signals';
import { Subscription } from 'rxjs';
import { ContainersSlice } from '../containers.slice';

export function saveContainerSseSubsriptionUpdater(
  subscription: Subscription
): PartialStateUpdater<ContainersSlice> {
  return (store) => {
    return {
      _sseSubscription: subscription,
    };
  };
}
