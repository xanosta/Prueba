import { Component, inject, input, numberAttribute } from '@angular/core';
import { TrucksEntriesStore } from '../../store/truck-entries.store';
import { PageHeaderComponent } from '../../../../../../shared/components/page-header/page-header.component';
import { InfoMiniCard } from '../../../../../../shared/components/info-mini-card/info-mini-card.component';
import { TranslatePipe } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { UpdateFormComponent } from '../../components/forms/update-form/update-form.component';

@Component({
  templateUrl: './detail-truck-page.component.html',
  imports: [
    DatePipe,
    TranslatePipe,
    PageHeaderComponent,
    InfoMiniCard,
    UpdateFormComponent,
  ],
})
export class DetailTruckPage {
  public readonly trucksEntriesStore = inject(TrucksEntriesStore);
  readonly id = input.required({ transform: numberAttribute });

  constructor() {
    this.trucksEntriesStore.setSelectedTruck(this.id);
  }
}
