import { Component, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

import { TrucksEntriesStore } from '../../store/truck-entries.store';
import { ListTrucksPageFiltersComponent } from '../../components/list-trucks-page-filters/list-trucks-page-filters.component';
import { PageHeaderComponent } from '../../../../../../shared/components/page-header/page-header.component';
import { EmptyPageMessageComponent } from '@shared/components/empty-page-message/empty-page-message.component';
import { TruckCardComponent } from 'app/modules/plant-operators/features/trucks/components/card/truck-card.component';
import { LoaderComponent } from '../../../../../../shared/components/loader/loader.component';
import { PlantOperatorBreadCrumbsComponent } from '../../../breadcrumbs/components/plant-operators-breadcrumbs.component';
import { TrucksActionButtonComponent } from '../../components/actions-button/actions-button.component';
import { HoppersStore } from '../../../hoppers/store/hoppers.store';
import { LocationsStore } from 'app/features/locations/store/locations.store';

@Component({
  templateUrl: './list-trucks-page.component.html',
  imports: [
    ListTrucksPageFiltersComponent,
    PageHeaderComponent,
    EmptyPageMessageComponent,
    TruckCardComponent,
    LoaderComponent,
    TranslatePipe,
    PlantOperatorBreadCrumbsComponent,
    TrucksActionButtonComponent
  ],
})
export class ListTrucksPageComponent {
  private readonly translateService = inject(TranslateService);
  private readonly messageService = inject(MessageService);

  public trucksEntriesStore = inject(TrucksEntriesStore);
  public locationsStore = inject(LocationsStore);
  public hoppersStore = inject(HoppersStore);

  handleFiltersOpen() {
    this.trucksEntriesStore.openFilters();
  }

  handleCreateTruck($event: any) {
    this.trucksEntriesStore.createTruck($event);

    this.messageService.add({
      severity: 'success',
      summary: this.translateService.instant(
        'newTruckEntry.messages.success.title'
      ),
      detail: this.translateService.instant(
        'newTruckEntry.messages.success.description'
      ),
    });
  }

  handleTruckDelete($event: number) {
    this.trucksEntriesStore.deleteTruck($event);
  }
}
