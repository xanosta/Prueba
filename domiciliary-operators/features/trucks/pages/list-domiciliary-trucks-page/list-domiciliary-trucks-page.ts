import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { EmptyPageMessageComponent } from '@shared/components/empty-page-message/empty-page-message.component';
import { LoaderComponent } from '../../../../../../shared/components/loader/loader.component';
import { DomiciliaryTrucksStore } from '../../store/domiciliary-trucks.store';
import { DomiciliaryTrucksFiltersComponent } from '../../components/list-trucks-page-filters/domiciliary-trucks-filters.component';
import { DomiciliaryTruckCardComponent } from '../../components/card/domiciliary-truck-card.component';
import { DomiciliaryTruckValidationModalComponent } from '../../components/validation-modal/validation-modal.component';
import { HeaderComponent } from '@shared/components/header/header.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { CommonModule } from '@angular/common';

@Component({
    templateUrl: './list-domiciliary-trucks-page.html',
    imports: [
        DomiciliaryTrucksFiltersComponent,
        EmptyPageMessageComponent,
        LoaderComponent,
        TranslatePipe,
        DomiciliaryTruckCardComponent,
        DomiciliaryTruckValidationModalComponent,
        HeaderComponent,
        IconComponent,
        CommonModule
    ],
})
export class ListDomiciliaryTrucksPageComponent {
    public readonly trucksStore = inject(DomiciliaryTrucksStore);

    handleFiltersOpen() {
        this.trucksStore.openFilters();
    }

    handleTruckValidate($event: number) {
        this.trucksStore.setSelectedTruck($event);
    }
}