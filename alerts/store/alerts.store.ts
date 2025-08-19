import { computed, effect, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import {
  catchError,
  EMPTY,
  exhaustAll,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

import { alertsSliceInitialValue } from './alerts.slice';
import { generateLastAlertsViewModel } from './generators/last-alerts-view-model.generator';
import { AuthStore } from '@auth/store/auth.store';
import { AlertsSSEService } from '../services/alerts-sse.service';
import { processAlertEventUpdater } from './updaters/process-alert-event.updater';
import { Alert } from '../models/alert';
import { setBusy } from './updaters/set-busy.updater';
import { AlertsService } from '../services/alerts.service';
import { setAlerts } from './updaters/set-alerts.updater';
import { AlertFilters } from '../models/alert-filters';
import { setFiltersUpdater } from './updaters/set-filters.updater';
import { listAlertsViewModelGenerator } from './generators/list-alerts-view-model.generator';
import { generateHomeAlertsViewModel } from './generators/home-alerts-view-model.generator';
import { LocationsStore } from 'app/features/locations/store/locations.store';
import { _, TranslateService } from '@ngx-translate/core';
import { AlertDetailViewModel } from '../view-models/alert-detail.view-model';
import { generateAlertDetailViewModel } from './generators/alert-detail-view-model.generator';
import { toggleAlertFiltersUpdater } from './updaters/toggle-truck-filters.updater';
import { resetAlertFiltersUpdater } from './updaters/reset-alert-filters.updater';
import { setAlertViewedUpdater } from './updaters/set-alert-viewed.updater';
import { MessageService } from 'primeng/api';
import { mapAlertSeverityToToast } from '../utils/map-alert-severity-to-toast';
import { setSelectedAlertUpdater } from './updaters/set-selected-alert.updater';
import { areEqualsExcept } from '@shared/utils/areEqualsExcept.utils';
import { filtersOpenGenerator } from './generators/filters-open.generator';

export const AlertsStore = signalStore(
  withState(alertsSliceInitialValue),
  withProps((_) => {
    return {
      _alertsService: inject(AlertsService),
      _locationsStore: inject(LocationsStore),
      _messageService: inject(MessageService),
      _translateService: inject(TranslateService),
    };
  }),
  withComputed((store) => {
    return {
      lastAletsViewModel: computed(() =>
        generateLastAlertsViewModel(Array.from(store._alerts().values()))
      ),
      listAlertsViewModel: computed(() =>
        listAlertsViewModelGenerator(
          Array.from(store._alerts().values()),
          store._alertsFilters()
        )
      ),
      homeAlertsViewModel: computed(() =>
        generateHomeAlertsViewModel(Array.from(store._alerts().values()))
      ),
      selectedAlertViewModel: computed<AlertDetailViewModel | null>(() =>
        generateAlertDetailViewModel(
          Array.from(store._alerts().values()),
          store._selectedAlertId()
        )
      ),
      areFiltersOpen: computed<boolean>(()=>{
        return filtersOpenGenerator(store.areAlertFiltersOpen());
      })
    };
  }),
  withMethods((store) => {
    const _loadAlertsList = rxMethod<number | undefined>((input$) =>
      input$.pipe(
        tap((_) => patchState(store, setBusy())),
        filter((locationId) => locationId !== undefined),
        map((locationId) => store._alertsService.findAll(locationId)),
        exhaustAll(),
        tap((alerts) => patchState(store, setAlerts(alerts), setBusy(false)))
      )
    );

    const _setSelectedAlert = rxMethod<number | null>((input$) =>
      input$.pipe(
        tap((alertId) => patchState(store, setSelectedAlertUpdater(alertId))),
        filter((alertId) => alertId !== null),
        filter((alertId) => !store._alerts().get(alertId)?.viewed),
        switchMap((alertId) =>
          store._alertsService.alertViewed(alertId).pipe(
            tap(() => patchState(store, setAlertViewedUpdater(alertId))),
            catchError((error) => {
              console.error(error);
              return EMPTY;
            })
          )
        )
      )
    );

    return {
      _processIncomingAlert: (alert: Alert) =>
        patchState(store, processAlertEventUpdater(alert)),
      setFilters: (filters: AlertFilters) =>
        patchState(store, setFiltersUpdater(filters)),
      openFilters: () => {
        patchState(store, toggleAlertFiltersUpdater(true));
      },
      toggleFilters: ()=> {
        patchState(store, store.areAlertFiltersOpen() ? toggleAlertFiltersUpdater(false) : toggleAlertFiltersUpdater(true));
      },
      closeFilters: () => {
        patchState(store, toggleAlertFiltersUpdater(false));
      },
      resetFilters: () => {
        patchState(store, resetAlertFiltersUpdater());
      },
      _loadAlertsList,
      setSelectedAlert: (alertId: number | null) => _setSelectedAlert(alertId),
    };
  }),
  withHooks({
    onInit: (store) => {
      const authStore = inject(AuthStore);
      const alertsService = inject(AlertsSSEService);

      effect(() => {
        const userToken = authStore.token();

        if (!userToken) return;

        const selectedLocationId =
          store._locationsStore.selectedLocation()?.locationId;

        if (!selectedLocationId) return;

        const sse = alertsService.connect(userToken, selectedLocationId);

        sse.addEventListener('message', (event: MessageEvent<string>) => {
          const alert = JSON.parse(event.data) as Alert;
          store._processIncomingAlert(alert);

          if(discardIncomingEvent(alert)) return;

          // Publish a toast with the alert
          store._messageService.add({
            severity: mapAlertSeverityToToast(alert.severity),
            summary: store._translateService.instant('alert.title'),
            detail: store._translateService.instant(
              `enums.alertsTypes.${alert.alertType.alertTypeCode}`
            ),
          });
        });

        function discardIncomingEvent(alert: Alert): boolean {
          const alertStored = store._alerts().get(alert.alertId);
          if(alertStored){
            return areEqualsExcept(alertStored, alert, "viewed")
          }
          return false;
        }
      });

      effect(() => {
        const selectedLocation = store._locationsStore.selectedLocation();
        store._loadAlertsList(selectedLocation?.locationId);
      });
    },
  })
);
