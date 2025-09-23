import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import type { PartialStateUpdater } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tap, switchMap, pipe } from 'rxjs';
import type { Observable } from 'rxjs';
import { devicesSliceInitialValue } from './devices.slice';
import type { DevicesSlice } from './devices.slice';
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

    const createUpdateHandler = <TPayload>(
      updateFn: (id: number, payload: TPayload) => Observable<unknown>,
      onSuccess: string | ((id: number, payload: TPayload) => void),
      onError?: (error: unknown) => void
    ) =>
      (id: number, payload: TPayload) => {
        patchState(store, setBusyUpdater(true));
        updateFn(id, payload).subscribe({
          next: () => {
            if (typeof onSuccess === 'string') {
              console.log(onSuccess);
            } else {
              onSuccess(id, payload);
            }
          },
          complete: () => {
            _fetchDevices(store.filters());
          },
          error: error => {
            onError?.(error);
            patchState(store, setBusyUpdater(false));
          },
        });
      };

    const createEntityFetcher = <T>(
      serviceCall: (id: number) => Observable<T>,
      updater: (entity: T | null) => PartialStateUpdater<DevicesSlice>
    ) =>
      rxMethod<number>(
        pipe(
          tap(() => patchState(store, setBusyUpdater(true))),
          switchMap(id =>
            serviceCall(id).pipe(
              tap(entity => {
                patchState(store, updater(entity), setBusyUpdater(false));
              })
            )
          )
        )
      );

    const _getDeviceById = createEntityFetcher(
      id => store._devicesService.getDeviceById(id),
      setSelectedDeviceUpdater
    );

    const _getHopperById = createEntityFetcher(
      id => store._devicesService.getHopperById(id),
      setSelectedHopperUpdater
    );

    const _getEntryAreaById = createEntityFetcher(
      id => store._devicesService.getEntryAreaById(id),
      setSelectedEntryAreaUpdater
    );

    const _getWeighingPlatformById = createEntityFetcher(
      id => store._devicesService.getWeighingPlatformById(id),
      setSelectedWeighingPlatformUpdater
    );

    const updateDeviceHandler = createUpdateHandler<DeviceUpdateRequest>(
      (id, payload) => store._devicesService.updateDevice(id, payload),
      'Dispositivo actualizado con éxito',
      error => {
        console.error('Error al actualizar el dispositivo', error);
      }
    );

    const updateHopperHandler = createUpdateHandler(
      (id: number, payload: unknown) =>
        store._devicesService.updateHopper(id, payload),
      'Hopper actualizado con éxito',
      error => {
        console.error('Error al actualizar el hopper', error);
      }
    );

    const updateEntryAreaHandler = createUpdateHandler(
      (id: number, payload: unknown) =>
        store._devicesService.updateEntryArea(id, payload),
      'Entry Area actualizada con éxito',
      error => {
        console.error('Error al actualizar el entry area', error);
      }
    );

    const updateWeighingPlatformHandler = createUpdateHandler(
      (id: number, payload: unknown) =>
        store._devicesService.updateWeighingPlatform(id, payload),
      'Weighing Platform actualizada con éxito',
      error => {
        console.error('Error al actualizar la weighing platform', error);
      }
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
      updateDevice: updateDeviceHandler,
      updateHopper: updateHopperHandler,
      updateEntryArea: updateEntryAreaHandler,
      updateWeighingPlatform: updateWeighingPlatformHandler,
      toggleFiltersOpen: (isOpen?: boolean) => {
        patchState(store, toggleFiltersUpdater(isOpen));
      },
    };
  })
);
