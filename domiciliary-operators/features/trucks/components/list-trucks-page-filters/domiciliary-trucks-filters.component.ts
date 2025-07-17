import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';

import { LocationsStore } from 'app/features/locations/store/locations.store';
import { TruckState } from '../../models/truck';
import { TruckFilters } from '../../models/truck-filters';
import { CloseButtonComponent } from '@shared/components/buttons/close-button/close-button.component';
import { DomiciliaryTrucksStore } from '../../store/domiciliary-trucks.store';

@Component({
    selector: 'domiciliary-trucks-filters',
    imports: [
        ReactiveFormsModule,
        MultiSelectModule,
        InputTextModule,
        DatePickerModule,
        CloseButtonComponent,
    ],
    templateUrl: './domiciliary-trucks-filters.component.html',
})
export class DomiciliaryTrucksFiltersComponent implements OnInit {
    public locationsStore = inject(LocationsStore);
    public readonly truckStore = inject(DomiciliaryTrucksStore);
    private readonly fb = inject(FormBuilder);
    private readonly translateService = inject(TranslateService);

    public filters: FormGroup;

    constructor() {
        this.filters = this.fb.group({
            plate: [null],
            state: [[]],
            dates: [[]],
            originId: [[]],
        });
    }

    ngOnInit(): void { }

    public applyFilters(): void {
        const { plate, state, originId, dates } = this.filters.value;
        const [from, to] = dates || [];

        const filters: TruckFilters = { plate, state, originId, from, to };

        this.truckStore.setFilters(filters);
    }

    public handleFiltersClose() {
        this.truckStore.closeFilters();
    }

    public resetFilters(): void {
        this.filters.reset({ state: [], originId: [], dates: [] });
        this.truckStore.resetFilters();
    }

    get currentStateOptions() {
        return Object.values(TruckState).map(state => ({
            value: state,
            label: this.translateService.instant(`enums.truckState.${state}`),
        }));
    }
}