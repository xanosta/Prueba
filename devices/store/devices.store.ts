import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tap, switchMap } from 'rxjs';
import { devicesSliceInitialValue } from './devices.slice';
import { DevicesService } from '../services/devices.service';
import { setBusyUpdater } from './updaters/set-busy.updater';
import { setDevicesUpdater } from './updaters/set-devices.updater';
import { setPaginationInfoUpdater } from './updaters/set-pagination-info.updater';
import { devicesTreeGenerator } from './generators/devices-tree.generator';
import { DevicesFilters } from '../models/device-filters.model';
import { setDevicesFiltersUpdater } from './updaters/set-devices-filters.updater';
import { changeCurrentPageUpdater } from './updaters/change-current-page.updater';
import { toggleFiltersUpdater } from './updaters/toggle-filters.updater';
import { DevicesResponse } from '../models/device.model';

export const DevicesStore = signalStore(
  withState(devicesSliceInitialValue),
  withProps(() => ({
    _devicesService: inject(DevicesService),
  })),
  withComputed(store => ({
    devicesTree: computed(() => devicesTreeGenerator(store._locations())),
  })),
  withMethods(store => {
    const _fetchDevices = rxMethod<DevicesFilters>(filters$ =>
      filters$.pipe(
        tap(() => patchState(store, setBusyUpdater(true))),
        switchMap(filters =>
          store._devicesService.getDevices(filters).pipe(
            tap((response: DevicesResponse) => {
              const { data, ...paginationInfo } = response;
              patchState(
                store,
                setDevicesUpdater(data.locations),
                setPaginationInfoUpdater(paginationInfo),
                setBusyUpdater(false)
              );
            })
          )
        )
      )
    );

    _fetchDevices(store.filters);

    return {
      reloadDevices: () => {
        _fetchDevices(store.filters());
      },
      setFilters: (filters: Partial<DevicesFilters>) => {
        patchState(store, setDevicesFiltersUpdater(filters));
        _fetchDevices(store.filters());
      },
      resetFilters: () => {
        patchState(
          store,
          setDevicesFiltersUpdater({
            locationId: undefined,
            locationName: undefined,
            areaType: undefined,
            deviceType: undefined,
          })
        );
        _fetchDevices(store.filters());
      },
      changePage: (currentPage: number) => {
        patchState(store, changeCurrentPageUpdater(currentPage));
        _fetchDevices(store.filters());
      },
      toggleFiltersOpen: (isOpen?: boolean) => {
        patchState(store, toggleFiltersUpdater(isOpen));
      },
    };
  })
);
