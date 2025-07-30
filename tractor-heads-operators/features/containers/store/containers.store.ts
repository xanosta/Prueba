import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { containersSliceInitialValue } from './containers.slice';
import { ContainersService } from '../services/containers.service';
import { computed, effect, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { ContainersFilters } from '../models/containers-filters.model';
import { exhaustAll, tap, map, switchMap, filter, catchError, EMPTY } from 'rxjs';
import { setContainersUpdater } from './updaters/set-containers.updater';
import { setBusyUpdater } from './updaters/set-busy.updater';
import { setContainersFiltersUpdater } from './updaters/set-containers-filters.updater';
import { pickUpListGenerator } from './generators/pick-up-list.generator';
import { ContainerPickUpViewModel } from '../view-model/container.view-model';
import { PickUpOrder } from '../models/pick-up-order.model';
import { selectContainerToSchedulePickUpContainer } from './updaters/select-container-to-schedule-pick-up.updater';
import { resetSelectedContainerUpdater } from './updaters/reset-selected-container.updater';
import { ResidueType } from '@features/residue-types/models/residue-type';
import { setLocationsUpdater } from './updaters/set-locations.updater';
import { destinationsGenerators } from './generators/destinations.generator';
import { setPaginationInfoUpdater } from './updaters/set-pagination-info.updater';
import { changeCurrentPageUpdater } from './updaters/change-current-page.updater';
import { changeRowsPerPage } from './updaters/change-rows-per-page.updater';
import { setContainerPickUpUpdater } from './updaters/set-container-pick-up.updater';
import { TractorHeadOperatorConfigStore } from 'app/modules/tractor-heads-operators/store/tractor-head-operator-config.store';
import { LocationsStore } from '@features/locations/store/locations.store';
import { toggleFiltersUpdater } from './updaters/toggle-filters.updater';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

export const ContainersStore = signalStore(
  withState(containersSliceInitialValue),
  withProps((_) => {
    return {
      _locationsStore: inject(LocationsStore),
      _containersService: inject(ContainersService),
      _tractorHeadOperatorConfigStore: inject(TractorHeadOperatorConfigStore),
      _messageService: inject(MessageService),
      _translateService: inject(TranslateService),
    };
  }),
  withComputed((store) => {
    return {
      pickUpList: computed<Array<ContainerPickUpViewModel>>(() =>
        pickUpListGenerator(
          Array.from(store._containers().values()),
          store.filters()
        )
      ),
      isSchedulePickUpModalOpen: computed<boolean>(
        () => !!store._selectedContainer()
      ),
      destinations: computed(() => destinationsGenerators(store._locations())),
      selectedContainerId: computed(
        () => store._selectedContainer()?.containerStayId
      ),
    };
  }),
  withMethods((store) => {
    const _fetchContainers = rxMethod<ContainersFilters>((input$) =>
      input$.pipe(
        filter((filters) => !!filters.locationId),
        tap(() => patchState(store, setBusyUpdater())),
        map((filters) =>
          store._containersService.getContainersWaitingForPickup({
            ...filters,
            locationId: filters.locationId!,
            offset:
              (store.filters().currentPage - 1) *
              store.paginationInfo().pageSize,
            limit: store.paginationInfo().pageSize,
          })
        ),
        exhaustAll(),
        tap((containers) => {
          const { results, ...paginationInfo } = containers;
          patchState(
            store,
            setContainersUpdater(results),
            setPaginationInfoUpdater(paginationInfo),
            setBusyUpdater(false)
          );
        })
      )
    );

    const _registerContainerPickUp = rxMethod<PickUpOrder>((input$) =>
      input$.pipe(
        tap(() => patchState(store, setBusyUpdater())),
        switchMap((pickUpOrder) => {
          return store._containersService.schedulePickUp(pickUpOrder.id, {
            scheduledDateTimeExit: pickUpOrder.scheduledExit,
            vehicleId: pickUpOrder.tractorHeadId,
            scheduledDestinationId: pickUpOrder.destinationId,
          });
        }),
        tap((result) => {
          patchState(
            store,
            setBusyUpdater(false),
            setContainerPickUpUpdater(
              result.containerStayId,
              {
                id: result.containerStayId,
                destinationId: result.containerStayId,
                scheduledExit: new Date(result.scheduledDateTimeExit),
                tractorHeadId: result.scheduledTractorHeadPlate.id,
              },
              store._tractorHeadOperatorConfigStore.locations(),
              store._tractorHeadOperatorConfigStore.tractorHeads()
            )
          );
          store._messageService.add({
            severity: 'success',
            summary: store._translateService.instant('tractorHeadOperators.messages.success.title'),
            detail: store._translateService.instant('tractorHeadOperators.messages.success.description'),
          });
        }),
        catchError((error) => {
          patchState(store, setBusyUpdater(false));
          store._messageService.add({
            severity: 'error',
            summary: store._translateService.instant('tractorHeadOperators.messages.error.title'),
            detail: store._translateService.instant('tractorHeadOperators.messages.error.description'),
          });
          return EMPTY;
        })
      )
    );

    const _loadDestinationSuggestions = rxMethod<Array<ResidueType>>((input$) =>
      input$.pipe(
        filter((_) => !!store._locationsStore.selectedLocation()),
        switchMap((residueTypes) =>
          store._containersService.getSuggestedLocations({
            originId: store._locationsStore.selectedLocation()!.locationId,
            residueType: residueTypes,
          })
        ),
        tap((result) => {
          patchState(
            store,
            setLocationsUpdater(
              result.defaultLocations || [],
              result.otherLocations
            )
          );
        })
      )
    );

    _fetchContainers(store.filters);

    return {
      setFilters: (filters: Partial<ContainersFilters>) => {
        patchState(store, setContainersFiltersUpdater(filters));
      },
      resetFilters: () => {
        patchState(store, setContainersFiltersUpdater({
          code: undefined,
          shippingState: undefined,
          containerType: undefined,
          residueType: undefined,
          locationId: undefined,
        }));
        patchState(store, { _containers: new Map() });
      },
      selectContainerToSchedulePickUp: (
        containerId: number,
        containerResidueTypes: Array<ResidueType>
      ) => {
        _loadDestinationSuggestions(containerResidueTypes);
        patchState(
          store,
          selectContainerToSchedulePickUpContainer(containerId)
        );
      },
      resetSelectedContainer: () => {
        patchState(store, resetSelectedContainerUpdater());
      },
      schedulePickUp: (pickUpOrder: PickUpOrder) => {
        _registerContainerPickUp(pickUpOrder);
      },
      changePage: (currentPage: number) => {
        patchState(store, changeCurrentPageUpdater(currentPage));
      },
      changeRowsPerPage: (rowsPerPage: number) => {
        patchState(store, changeRowsPerPage(rowsPerPage));
      },
      toggleFiltersOpen: (filtersOpen?: boolean) => {
        patchState(store, toggleFiltersUpdater(filtersOpen));
      },
    };
  })
);
