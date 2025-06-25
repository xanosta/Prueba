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

import { trucksEntriesSliceInitialValue } from './truck-entries.slice';
import { trucksListGenerator } from './generators/trucks-list.generator';
import { TruckFilters } from '../models/truck-filters';
import {
  bufferTime,
  exhaustAll,
  filter,
  map,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { setBusyUpdater } from './updaters/set-busy.updater';
import { TrucksService } from '../services/trucks.service';
import { setTrucksUpdater } from './updaters/setTrucks.updater';
import { setTruckFiltersUpdater } from './updaters/set-truck-filters.updater';
import { deleteTruckUpdater } from './updaters/delete-truck.updater';
import { Truck } from '../models/truck';
import { updateTruckUpdater } from './updaters/update-truck.updater';
import { selectedTruckGenerator } from './generators/selected-truck.generator';
import { resetTruckFiltersUpdater } from './updaters/reset-truck-filters.updater';
import { toggleTruckFiltersUpdater } from './updaters/toggle-truck-filters.updater';
import { processTruckEntryEventsUpdater } from './updaters/process-truck-entry-events.updater';
import { TrucksSseService } from '../services/trucks-sse.service';
import { subscribeToEventsUpdater } from './updaters/subscribe-to-events.updater';
import { SseEvent } from '@shared/services/sse/sseEvent';
import { disconnectToSseEventsUpdater } from './updaters/disconnect-to-sse-events.updater';
import { resetTruckListUpdater } from './updaters/reset-truck-list.updater';
import { ConfigStore } from '@config/store/app-config.store';
import { mapToGetTruckFilters } from '../services/types/getTrucksFilters';

export const TrucksEntriesStore = signalStore(
  withState(trucksEntriesSliceInitialValue),
  withProps((_) => {
    return {
      _configStore: inject(ConfigStore),
      _trucksService: inject(TrucksService),
      _trucksSseService: inject(TrucksSseService),
    };
  }),
  withComputed((store) => {
    return {
      trucksList: computed(() =>
        trucksListGenerator(
          Array.from(store._trucks().values()),
          store._filters()
        )
      ),
      selectedTruck: computed(() => {
        if (!store._selectedTruckId()) return;

        return selectedTruckGenerator(
          Array.from(store._trucks().values()),
          store._selectedTruckId()
        );
      }),
    };
  }),
  withMethods((store) => {
    const _fetchTrucks = rxMethod<TruckFilters>((input$) =>
      input$.pipe(
        filter((truckFilters) => !!truckFilters.from && !!truckFilters.to),
        tap((_) =>
          patchState(store, setBusyUpdater(), disconnectToSseEventsUpdater())
        ),
        map((filters) =>
          mapToGetTruckFilters(filters, store._configStore.selectedLocationId())
        ),
        map((filters) => store._trucksService.getAllTrucks(filters)),
        exhaustAll(),
        tap((trucks) =>
          patchState(store, setBusyUpdater(false), setTrucksUpdater(trucks))
        )
      )
    );

    _fetchTrucks(store._filters);

    const _deleteTruck = rxMethod<number>((input$) =>
      input$.pipe(
        tap(() => patchState(store, setBusyUpdater())),
        switchMap((truckId) =>
          store._trucksService.deleteTruck(truckId).pipe(map(() => truckId))
        ),
        tap((truckId) => {
          patchState(store, setBusyUpdater(false), deleteTruckUpdater(truckId));
        })
      )
    );

    const _updateTruck = rxMethod<{ id: number; values: Truck }>((input$) =>
      input$.pipe(
        tap(() => patchState(store, setBusyUpdater())),
        switchMap(({ id, values }) =>
          store._trucksService
            .updateTruck(id, values)
            .pipe(map(() => ({ id, values })))
        ),
        tap(({ id, values }) => {
          patchState(
            store,
            setBusyUpdater(false),
            updateTruckUpdater(id, values)
          );
        })
      )
    );

    return {
      _processTruckEntriesEvents: (truckEntries: Array<SseEvent<Truck>>) => {
        patchState(store, processTruckEntryEventsUpdater(truckEntries));
      },
      setFilters: (filters: TruckFilters) => {
        patchState(store, setTruckFiltersUpdater(filters));
      },
      resetFilters: () => {
        patchState(store, resetTruckFiltersUpdater());
      },
      deleteTruck: (truckEntryId: number) => {
        _deleteTruck(truckEntryId);
      },
      updateTruck: (truckEntryId: number, newValues: Truck) => {
        _updateTruck({ id: truckEntryId, values: newValues });
      },
      setSelectedTruck: signalMethod<number>((truckId) => {
        patchState(store, { _selectedTruckId: truckId });
      }),
      openFilters: () => {
        patchState(store, toggleTruckFiltersUpdater(true));
      },
      closeFilters: () => {
        patchState(store, toggleTruckFiltersUpdater(false));
      },
      _connectToSSE: (subscription: Subscription) => {
        patchState(store, subscribeToEventsUpdater(subscription));
      },
      _resetTruckEntries: () => {
        patchState(store, resetTruckListUpdater());
      },
    };
  }),
  withHooks((store) => {
    return {
      onInit() {
        effect(() => {
          const { from, to } = store._filters();

          if (from || to) return;

          if (store._eventsSubscription()) return;

          store._resetTruckEntries();

          const subs = store._trucksSseService
            .connect({})
            .pipe(
              bufferTime(600),
              filter((events) => events.length > 0)
            )
            .subscribe({
              next: (events) => {
                store._processTruckEntriesEvents(events);
              },
              error: (err) => {
                console.error(err);
              },
            });

          store._connectToSSE(subs);
        });
      },
    };
  })
);
