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
import { tap, switchMap, catchError, Observable } from 'rxjs';
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
import { DevicesResponse, Zone } from '../models/device.model';
import { AddZonePayload } from '../models/add-zone.model';
import { EMPTY } from 'rxjs';
import { addZoneUpdater } from './updaters/add-zone.updater';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

export const DevicesStore = signalStore(
  withState(devicesSliceInitialValue),
  withProps(() => ({
    _devicesService: inject(DevicesService),
    _messageService: inject(MessageService),
    _translateService: inject(TranslateService),
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

    const _addZone = rxMethod<AddZonePayload>(payload$ =>
      payload$.pipe(
        tap(() => patchState(store, setBusyUpdater(true))),
        switchMap(payload => {
          const { name, locationId, areaType } = payload;
          let request$: Observable<Zone>;

          switch (areaType) {
            case 'ENTRY_AREA':
              request$ = store._devicesService.addEntryArea({
                name,
                locationId,
                plateReaderDevice: null,
                rfidReaderDevice: null,
                ignoreEntry: true,
              });
              break;
            case 'WEIGHING_PLATFORM':
              request$ = store._devicesService.addWeighingPlatform({
                name,
                locationId,
                rfidReaderDevice: null,
                scaleDeviceId: null,
                entryColumnDevice: null,
                exitColumnDevice: null,
                hopperId: null,
              });
              break;
            case 'HOPPER':
              request$ = store._devicesService.addHopper({
                name,
                locationId,
                containerRfidDevice: null,
                truckRfidDevice: null,
                hopperType: null,
              });
              break;
            default:
              return EMPTY;
          }

          return request$.pipe(
            tap(newZone => {
              patchState(store, addZoneUpdater(newZone));
              console.log('área añadida');
              store._messageService.add({
                severity: 'success',
                summary: store._translateService.instant(
                  'admin.devices.messages.addZoneSuccess.title'
                ),
                detail: store._translateService.instant(
                  'admin.devices.messages.addZoneSuccess.description'
                ),
              });
            }),
            catchError(err => {
              console.error('Error al añadir la zona:', err);
              store._messageService.add({
                severity: 'error',
                summary: store._translateService.instant(
                  'admin.devices.messages.addZoneError.title'
                ),
                detail: store._translateService.instant(
                  'admin.devices.messages.addZoneError.description'
                ),
              });
              return EMPTY;
            })
          );
        }),
        tap(() => patchState(store, setBusyUpdater(false)))
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
      addZone: (payload: AddZonePayload) => {
        _addZone(payload);
      },
    };
  })
);
