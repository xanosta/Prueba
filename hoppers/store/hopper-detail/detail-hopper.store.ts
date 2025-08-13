import {
  signalStore,
  withProps,
  withState,
  withComputed,
  withMethods,
  withHooks,
  patchState,
} from '@ngrx/signals';
import {
  detailHopperEntriesSliceInitialValue,
  HopperEventsFilters,
} from './detail-hopper.slice';
import { computed, effect, inject } from '@angular/core';
import {
  HoppersSseService,
  OptionalFilters,
  RequiredFilters,
} from '../../services/hoppers-sse.service';
import { LocationsStore } from '@features/locations/store/locations.store';
import { AuthStore } from '@auth/store/auth.store';
import { bufferTime, filter, Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { subscribeToEventsUpdater } from './updaters/suscribe-to-events.updater';
import { TranslateService } from '@ngx-translate/core';
import { SseEvent } from '@shared/services/sse/sseEvent';
import { HopperEvent } from '../../models/hopper-event';
import { selectedHopperGenerator } from '../hoppers/generators/selected-hopper.generator';
import { HoppersStore } from '../hoppers/hoppers.store';
import { HopperViewModel } from '../../view-models/hopper.view-model';
import { processHoppersEventsUpdater } from './updaters/process-hopper-events.updater';
import { HopperEventViewModel } from '../../view-models/hopper-event.view-model';
import { selectedHopperEventsGenerator } from './generators/selected-hopper-events.generator';
import { setFiltersUpdater } from './updaters/set-filters.updater';
import { setSelectedHopperIdUpdater } from './updaters/set-selected-hopperId.updater';
import { setLoadingUpdater } from './updaters/set-loading.updater';
import { resetHopperEntriesUpdater } from './updaters/reset-hoppers-entries.updater';

export const DetailsHoppersStore = signalStore(
  withState(detailHopperEntriesSliceInitialValue),
  withProps((_) => {
    return {
      _authStore: inject(AuthStore),
      _locationsStore: inject(LocationsStore),
      _hoppersSseService: inject(HoppersSseService),
      _messageService: inject(MessageService),
      _translateService: inject(TranslateService),
      _hoppersStore: inject(HoppersStore),
    };
  }),
  withComputed((store) => {
    return {
      selectedHopper: computed<HopperViewModel | undefined>(() => {
        return selectedHopperGenerator(
          store._hoppersStore.hoppers(),
          store._selectedHopperId()
        );
      }),
      selectedHopperEvents: computed<Array<HopperEventViewModel>>(() =>
        selectedHopperEventsGenerator(
          Array.from(store._hopperEvents().values())
        )
      ),
    };
  }),
  withMethods((store) => {
    return {
      _connectToSSE: (subscription: Subscription) => {
        patchState(store, subscribeToEventsUpdater(subscription));
      },
      setSelectedHopper: (hopperId: number) => {
        patchState(store, setSelectedHopperIdUpdater(hopperId));
      },
      _processHopperEvents: (hopperEvents: Array<SseEvent<HopperEvent>>) => {
        patchState(store, processHoppersEventsUpdater(hopperEvents));
      },
      setHopperEventsFilters: (filters: Partial<HopperEventsFilters>) => {
        patchState(store, setFiltersUpdater(filters));
      },
      updateLoading: (isLoading: boolean) => {
        patchState(store, setLoadingUpdater(isLoading));
      },
      _resetEntries: () => {
        patchState(store, resetHopperEntriesUpdater());
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

          if (!store.selectedHopper()?.id) return;

          store._resetEntries();

          const filters: RequiredFilters & OptionalFilters = {
            locationId: selectedLocation.locationId,
            hopperId: store.selectedHopper()!.id,
            token: userToken,
          };

          if (store._filters.from) {
            filters.fromDatetime = store._filters.from();
          }

          if (store._filters.to) {
            filters.toDatetime = store._filters.to();
          }

          const subs = store._hoppersSseService
            .connect(filters)
            .pipe(
              bufferTime(600),
              filter((events) => events.length > 0)
            )
            .subscribe({
              next: (events) => {
                store._processHopperEvents(events);
                store.updateLoading(false);
              },
              error: (err) => {
                console.error(err);
                store._messageService.add({
                  severity: 'error',
                  summary: store._translateService.instant(
                    'sse.errors.fetchingError.title'
                  ),
                  detail: store._translateService.instant(
                    'sse.errors.fetchingError.description'
                  ),
                });
              },
            });

          store._connectToSSE(subs);
        });
      },
    };
  })
);
