import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { computed, effect, inject } from '@angular/core';
import {
  bufferTime,
  filter,
  Subscription,
} from 'rxjs';
import { SseEvent } from '@shared/services/sse/sseEvent';
import { tractorHeadsSliceInitialValue } from './tractor-heads.slice';
import { TractorHeadsSseService } from '../services/tractor-heads-sse.service';
import { tractorHeadsListGenerator } from './generators/tractor-heads-list.generator';
import { TractorHeadFilters } from '../models/tractor-head-filters';
import { setTractorHeadFiltersUpdater } from './updaters/set-tractor-head-filters.updater';
import { resetTractorHeadFiltersUpdater } from './updaters/reset-tractor-head-filters.updater';
import { toggleTractorHeadFiltersUpdater } from './updaters/toggle-tractor-head-filters.updater';
import { subscribeToEventsUpdater } from './updaters/subscribe-to-events.updater';
import { disconnectToSseEventsUpdater } from './updaters/disconnect-to-sse-events.updater';
import { resetTractorHeadsListUpdater } from './updaters/reset-tractor-heads-list.updater';
import { processTractorHeadEventsUpdater } from './updaters/process-tractor-head-events.updater';
import { TractorHead } from '../models/tractor-head';
import { setBusyUpdater } from './updaters/set-busy.updater';
import { AuthStore } from '@auth/store/auth.store';
import { TractorHeadOrder } from '../models/tractor-head-orders';
import { setTractorHeadOrderUpdater } from './updaters/set-tractor-head-order.updater';
import { LocationsStore } from 'app/features/locations/store/locations.store';
import { SseTractorHeadFilters } from '../services/types/sse-tractor-head-filters';

export const TractorHeadsStore = signalStore(
  withState(tractorHeadsSliceInitialValue),
  withProps((_) => {
    return {
      _locationsStore: inject(LocationsStore),
      _tractorHeadsSseService: inject(TractorHeadsSseService),
      _authStore: inject(AuthStore)
    };
  }),
  withComputed((store) => {
    return {
      tractorHeadsList: computed(() =>
        tractorHeadsListGenerator(
          Array.from(store._tractorHeads().values()),
          store.order()
        )
      ),
    }
  }),
  withMethods((store) => {
    return {
      _setBusy(isBusy: boolean) {
        patchState(store, setBusyUpdater(isBusy));
      },
      setFilters: (filters: TractorHeadFilters) => {
        patchState(store, setTractorHeadFiltersUpdater(filters));
      },
      resetFilters: () => {
        patchState(store, resetTractorHeadFiltersUpdater());
      },
      openFilters: () => {
        patchState(store, toggleTractorHeadFiltersUpdater(true));
      },
      closeFilters: () => {
        patchState(store, toggleTractorHeadFiltersUpdater(false));
      },
      setOrder: (order: TractorHeadOrder) => {
        patchState(store, setTractorHeadOrderUpdater(order));
      },
      _connectToSSE: (subscription: Subscription) => {
        patchState(store, subscribeToEventsUpdater(subscription));
      },
      _disconnectFromSSE: () => {
        patchState(store, disconnectToSseEventsUpdater());
      },
      _processEvents: (events: Array<SseEvent<TractorHead>>) => {
        patchState(store, processTractorHeadEventsUpdater(events));
      },
      _resetList: () => {
        patchState(store, resetTractorHeadsListUpdater());
      },
    }
  }),
  withHooks({
    onInit(store) {
      effect(() => {
        const token = store._authStore.token();
        const filters = store._filters();
        const selectedLocation = store._locationsStore.selectedLocation();

        if (!token || !selectedLocation) { return; }

        store._resetList();
        store._setBusy(true);

        const parsedFilters: SseTractorHeadFilters = {
          ...filters,
          //locationId: 2,
          locationId: selectedLocation.locationId,
          token: token
        };

        const subscription = store._tractorHeadsSseService
          .connect(parsedFilters)
          .pipe(
            bufferTime(600),
            filter((events) => events.length > 0)
          )
          .subscribe({
            next: (events) => {
              store._processEvents(events);
              store._setBusy(false);
            },
            error: (err) => {
              console.error('SSE connection error:', err);
              store._setBusy(false);
            },
          });

        store._connectToSSE(subscription);
      })
    },
    onDestroy(store) {
      store._disconnectFromSSE();
    }
  })
)