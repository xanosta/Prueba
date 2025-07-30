import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { tractorHeadOperatorsConfigInitialValue } from './tractor-head-operator-config.slice';
import { AuthStore } from '@auth/store/auth.store';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustAll, tap, map } from 'rxjs';
import { setBusy } from './updaters/set-busy.updater';
import { LocationsService } from 'app/features/locations/services/locations.service';
import { setLocationsUpdater } from './updaters/set-locations.updater';
import { TractorHeadsService } from '../features/tractor-heads/services/tractor-heads.service';
import { setTractorHeadsUpdater } from './updaters/set-tractor-heads.updater';
import { ContainersService } from '../features/containers/services/containers.service';
import { setContainerTypes } from './updaters/set-containers-types.updater';
import { listTractorHeadsGenerator } from './generators/list-tractor-heads.generator';
import { assignedTractorHeadsGenerator } from './generators/assigned-tractor-heads.generator';

export const TractorHeadOperatorConfigStore = signalStore(
  withState(tractorHeadOperatorsConfigInitialValue),
  withProps((_) => {
    return {
      _authStore: inject(AuthStore),
      _locationService: inject(LocationsService),
      _tractorHeadsService: inject(TractorHeadsService),
      _containersService: inject(ContainersService),
    };
  }),
  withComputed((store) => {
    return {
      tractorHeadList: computed(() => {
        return listTractorHeadsGenerator(store.tractorHeads());
      }),
      assignedTractorHeads: computed(() =>
        assignedTractorHeadsGenerator(
          store.tractorHeads(),
          store._authStore.tractorHeadOperatorsAssignedVehiclesIds() || []
        )
      ),
    };
  }),
  withMethods((store) => {
    const _fetchLocations = rxMethod<void>((input$) =>
      input$.pipe(
        tap((_) => patchState(store, setBusy())),
        map((_) => store._locationService.getAll()),
        exhaustAll(),
        tap((locations) => {
          patchState(store, setLocationsUpdater(locations), setBusy(false));
        })
      )
    );

    const _fetchTractorHeads = rxMethod<void>((input$) =>
      input$.pipe(
        tap((_) => patchState(store, setBusy())),
        map((_) => store._tractorHeadsService.getAll()),
        exhaustAll(),
        tap((tractorHeads) => {
          patchState(
            store,
            setTractorHeadsUpdater(tractorHeads),
            setBusy(false)
          );
        })
      )
    );

    const _fetchContainerTypes = rxMethod<void>((input$) =>
      input$.pipe(
        tap((_) => patchState(store, setBusy())),
        map((_) => store._containersService.getContainersTypes()),
        exhaustAll(),
        tap((containerTypes) => {
          patchState(store, setContainerTypes(containerTypes), setBusy(false));
        })
      )
    );

    _fetchLocations();
    _fetchTractorHeads();
    _fetchContainerTypes();

    return {};
  })
);
