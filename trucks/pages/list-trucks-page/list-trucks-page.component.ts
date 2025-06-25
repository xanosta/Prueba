import { Component, inject } from '@angular/core';
import { TrucksEntriesStore } from '../../store/truck-entries.store';
import { ListTrucksPageFiltersComponent } from '../../components/list-trucks-page-filters/list-trucks-page-filters.component';
import { CloseButtonComponent } from '@shared/components/buttons/close-button/close-button.component';
import { PageHeaderComponent } from '../../../../../../shared/components/page-header/page-header.component';
import { EmptyPageMessageComponent } from '@shared/components/empty-page-message/empty-page-message.component';
import { TruckCardComponent } from 'app/modules/plant-operators/features/trucks/components/card/truck-card.component';

@Component({
  templateUrl: './list-trucks-page.component.html',
  imports: [
    ListTrucksPageFiltersComponent,
    CloseButtonComponent,
    PageHeaderComponent,
    EmptyPageMessageComponent,
    TruckCardComponent,
  ],
})
export class ListTrucksPageComponent {
  public trucksEntriesStore = inject(TrucksEntriesStore);

  handleFiltersOpen() {
    this.trucksEntriesStore.openFilters();
  }
  public handleFiltersClose() {
    this.trucksEntriesStore.closeFilters();
  }

  handleTruckDelete($event: number) {
    this.trucksEntriesStore.deleteTruck($event);
  }
}
