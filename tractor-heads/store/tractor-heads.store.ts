import {
  patchState,
  signalMethod,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { computed, effect, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  bufferTime,
  exhaustAll,
  filter,
  map,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { SseEvent } from '@shared/services/sse/sseEvent';
import { ConfigStore } from '@config/store/app-config.store';
import { tractorHeadsSliceInitialValue } from './tractor-heads.slice';
import { TractorHeadsSseService } from '../services/tractor-heads-sse.service';
import { tractorHeadsListGenerator } from './generators/tractor-heads-list.generator';
import { TractorHeadFilters } from '../models/tractor-head-filters';
import { setTruckFiltersUpdater } from './updaters/set-tractor-head-filters.updater';
import { resetTractorHeadFiltersUpdater } from './updaters/reset-tractor-head-filters.updater';
import { toggleTractorHeadFiltersUpdater } from './updaters/toggle-tractor-head-filters.updater';
import { subscribeToEventsUpdater } from './updaters/subscribe-to-events.updater';
import { disconnectToSseEventsUpdater } from './updaters/disconnect-to-sse-events.updater';
import { resetTractorHeadsListUpdater } from './updaters/reset-tractor-heads-list.updater';
import { processTractorHeadEventsUpdater } from './updaters/process-tractor-head-events.updater';
import { TractorHead } from '../models/tractor-head';
import { setBusyUpdater } from './updaters/set-busy.updater';
import { AuthStore } from '@auth/store/auth.store';

export const TractorHeadsStore = signalStore(
  withState(tractorHeadsSliceInitialValue),
  withProps((_) => {
    return {
      _configStore: inject(ConfigStore),
      _tractorHeadsSseService: inject(TractorHeadsSseService),
      _authStore: inject(AuthStore)
    };
  }),
  withComputed((store) => {
    return {
      tractorHeadsList: computed(() =>
        tractorHeadsListGenerator(Array.from(store._tractorHeads().values()))
      ),
    }
  }),
  withMethods((store) => {
    return {
      setFilters: (filters: TractorHeadFilters) => {
        patchState(store, setTruckFiltersUpdater(filters));
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

        if (!token) {
          console.log('[TractorHeadsStore] Esperando por el token de autenticación...');
          return;
        }

        store._disconnectFromSSE();
        store._resetList();
        patchState(store, setBusyUpdater(true))

        console.log('[TractorHeadsStore] Token listo. Conectando al SSE...');

        const subscription = store._tractorHeadsSseService
          .connect(filters)
          .pipe(
            bufferTime(600),
            filter((events) => events.length > 0)
          )
          .subscribe({
            next: (events) => {
              console.log('[DEBUG 2] Eventos recibidos en el Store (después de bufferTime):', events);
              store._processEvents(events);
              patchState(store, setBusyUpdater(false))
            },
            error: (err) => {
              console.error('SSE connection error:', err);
              patchState(store, setBusyUpdater(false));
            },
          });

        store._connectToSSE(subscription);
      })
    },
    onDestroy(store) {
      store._disconnectFromSSE();
    }
  })


  //

)

