import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';

import { areDatetimesApartValidator } from '@shared/validators/datetime.validator';
import { queryParamsMapper } from '@shared/utils/queryParams';
import { CloseButtonComponent } from '../../../../../../shared/components/buttons/close-button/close-button.component';
import { AlertsStore } from '../../store/alerts.store';
import { AlertFilters } from '../../models/alert-filters';
import { carPlateValidator } from '@shared/validators/car-plate.validator';
import { AlertTypeCode } from '../../models/alert-type';
import { SeverityType } from '@alerts/types/severity.type';

@Component({
  selector: 'plant-operators-alert-filters',
  templateUrl: './alert-filters.component.html',
  imports: [
    ReactiveFormsModule,
    MultiSelectModule,
    InputTextModule,
    DatePickerModule,
    CloseButtonComponent,
    TranslateModule
  ],
})
export class AlertFiltersComponent implements OnInit {
  public readonly alertsStore = inject(AlertsStore);
  private readonly translateService = inject(TranslateService);
  private readonly fb = inject(FormBuilder);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public filters: FormGroup;

  constructor() {
    this.filters = this.fb.group({
      alertType: [[]],
      severity: [[]],
      vehicle: [null, [carPlateValidator]],
      container: [],
      dates: [[], [areDatetimesApartValidator]],
    });
  }

  ngOnInit(): void {
    const queryParamFilters = this.activatedRoute.snapshot.queryParamMap;

    this.mapQueryParamsToFilters(queryParamFilters);
  }

  public applyFilters(): void {
    const { alertType, severity, vehicle, container, dates } = this.filters.value;
    const [from, to] = dates || [];

    const filters: AlertFilters = {
      alertType,
      severity,
      vehicle,
      container,
      from,
      to
    };

    this.alertsStore.setFilters(filters);
    this.mapFiltersToQueryParams({
      alertType,
      severity,
      vehicle,
      container,
      from,
      to
    });
  }

  public handleFiltersClose() {
    this.alertsStore.closeFilters();
  }

  public resetFilters(): void {
    this.filters.reset({});
    this.mapFiltersToQueryParams({});
    this.alertsStore.resetFilters();
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
    const alertType = queryParamMap.getAll('alertType');
    const severity = queryParamMap.getAll('severity');
    const vehicle = queryParamMap.get('vehicle');
    const container = queryParamMap.get('container');
    const from = queryParamMap.get('from');
    const to = queryParamMap.get('to');

    const filtersValues = {
      alertType,
      severity,
      vehicle,
      container,
      dates: from && to ? [new Date(from), new Date(to)] : []
    };

    this.filters.patchValue(filtersValues);
    this.alertsStore.setFilters({
      alertType: filtersValues.alertType as Array<AlertTypeCode>,
      severity: filtersValues.severity as Array<SeverityType>,
      vehicle: filtersValues.vehicle || undefined,
      container: filtersValues.container || undefined,
      from: filtersValues.dates.length === 2 ? filtersValues.dates[0] : undefined,
      to: filtersValues.dates.length === 2 ? filtersValues.dates[1] : undefined,
    });
  }

   get alertTypesOptions() {
    return Object.values(AlertTypeCode).map(alertType => ({
      value: alertType,
      label: this.translateService.instant(`enums.alertsTypes.${alertType}`)
    }));
  }

  get severityOptions() {
    return Object.values(SeverityType).map(severity => ({
      value: severity,
      label: this.translateService.instant(`enums.alertsSeverities.${severity}`)
    }));
  }
}
