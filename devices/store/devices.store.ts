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
import { tap, switchMap, pipe } from 'rxjs';
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
import { DeviceUpdateRequest } from '../services/devices.service';
import { setSelectedDeviceUpdater } from './updaters/set-selected-device.updater';
import { setSelectedHopperUpdater } from './updaters/set-selected-hopper.updater';
import { setSelectedWeighingPlatformUpdater } from './updaters/set-selected-weighing-platform.updater';
import { setSelectedEntryAreaUpdater } from './updaters/set-selected-entry-area.updater';

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

    const _getDeviceById = rxMethod<number>(
      pipe(
        tap(() => patchState(store, setBusyUpdater(true))),
        switchMap(id =>
          store._devicesService.getDeviceById(id).pipe(
            tap(device => {
              patchState(store, setSelectedDeviceUpdater(device));
              patchState(store, setBusyUpdater(false));
            })
          )
        )
      )
    );

    const _getHopperById = rxMethod<number>(
      pipe(
        tap(() => patchState(store, setBusyUpdater(true))),
        switchMap(id =>
          store._devicesService.getHopperById(id).pipe(
            tap(hopper => {
              patchState(store, setSelectedHopperUpdater(hopper));
              patchState(store, setBusyUpdater(false));
            })
          )
        )
      )
    );

    const _getEntryAreaById = rxMethod<number>(
      pipe(
        tap(() => patchState(store, setBusyUpdater(true))),
        switchMap(id =>
          store._devicesService.getEntryAreaById(id).pipe(
            tap(entryArea => {
              patchState(store, setSelectedEntryAreaUpdater(entryArea));
              patchState(store, setBusyUpdater(false));
            })
          )
        )
      )
    );

    const _getWeighingPlatformById = rxMethod<number>(
      pipe(
        tap(() => patchState(store, setBusyUpdater(true))),
        switchMap(id =>
          store._devicesService.getWeighingPlatformById(id).pipe(
            tap(weighingPlatform => {
              patchState(store, setSelectedWeighingPlatformUpdater(weighingPlatform));
              patchState(store, setBusyUpdater(false));
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
      clearSelectedDevice: () => {
        patchState(store, setSelectedDeviceUpdater(null));
      },
      clearSelectedHopper: () => {
        patchState(store, setSelectedHopperUpdater(null));
      },
      clearSelectedEntryArea: () => {
        patchState(store, setSelectedEntryAreaUpdater(null));
      },
      clearSelectedWeighingPlatform: () => {
        patchState(store, setSelectedWeighingPlatformUpdater(null));
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
      getDeviceById: (id: number) => {
        _getDeviceById(id);
      },
      getHopperById: (id: number) => {
        _getHopperById(id);
      },
      getEntryAreaById: (id: number) => {
        _getEntryAreaById(id);
      },
      getWeighingPlatformById: (id: number) => {
        _getWeighingPlatformById(id);
      },
      updateDevice: (id: number, payload: DeviceUpdateRequest) => {
        patchState(store, setBusyUpdater(true));
        store._devicesService.updateDevice(id, payload).subscribe({
          next: () => {
            console.log('Dispositivo actualizado con éxito');
            _fetchDevices(store.filters());
          },
          error: err => {
            console.error('Error al actualizar el dispositivo', err);
            patchState(store, setBusyUpdater(false));
          },
        });
      },
      updateHopper: (id: number, payload: any) => {
        patchState(store, setBusyUpdater(true));
        store._devicesService.updateHopper(id, payload).subscribe({
          next: () => {
            console.log('Hopper actualizado con éxito');
            _fetchDevices(store.filters());
          },
          error: err => {
            console.error('Error al actualizar el hopper', err);
            patchState(store, setBusyUpdater(false));
          },
        });
      },
      updateEntryArea: (id: number, payload: any) => {
        patchState(store, setBusyUpdater(true));
        store._devicesService.updateEntryArea(id, payload).subscribe({
          next: () => {
            console.log('Entry Area actualizada con éxito');
            _fetchDevices(store.filters());
          },
          error: err => {
            console.error('Error al actualizar el entry area', err);
            patchState(store, setBusyUpdater(false));
          },
        });
      },
      updateWeighingPlatform: (id: number, payload: any) => {
        patchState(store, setBusyUpdater(true));
        store._devicesService.updateWeighingPlatform(id, payload).subscribe({
          next: () => {
            console.log('Weighing Platform actualizada con éxito');
            _fetchDevices(store.filters());
          },
          error: err => {
            console.error('Error al actualizar la weighing platform', err);
            patchState(store, setBusyUpdater(false));
          },
        });
      },
      toggleFiltersOpen: (isOpen?: boolean) => {
        patchState(store, toggleFiltersUpdater(isOpen));
      },
    };
  })
);
