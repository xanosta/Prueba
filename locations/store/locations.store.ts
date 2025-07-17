import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { computed, effect, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustAll, filter, map, tap } from 'rxjs';

import { locationsSliceInitialValue } from './locations.slice';
import { LocationsService } from '../services/locations.service';
import { setLocationUpdater } from './updaters/set-location.updater';
import { selectedLocationGenerator } from './generators/selectedLocation.generator';
import { locationsGenerator } from './generators/locations.generator';
import { AuthStore } from '@auth/store/auth.store';
import { setLocationsUpdater } from './updaters/set-locations.updater';
import { canChangeGenerator } from './generators/canChange.generator';
import {
  LocationViewModel,
  SmallLocationViewModel,
} from '../view-model/location.view-model';
import { setDefaultLocationUpdater } from './updaters/set-default-location.updater';
import { originsGenerator } from './generators/origins.generator';
import { SetOriginsUpdater } from './updaters/set-origins-updater';

const SELECTED_LOCATION_LOCAL_STORAGE_KEY = 'selectedLocationId';

export const LocationsStore = signalStore(
  { providedIn: 'root' },
  withState(locationsSliceInitialValue),
  withComputed((store) => {
    return {
      selectedLocation: computed<LocationViewModel | null>(() =>
        selectedLocationGenerator(
          store._locations(),
          store._selectedLocationId()
        )
      ),
      locations: computed<Array<LocationViewModel>>(() =>
        locationsGenerator(store._locations())
      ),
      canUserChangeLocation: computed<boolean>(() =>
        canChangeGenerator(store._locations())
      ),
      origins: computed<Array<SmallLocationViewModel>>(() =>
        originsGenerator(store._origins())
      ),
    };
  }),
  withProps((_) => {
    return {
      _locationsService: inject(LocationsService),
      _authStore: inject(AuthStore),
    };
  }),
  withMethods((store) => {
    const _loadVisibleLocations = rxMethod<Array<number>>((input$) =>
      input$.pipe(
        map((locationsIds) => store._locationsService.getAllPTs(locationsIds)),
        exhaustAll(),
        tap((locations) => {
          patchState(store, setLocationsUpdater(locations));
          patchState(store, setDefaultLocationUpdater(locations));
        })
      )
    );

    const _loadOrigins = rxMethod<number | null>((input$) =>
      input$.pipe(
        filter((locationId) => locationId !== null),
        map((locationId) =>
          store._locationsService.getAllOriginsFromDestiation(locationId)
        ),
        exhaustAll(),
        tap((locations) => patchState(store, SetOriginsUpdater(locations)))
      )
    );

    _loadVisibleLocations(store._authStore.availableLocationsIds);
    _loadOrigins(store._selectedLocationId);

    return {
      changeLocation: (newSelectedLocationId: number) =>
        patchState(store, setLocationUpdater(newSelectedLocationId)),
    };
  }),
  withHooks({
    onInit: (store) => {
      const selectedLocationId = localStorage.getItem(
        SELECTED_LOCATION_LOCAL_STORAGE_KEY
      );

      if (selectedLocationId) {
        const parsedLocation = JSON.parse(selectedLocationId);
        store.changeLocation(parsedLocation);
      } else {
        const firstLocation = store._locations().get(0);
        if (firstLocation) {
          store.changeLocation(firstLocation.locationId);
        }
      }

      effect(() => {
        const location = store.selectedLocation();
        if (location) {
          localStorage.setItem(
            SELECTED_LOCATION_LOCAL_STORAGE_KEY,
            JSON.stringify(location.locationId)
          );
        }
      });
    },
  })
);
