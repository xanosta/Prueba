import { Component, inject } from '@angular/core';
import { TractorHeadsStore } from '../../store/tractor-heads.store';
import { ListTractorHeadsPageFiltersComponent } from '../../components/list-tractor-heads-page-filters/list-tractor-heads-page-filters.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { EmptyPageMessageComponent } from '@shared/components/empty-page-message/empty-page-message.component';
import { CloseButtonComponent } from '@shared/components/buttons/close-button/close-button.component';
import { TractorHeadCardComponent } from '../../components/card/tractor-head-card.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TractorHeadOrder, TractorHeadOrderBy, OrderDirection } from '../../models/tractor-head-orders';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
    standalone: true,
    templateUrl: './list-tractor-heads-page.component.html',
    imports: [
        PageHeaderComponent,
        EmptyPageMessageComponent,
        CloseButtonComponent,
        ListTractorHeadsPageFiltersComponent,
        TractorHeadCardComponent,
        DropdownModule,
        FormsModule,
        LoaderComponent,
        TranslatePipe
    ],
})
export class ListTractorHeadsPageComponent {
    public tractorHeadsStore = inject(TractorHeadsStore);

    public sortOptions: any[];
    public selectedSort: string;

    constructor() {
        this.sortOptions = [
            { label: 'Fecha de entrada (desc)', value: 'ARRIVAL_desc' },
            { label: 'Fecha de entrada (asc)', value: 'ARRIVAL_asc' },
            { label: 'Fecha de salida (desc)', value: 'EXIT_desc' },
            { label: 'Fecha de salida (asc)', value: 'EXIT_asc' },
        ];
        // Inicializar el valor seleccionado basado en el store
        const currentOrder = this.tractorHeadsStore.order();
        this.selectedSort = `${currentOrder.by}_${currentOrder.direction}`;
    }

    handleFiltersOpen(): void {
        this.tractorHeadsStore.openFilters();
    }

    handleFiltersClose(): void {
        this.tractorHeadsStore.closeFilters();
    }

    handleSortChange(event: any): void {
        const [by, direction] = event.value.split('_');
        const newOrder: TractorHeadOrder = {
            by: TractorHeadOrderBy[by as keyof typeof TractorHeadOrderBy],
            direction: direction as OrderDirection
        };
        this.tractorHeadsStore.setOrder(newOrder);
    }
}