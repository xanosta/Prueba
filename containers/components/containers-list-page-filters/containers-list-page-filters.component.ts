import { Component, computed, inject, OnInit } from '@angular/core';
import { ContainersStore } from '../../store/containers.store';
import { CloseButtonComponent } from '../../../../../../shared/components/buttons/close-button/close-button.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { LocationsStore } from 'app/features/locations/store/locations.store';
import { TranslateService } from '@ngx-translate/core';
import { ContainerState } from '../../models/container-state.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { queryParamsMapper } from '@shared/utils/queryParams';
import { ContainerFilters } from '../../models/container-filters.model';
import { ResidueType } from 'app/features/residue-types/models/residue-type';

interface FiltersForm {
  containerCode: FormControl<string | null>;
  dates: FormControl<Array<Date>>;
  state: FormControl<string | null>;
  residueTypes: FormControl<Array<ResidueType>>;
  truckPlate: FormControl<string | null>;
  tractorHeadPlate: FormControl<string | null>;
  origin: FormControl<number | null>;
}

@Component({
  selector: 'plant-operators-containers-filters',
  templateUrl: './containers-list-page-filters.component.html',
  imports: [
    ReactiveFormsModule,
    CloseButtonComponent,
    MultiSelectModule,
    SelectModule,
    InputTextModule,
    DatePickerModule,
  ],
})
export class PlantOperatorsContainersFilters implements OnInit {
  public filters: FormGroup<FiltersForm>;
  public residueTypes = computed(() => {
    const selectedLocation = this.locationsStore.selectedLocation();

    if (!selectedLocation) return [];

    return selectedLocation.residueTypes.map((residueType) => ({
      label: this.translateService.instant(`enums.residueTypes.${residueType}`),
      value: residueType,
    }));
  });
  public locations = computed(() =>
    this.locationsStore.locations().map((loc) => ({
      label: loc.name,
      value: loc.locationId,
    }))
  );

  public readonly containersStore = inject(ContainersStore);
  private readonly locationsStore = inject(LocationsStore);
  private readonly translateService = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder).nonNullable;

  constructor() {
    this.filters = this.fb.group<FiltersForm>({
      containerCode: this.fb.control(''),
      dates: this.fb.control([]),
      state: this.fb.control(null),
      residueTypes: this.fb.control([]),
      truckPlate: this.fb.control(''),
      tractorHeadPlate: this.fb.control(''),
      origin: this.fb.control(null),
    });
  }

  ngOnInit(): void {
    const queryParamFilters = this.activatedRoute.snapshot.queryParamMap;

    this.mapQueryParamsToFilters(queryParamFilters);
  }

  public applyFilters(): void {
    const {
      containerCode,
      residueTypes,
      state,
      truckPlate,
      tractorHeadPlate,
      origin,
      dates,
    } = this.filters.value;
    const [from, to] = dates || [];

    const filters: ContainerFilters = {
      code: containerCode || undefined,
      residueTypes: residueTypes ?? [],
      currentState: state as ContainerState,
      truckPlate: truckPlate || undefined,
      tractorHeadPlate: tractorHeadPlate || undefined,
      residueOriginId: origin !== null ? origin?.toString() : undefined,
      fromDateTime: from,
      toDateTime: to,
    };

    this.containersStore.setFilters(filters);
    this.mapFiltersToUrl(filters);
  }

  public handleFiltersClose(): void {
    this.containersStore.closeFilters();
  }

  public resetFilters() {
    this.containersStore.resetFilters();
    this.filters.reset({});
    this.mapFiltersToUrl({});
  }

  private mapFiltersToUrl(values: any) {
    const filters = queryParamsMapper(values);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        ...filters,
      },
      queryParamsHandling: 'replace',
    });
  }

  private mapQueryParamsToFilters(queryParamFilters: ParamMap) {
    const containerCode = queryParamFilters.get('code');
    const from = queryParamFilters.get('fromDateTime');
    const to = queryParamFilters.get('toDateTime');
    const state = queryParamFilters.get('currentState');
    const residueTypes = queryParamFilters.getAll('residueTypes');
    const truckPlate = queryParamFilters.get('truckPlate');
    const tractorHeadPlate = queryParamFilters.get('tractorHeadPlate');
    const origin = queryParamFilters.get('residueOriginId');

    this.filters.patchValue({
      containerCode: containerCode || undefined,
      dates: from && to ? [new Date(from), new Date(to)] : [],
      state,
      residueTypes: residueTypes as Array<ResidueType>,
      truckPlate,
      tractorHeadPlate,
      origin: origin ? +origin : null,
    });
  }

  get containerStateOptions() {
    const options = Object.values(ContainerState);

    return options.map((opt) => ({
      label: this.translateService.instant(`enums.containerState.${opt}`),
      value: opt,
    }));
  }
}