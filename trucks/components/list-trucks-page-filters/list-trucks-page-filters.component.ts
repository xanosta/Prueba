import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { carPlateValidator } from '@shared/validators/car-plate.validator';
import { areDatetimesApartValidator } from '@shared/validators/datetime.validator';
import { TrucksEntriesStore } from '../../store/truck-entries.store';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { TruckState } from '../../models/truck';
import { LocationsStore } from 'app/features/locations/store/locations.store';
import { TruckFilters } from '../../models/truck-filters';
import { queryParamsMapper } from '@shared/utils/queryParams';
import { ResidueType } from 'app/features/residue-types/models/residue-type';
import { CloseButtonComponent } from '../../../../../../shared/components/buttons/close-button/close-button.component';

@Component({
  selector: 'plant-operators-trucks-filters',
  templateUrl: './list-trucks-page-filters.component.html',
  imports: [
    ReactiveFormsModule,
    MultiSelectModule,
    InputTextModule,
    DatePickerModule,
    CloseButtonComponent,
  ],
})
export class ListTrucksPageFiltersComponent implements OnInit {
  public locationsStore = inject(LocationsStore);
  public readonly truckStore = inject(TrucksEntriesStore);
  private readonly fb = inject(FormBuilder);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translateService = inject(TranslateService);

  public filters: FormGroup;

  constructor() {
    this.filters = this.fb.group({
      plate: [null, [carPlateValidator]],
      state: [[]],
      residueType: [],
      dates: [[], [areDatetimesApartValidator]],
      originId: [[]],
    });
  }

  ngOnInit(): void {
    const queryParamFilters = this.activatedRoute.snapshot.queryParamMap;

    this.mapQueryParamsToFilters(queryParamFilters);
  }

  public applyFilters(): void {
    const { plate, state, residueType, originId, dates } = this.filters.value;
    const [from, to] = dates || [];

    const filters: TruckFilters = {
      plate,
      state,
      residueType,
      originId,
      from,
      to,
    };

    this.truckStore.setFilters(filters);
    this.mapFiltersToQueryParams({
      plate,
      state,
      residueType,
      originId,
      from,
      to,
    });
  }

  public handleFiltersClose() {
    this.truckStore.closeFilters();
  }

  public resetFilters(): void {
    this.filters.reset({});
    this.mapFiltersToQueryParams({});
    this.truckStore.resetFilters();
  }

  private mapFiltersToQueryParams(filters: any): void {
    const mappedFilters = queryParamsMapper(filters);

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        ...mappedFilters,
      },
      queryParamsHandling: 'replace',
    });
  }

  private mapQueryParamsToFilters(queryParamMap: ParamMap) {
    const plate = queryParamMap.get('plate');
    const from = queryParamMap.get('from');
    const to = queryParamMap.get('to');
    const state = queryParamMap.getAll('state');
    const residueType = queryParamMap.get('residueType');
    const originId = queryParamMap.getAll('originId').map((id: string) => +id);

    const filtersValues = {
      plate,
      dates: from && to ? [new Date(from), new Date(to)] : [],
      state,
      originId,
      residueType,
    };

    this.filters.patchValue(filtersValues);
    this.truckStore.setFilters({
      plate: filtersValues.plate ? filtersValues.plate : undefined,
      from:
        filtersValues.dates.length === 2 ? filtersValues.dates[0] : undefined,
      to: filtersValues.dates.length === 2 ? filtersValues.dates[1] : undefined,
      state: filtersValues.state as Array<TruckState>,
      originId: filtersValues.originId,
      residueType: filtersValues.residueType as ResidueType,
    });
  }

  get currentStateOptions() {
    return [
      {
        value: TruckState.ENTRADO,
        label: this.translateService.instant('enums.truckState.ENTRADO'),
      },
      {
        value: TruckState.PESADO_EN_ENTRADA,
        label: this.translateService.instant(
          'enums.truckState.PESADO_EN_ENTRADA'
        ),
      },
      {
        value: TruckState.DESCARGANDO,
        label: this.translateService.instant('enums.truckState.DESCARGANDO'),
      },
      {
        value: TruckState.DESCARGADO,
        label: this.translateService.instant('enums.truckState.DESCARGADO'),
      },
      {
        value: TruckState.PESADO_EN_SALIDA,
        label: this.translateService.instant(
          'enums.truckState.PESADO_EN_SALIDA'
        ),
      },
      {
        value: TruckState.SALIDO,
        label: this.translateService.instant('enums.truckState.SALIDO'),
      },
    ];
  }

  get originOptions() {
    return [];
  }
}
