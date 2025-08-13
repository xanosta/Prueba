import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { hoppersSliceInitialValue } from './hoppers.slice';
import { computed, effect, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustAll, filter, map, tap } from 'rxjs';
import { HoppersService } from '../../services/hoppers.service';
import { setLocationHoppersUpdater } from './updaters/set-location-hoppers.updater';
import { locationHopperGenerator } from './generators/location-hoppers.generator';
import { LocationsStore } from 'app/features/locations/store/locations.store';

export const HoppersStore = signalStore(
  withState(hoppersSliceInitialValue),
  withProps((_) => {
    return {
      _locationsStore: inject(LocationsStore),
      _hoppersService: inject(HoppersService),
    };
  }),
  withComputed((store) => {
    return {
      locationHoppers: computed(() =>
        locationHopperGenerator(store.hoppers())
      )
    };
  }),
  withMethods((store) => {
    const _getAllLocationHoppers = rxMethod<number | null>((input$) =>
      input$.pipe(
        filter((locationId) => !!locationId),
        map((locationId) =>
          store._hoppersService.getAllFromLocation(locationId!)
        ),
        exhaustAll(),
        tap((locationHoppers) =>
          patchState(store, setLocationHoppersUpdater(locationHoppers))
        )
      )
    );

    _getAllLocationHoppers(store._locationsStore.selectedLocationId);

    return {};
  })
);
