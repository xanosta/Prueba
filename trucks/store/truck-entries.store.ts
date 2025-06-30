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
import { bufferTime, filter, map, Subscription, switchMap, tap } from 'rxjs';

import { setBusyUpdater } from './updaters/set-busy.updater';
import { TrucksService } from '../services/trucks.service';
import { setTruckFiltersUpdater } from './updaters/set-truck-filters.updater';
import { deleteTruckUpdater } from './updaters/delete-truck.updater';
import { Truck } from '../models/truck';
import { selectedTruckGenerator } from './generators/selected-truck.generator';
import { resetTruckFiltersUpdater } from './updaters/reset-truck-filters.updater';
import { toggleTruckFiltersUpdater } from './updaters/toggle-truck-filters.updater';
import { processTruckEntryEventsUpdater } from './updaters/process-truck-entry-events.updater';
import {
  SseTruckFilters,
  TrucksSseService,
} from '../services/trucks-sse.service';
import { subscribeToEventsUpdater } from './updaters/subscribe-to-events.updater';
import { SseEvent } from '@shared/services/sse/sseEvent';
import { disconnectToSseEventsUpdater } from './updaters/disconnect-to-sse-events.updater';
import { resetTruckListUpdater } from './updaters/reset-truck-list.updater';
import { LocationsStore } from 'app/features/locations/store/locations.store';
import { PutTruckEntry } from '../services/types/putTruckEntry';
import { PostTruckEntry } from '../services/types/postTruckEntry';
import { AuthStore } from '@auth/store/auth.store';

export const TrucksEntriesStore = signalStore(
  withState(trucksEntriesSliceInitialValue),
  withProps((_) => {
    return {
      _locationsStore: inject(LocationsStore),
      _authStore: inject(AuthStore),
      _trucksService: inject(TrucksService),
      _trucksSseService: inject(TrucksSseService),
    };
  }),
  withComputed((store) => {
    return {
      trucksList: computed(() =>
        trucksListGenerator(
          Array.from(store._trucks().values()),
          store._filters(),
          store._order()
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

    const _updateTruck = rxMethod<{ id: number; values: PutTruckEntry }>(
      (input$) =>
        input$.pipe(
          tap(() => patchState(store, setBusyUpdater())),
          switchMap(({ id, values }) =>
            store._trucksService
              .updateTruck(id, values)
              .pipe(map(() => ({ id, values })))
          ),
          tap(() => {
            patchState(store, setBusyUpdater(false));
          })
        )
    );

    const _createTruck = rxMethod<PostTruckEntry>((input$) =>
      input$.pipe(
        tap(() => patchState(store, setBusyUpdater())),
        switchMap((values) =>
          store._trucksService.createTruck(values).pipe(map(() => ({ values })))
        ),
        tap(() => {
          patchState(store, setBusyUpdater(false));
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
      updateTruck: (truckEntryId: number, newValues: PutTruckEntry) => {
        _updateTruck({ id: truckEntryId, values: newValues });
      },
      createTruck: (newValues: PostTruckEntry) => {
        _createTruck(newValues);
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
        patchState(
          store,
          resetTruckListUpdater(),
          disconnectToSseEventsUpdater()
        );
      },
    };
  }),
  withHooks((store) => {
    return {
      onInit() {
        effect(() => {
          const selectedLocation = store._locationsStore.selectedLocation();
          const userToken = store._authStore.token();

          if (!selectedLocation || !userToken) return;

          const truckFilters = store._filters();
          store._resetTruckEntries();

          const parsedFilters: SseTruckFilters = {
            plate: truckFilters.plate,
            currentState: truckFilters.state,
            residueTypes: truckFilters.residueType
              ? [truckFilters.residueType]
              : undefined,
            fromDateTime: truckFilters.from,
            toDateTime: truckFilters.to,
            originLocationIds: truckFilters.originId,
            locationId: selectedLocation.locationId,
            token: userToken,
          };

          const subs = store._trucksSseService
            .connect(parsedFilters)
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
