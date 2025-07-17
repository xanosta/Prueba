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
import { bufferTime, EMPTY, filter, map, Subscription, switchMap, tap } from 'rxjs';

import { domiciliaryTrucksInitialValue, DomiciliaryTrucksSlice } from './domiciliary-trucks.slice';
import { TruckFilters } from '../models/truck-filters';
import { trucksListGenerator } from './generators/trucks-list.generator';
import { SseEvent } from '@shared/services/sse/sseEvent';
import { Truck } from '../models/truck';
import { SseTruckFilters, TrucksSseService } from 'app/modules/plant-operators/features/trucks/services/trucks-sse.service';
import { AuthStore } from '@auth/store/auth.store';
import { LocationsStore } from 'app/features/locations/store/locations.store';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

import { setUpdateStatusUpdater } from './updaters/set-update-status.updater';
import { processTruckEntryEventsUpdater } from './updaters/process-truck-entry-events.updater';
import { setSelectedTruckUpdater } from './updaters/set-selected-truck.updater';
import { subscribeToEventsUpdater } from './updaters/subscribe-to-events.updater';
import { resetTruckListUpdater } from './updaters/reset-truck-list.updater';
import { disconnectToSseEventsUpdater } from './updaters/disconnect-to-sse-events.updater';
import { setTruckFiltersUpdater } from './updaters/set-truck-filters.updater';
import { resetTruckFiltersUpdater } from './updaters/reset-truck-filters.updater';
import { toggleTruckFiltersUpdater } from './updaters/toggle-truck-filters.updater';
import { validationModalOpenGenerator } from './generators/validation-modal-open.generator';
import { selectedDomiciliaryTruckGenerator } from './generators/selected-domiciliary-truck.generator';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { PutTruckEntry } from 'app/modules/plant-operators/features/trucks/services/types/putTruckEntry';
import { setBusyUpdater } from './updaters/set-busy.updater';
import { TrucksService } from 'app/modules/plant-operators/features/trucks/services/trucks.service';


export const DomiciliaryTrucksStore = signalStore(
    withState(domiciliaryTrucksInitialValue),
    withProps((_) => ({
        _locationsStore: inject(LocationsStore),
        _authStore: inject(AuthStore),
        _trucksSseService: inject(TrucksSseService),
        _trucksService: inject(TrucksService),
        _messageService: inject(MessageService),
        _translateService: inject(TranslateService),
    })),
    withComputed((store) => ({
        trucksList: computed(() =>
            trucksListGenerator(
                Array.from(store._trucks().values()),
                store._filters(),
                store._order()
            )
        ),
        selectedTruck: computed(() => {
            if (!store._selectedTruckId()) return;

            return selectedDomiciliaryTruckGenerator(
                Array.from(store._trucks().values()),
                store._selectedTruckId()
            );
        }),
        isValidationModalOpen: computed(() => {
            return validationModalOpenGenerator(store._selectedTruckId());
        })
    })),
    withMethods((store) => {
        const _updateTruck = rxMethod<{ id: number; values: PutTruckEntry }>(
            (input$) =>
                input$.pipe(
                    tap(() => patchState(store, setBusyUpdater())),
                    switchMap(({ id, values }) =>
                        store._trucksService
                            .updateTruck(id, values)
                            .pipe(
                                map((response) => ({ id, values, response })),
                            )
                    ),
                    tap((data) => {
                        const response = data.response as any;

                        if (!response.validated) {
                            patchState(store, setBusyUpdater(false), setUpdateStatusUpdater(false));

                            store._messageService.add({
                                severity: 'error',
                                summary: store._translateService.instant(
                                    'truck.messages.updateError.title'
                                ),
                                detail: store._translateService.instant(
                                    'truck.messages.updateError.description'
                                ),
                            });
                        } else {
                            patchState(store, setBusyUpdater(false), setUpdateStatusUpdater(true));

                            store._messageService.add({
                                severity: 'success',
                                summary: store._translateService.instant(
                                    'truck.messages.update.title'
                                ),
                                detail: store._translateService.instant(
                                    'truck.messages.update.description'
                                ),
                            });
                        }
                    }),
                )
        );

        return {
            _processTruckEntriesEvents: (truckEntries: Array<SseEvent<Truck>>) => {
                patchState(store, processTruckEntryEventsUpdater(truckEntries));
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
            setFilters: (filters: TruckFilters) => {
                patchState(store, setTruckFiltersUpdater(filters));
            },
            resetFilters: () => {
                patchState(store, resetTruckFiltersUpdater());
            },
            openFilters: () => {
                patchState(store, toggleTruckFiltersUpdater(true));
            },
            closeFilters: () => {
                patchState(store, toggleTruckFiltersUpdater(false));
            },
            setSelectedTruck: signalMethod<number>((truckId) => {
                patchState(store, setSelectedTruckUpdater(truckId));
            }),
            deSelectTruck: () => {
                patchState(store, setSelectedTruckUpdater());
            },
            updateTruck: (truckEntryId: number, newValues: PutTruckEntry) => {
                _updateTruck({ id: truckEntryId, values: newValues });
            },
            resetUpdateStatus: () => {
                patchState(store, setUpdateStatusUpdater(null));
            }
        }
    }),
    withHooks((store) => ({
        onInit() {

            effect(() => {
                const selectedLocation = store._locationsStore.selectedLocation();
                const userToken = store._authStore.token();
                const truckFilters = store._filters();

                if (!selectedLocation || !userToken) return;

                store._resetTruckEntries();


                const sseFilters: SseTruckFilters = {
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
                    .connect(sseFilters)
                    .pipe(
                        bufferTime(600),
                        filter((events) => events.length > 0)
                    )
                    .subscribe({
                        next: (events) => store._processTruckEntriesEvents(events),
                        error: (err) => {
                            console.error(err);
                            store._messageService.add({
                                severity: 'error',
                                summary: store._translateService.instant('sse.errors.fetchingError.title'),
                                detail: store._translateService.instant('sse.errors.fetchingError.description'),
                            });
                        },
                    });

                store._connectToSSE(subs);
            });
        },
    }))
);
