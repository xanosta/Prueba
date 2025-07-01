import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TractorHeadsStore } from '../../store/tractor-heads.store';
import { LocationsStore } from 'app/features/locations/store/locations.store';
import { TractorHeadFilters } from '../../models/tractor-head-filters';
import { queryParamsMapper } from '@shared/utils/queryParams';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { TractorHeadStatus } from '../../models/tractor-head';
import { FilterFormComponent } from '@shared/components/filter-form/filter-form.component';


@Component({
    selector: 'plant-operators-tractor-heads-filters',
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        MultiSelectModule,
        DatePickerModule,
        FilterFormComponent,
    ],
    templateUrl: './list-tractor-heads-page-filters.component.html',
})
export class ListTractorHeadsPageFiltersComponent {
    public locationsStore = inject(LocationsStore);
    public readonly tractorHeadsStore = inject(TractorHeadsStore);
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly translateService = inject(TranslateService);

    public filtersForm: FormGroup;
    public areFiltersOpenSignal = this.tractorHeadsStore.areFiltersOpen;

    constructor() {
        this.filtersForm = this.fb.group({
            tractorHeadPlate: [null],
            originId: [[]],
            destinationId: [[]],
            tractorHeadStatus: [[]],
            dates: [[]],
        });
    }

    public applyFilters(): void {
        const { dates, ...otherFilters } = this.filtersForm.value;
        const [fromDateTime, toDateTime] = dates || [];
        const filters: TractorHeadFilters = { ...otherFilters, fromDateTime, toDateTime };
        this.tractorHeadsStore.setFilters(filters);
        this.mapFiltersToQueryParams(filters);
    }

    public resetFilters(): void {
        this.filtersForm.reset({});
        this.tractorHeadsStore.resetFilters();
        this.mapFiltersToQueryParams({});
    }

    public handleFiltersClose(): void {
        this.tractorHeadsStore.closeFilters();
    }

    private mapFiltersToQueryParams(filters: any): void {
        const mappedFilters = queryParamsMapper(filters);
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: mappedFilters,
            queryParamsHandling: 'replace',
        });
    }

    get statusOptions() {
        return Object.values(TractorHeadStatus).map((status) => ({
            label: this.translateService.instant(`enums.tractorHeadState.${status}`),
            value: status,
        }));
    }
}