import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

import { AlertsStore } from '../../store/alerts.store';
import { PlantOperatorBreadCrumbsComponent } from '../../../breadcrumbs/components/plant-operators-breadcrumbs.component';
import { LoaderComponent } from '../../../../../../shared/components/loader/loader.component';
import { EmptyPageMessageComponent } from '../../../../../../shared/components/empty-page-message/empty-page-message.component';
import { AlertCard } from '../../components/alert-card/alert-card.component';
import { AlertDetailDrawerComponent } from '../../components/alert-detail/alert-detail.component';
import { AlertFiltersComponent } from '../../components/alert-filters/alert-filters.component';
import { HeaderComponent } from '@shared/components/header/header.component';
import { IconComponent } from '@shared/components/icon/icon.component';

@Component({
  templateUrl: './list-alert.component.html',
  imports: [
    ReactiveFormsModule,
    PlantOperatorBreadCrumbsComponent,
    LoaderComponent,
    EmptyPageMessageComponent,
    TranslatePipe,
    AlertCard,
    AlertDetailDrawerComponent,
    AlertFiltersComponent,
    HeaderComponent,
    CommonModule,
    IconComponent
  ],
})
export class ListAlertPage {
  public readonly alertsStore = inject(AlertsStore);
  public drawerVisible = signal<boolean>(false);

  public readonly breadcrumbs = [
    { label: 'alerts', link: '/planta/alerts' }
  ];

  handleFiltersOpen() {
    this.alertsStore.toggleFilters();
  }

  public handleSelectedAlert(selectedAlertId: number): void {
    this.alertsStore.setSelectedAlert(selectedAlertId);
    this.drawerVisible.set(true);
  }

  public closeDrawer(): void {
    this.drawerVisible.set(false);
    this.alertsStore.setSelectedAlert(null);
  }
}
