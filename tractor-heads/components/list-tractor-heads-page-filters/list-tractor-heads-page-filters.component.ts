import { Component, inject, OnInit } from '@angular/core';
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

@Component({
    selector: 'plant-operators-tractor-heads-filters',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        MultiSelectModule,
        DatePickerModule,
    ],
    templateUrl: './list-tractor-heads-page-filters.component.html',
})
export class ListTractorHeadsPageFiltersComponent implements OnInit {
    public locationsStore = inject(LocationsStore);
    private readonly tractorHeadsStore = inject(TractorHeadsStore);
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly translateService = inject(TranslateService);

    public filtersForm: FormGroup;

    constructor() {
        this.filtersForm = this.fb.group({
            tractorHeadPlate: [null],
            originId: [[]],
            destinationId: [[]],
            tractorHeadStatus: [[]],
            dates: [[]],
        });
    }

    ngOnInit(): void {
        // Aquí iría la lógica para inicializar filtros desde queryParams si fuera necesario.
    }

    public applyFilters(): void {
        const { dates, ...otherFilters } = this.filtersForm.value;
        const [from, to] = dates || [];

        const filters: TractorHeadFilters = {
            ...otherFilters,
            from,
            to,
        };

        this.tractorHeadsStore.setFilters(filters);
        this.mapFiltersToQueryParams(filters);
    }

    public resetFilters(): void {
        this.filtersForm.reset({});
        this.tractorHeadsStore.resetFilters();
        this.mapFiltersToQueryParams({});
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
        return Object.values(TractorHeadStatus).map(status => ({
            label: this.translateService.instant(`enums.tractorHeadStatus.${status}`),
            value: status,
        }));
    }
}