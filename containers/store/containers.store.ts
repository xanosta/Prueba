import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { containersStateInitialValue } from './containers.slice';
import { ContainersSseService } from '../services/containers-sse.service';
import { computed, effect, inject } from '@angular/core';
import { AuthStore } from '@auth/store/auth.store';
import { LocationsStore } from 'app/features/locations/store/locations.store';
import { catchError, EMPTY } from 'rxjs';
import { ContainerViewModel } from '../view-models/container.view-model';
import { containerListGenerator } from './generators/container-list.generator';
import { ContainerFilters } from '../models/container-filters.model';
import { setFiltersUpdater } from './updaters/set-filters.updater';
import { setFiltersOpenUpdater } from './updaters/set-filters-open.updater';
import { resetFiltersUpdate } from './updaters/reset-filters.updater';
import { resetContainersUpdater } from './updaters/reset-containers.updater';
import { ContainerSseFilters } from '../services/types/containers-sse-filters';
import { bufferTime, filter, Subscription, switchMap, tap } from 'rxjs';
import { SseEvent } from '@shared/services/sse/sseEvent';
import { Container } from '../models/container.model';
import { processContainersEventsUpdater } from './updaters/process-containers-events.updater';
import { saveContainerSseSubsriptionUpdater } from './updaters/save-containers-sse-subscription.updater';
import { disconnectFromSseUpdater } from './updaters/disconnect-from-sse.updater';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { containerDetailGenerator } from './generators/container-detail.generator';
import { ContainersService } from '../services/containers.service';
import { setSelectedContainerUpdater } from './updaters/set-selected-container.updater';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { filtersOpenGenerator } from './generators/filters-open.generator';
import { PutContainerUnloadedWeight } from '../services/types/put-container-unloaded-weight';

export const ContainersStore = signalStore(
  withState(containersStateInitialValue),
  withProps(() => {
    return {
      _authStore: inject(AuthStore),
      _locationsStore: inject(LocationsStore),
      _containersSseService: inject(ContainersSseService),
      _containersService: inject(ContainersService),
      _messageService: inject(MessageService),
      _translateService: inject(TranslateService),
    };
  }),
  withComputed((store) => {
    return {
      containers: computed<Array<ContainerViewModel>>(() =>
        containerListGenerator(Array.from(store._containers().values()))
      ),
      selectedContainer: computed(() =>
        containerDetailGenerator(store._selectedContainer())
      ),
      areFiltersOpen: computed<boolean>(() => {
        return filtersOpenGenerator(store.areFiltersOpen());
      })
    };
  }),
  withMethods((store) => {
    const setSelectedContainer = rxMethod<number | undefined>((input$) =>
      input$.pipe(
        filter((id) => !!id),
        switchMap((containerId) =>
          store._containersService.getContainerById(containerId!)
        ),
        tap((container) =>
          patchState(store, setSelectedContainerUpdater(container))
        )
      )
    );


    const updateUnloadedWeight = rxMethod<{ payload: PutContainerUnloadedWeight; containerId: number }>(
      (input$) =>
        input$.pipe(
          switchMap(({ payload, containerId }) =>
            store._containersService.updateUnloadedWeight(payload).pipe(
              tap(() => {
                store._messageService.add({
                  severity: 'success',
                  summary: store._translateService.instant('container.messages.update.success.title'),
                  detail: store._translateService.instant('container.messages.update.success.description'),
                });

                setSelectedContainer(containerId);
              }),
              catchError((err) => {
                console.error(err);
                store._messageService.add({
                  severity: 'error',
                  summary: store._translateService.instant('container.messages.update.error.title'),
                  detail: store._translateService.instant('container.messages.update.error.description'),
                });
                return EMPTY;
              })
            )
          )
        )
    );


    return {
      setFilters: (filters: ContainerFilters) => {
        patchState(store, setFiltersUpdater(filters));
      },
      openFilters: () => {
        patchState(store, setFiltersOpenUpdater(true));
      },
      closeFilters: () => {
        patchState(store, setFiltersOpenUpdater(false));
      },
      resetFilters: () => {
        patchState(store, resetFiltersUpdate());
      },
      toggleFilters: () => {
        patchState(store, store.areFiltersOpen() ? setFiltersOpenUpdater(false) : setFiltersOpenUpdater(true));
      },
      _processContainersEvents: (events: Array<SseEvent<Container>>) => {
        patchState(store, processContainersEventsUpdater(events));
      },
      _resetContainers: () => {
        patchState(store, resetContainersUpdater());
      },
      _saveSseSubscription: (subs: Subscription) => {
        patchState(store, saveContainerSseSubsriptionUpdater(subs));
      },
      _disconnectFromSse: () => {
        patchState(store, disconnectFromSseUpdater());
      },
      setSelectedContainer,
      updateUnloadedWeight,
    };
  }),
  withHooks((store) => {
    return {
      onInit: () => {
        effect(() => {
          const token = store._authStore.token();
          const selectedLocation = store._locationsStore.selectedLocation();

          if (!token || !selectedLocation) return;

          store._disconnectFromSse();
          store._resetContainers();

          const filters: ContainerSseFilters = {
            ...store._filters(),
            token,
            locationId: selectedLocation.locationId,
          };

          const subs = store._containersSseService
            .connect(filters)
            .pipe(
              bufferTime(600),
              filter((events) => events.length > 0)
            )
            .subscribe({
              next: (events) => {
                store._processContainersEvents(events);
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

          store._saveSseSubscription(subs);
        });
      },
    };
  })
);
