import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { DatePicker } from 'primeng/datepicker';

import { areDatetimesApartValidator } from '@shared/validators/datetime.validator';

import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { SmallHopper } from '../../models/hopper';
import { DetailsHoppersStore } from '../../store/hopper-detail/detail-hopper.store';
import { HopperEventsFilters } from '../../store/hopper-detail/detail-hopper.slice';

interface Filters {
  hopper?: SmallHopper;
  dates: Array<Date>;
}

@Component({
  selector: 'plant-operator-hoppers-detail-filters',
  templateUrl: './detail-hopper-filters.component.html',
  imports: [
    CommonModule,
    FormsModule,
    DatePicker,
    TranslateModule,
    FloatLabelModule,
    SelectModule,
    ButtonModule,
    ReactiveFormsModule,
  ],
})
export class HoppersDetailFiltersComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly detailHoppersStore = inject(DetailsHoppersStore);
  private readonly translateService = inject(TranslateService);
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);

  public filters: FormGroup = this.fb.group({
    dates: [[], [areDatetimesApartValidator]],
  });

  ngOnInit(): void {
    this.initializeFilters();
  }

  private initializeFilters(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const fromDatetimeFilter = params.get('from');
      const toDatetimeFilter = params.get('to');

      let datesFilter: Array<Date> = [];
      if (fromDatetimeFilter && toDatetimeFilter) {
        datesFilter = [
          new Date(fromDatetimeFilter),
          new Date(toDatetimeFilter),
        ];

        this.detailHoppersStore.updateLoading(true);
      }

      const currentFilters: Filters = {
        dates: datesFilter,
      };

      this.detailHoppersStore.setHopperEventsFilters(
        this.fromPageFilterToServiceFilters(currentFilters)
      );

      this.filters.patchValue(currentFilters);
    });
  }

  public handleFiltersApply() {
    this.applyFilters(this.filters.value);
  }

  private fromPageFilterToServiceFilters(
    filters: Filters
  ): Partial<HopperEventsFilters> {
    const params: Partial<HopperEventsFilters> = {};

    if (filters.dates.length === 2) {
      const [from, to] = filters.dates;

      if (from && to) {
        params.from = from.toISOString();
        params.to = to.toISOString();
      }
    }
    return params;
  }

  private haveFiltersErrors(): boolean {
    let result = false;

    if (this.filters.controls['dates'].errors !== null) {
      result = true;
      this.messageService.add({
        summary: this.translateService.instant('hoppers.errors.notFound.title'),
        detail: this.translateService.instant(
          'hoppers.errors.notFound.description'
        ),
        severity: 'error',
      });
    }

    return result;
  }

  public canBeFiltersCleared(): boolean {
    return this.filters.touched || this.filters.dirty;
  }

  public handleFiltersReset() {
    this.filters.patchValue({
      hopper: [],
      dates: [],
    });

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
    });
  }

  private applyFilters(filters: Filters): void {
    if (filters.dates.length > 0) {
      const [from, to] = filters.dates;

      if (!from || !to) return;
    }

    if (this.haveFiltersErrors()) return;

    const params = this.fromPageFilterToServiceFilters(filters);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { ...params },
      queryParamsHandling: 'replace',
    });
  }
}
