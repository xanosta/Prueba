import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TractorHeadOperatorConfigStore } from 'app/modules/tractor-heads-operators/store/tractor-head-operator-config.store';
import { PageLayoutComponent } from '../../../../../../shared/pages/page-layout/page-layout.component';
import { ContainersStore } from '../../store/containers.store';
import { TractorHeadOperatorsContainerCardComponent } from '../../components/tractor-head-container-card/tractor-head-operators-container-card.component';
import { DialogModule } from 'primeng/dialog';
import { ContainerPickUpViewModel } from '../../view-model/container.view-model';
import { ScheduleContainerPickUpFormComponent } from '../../components/forms/schedule-container-pick-up-form/schedule-container-pick-up-form.component';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TractorHeadViewModel } from 'app/modules/tractor-heads-operators/view-models/tractor-head.view-model';
import { LocationViewModel } from '@features/locations/view-model/location.view-model';
import { ListContainerPageFilter } from '../../components/list-container-page-filters/list-container-page-filters.component';
import { HeaderComponent } from '@shared/components/header/header.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { EmptyPageMessageComponent } from '@shared/components/empty-page-message/empty-page-message.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  templateUrl: './containers-page.component.html',
  imports: [
    TractorHeadOperatorsContainerCardComponent,
    DialogModule,
    ScheduleContainerPickUpFormComponent,
    PaginatorModule,
    CommonModule,
    ListContainerPageFilter,
    HeaderComponent,
    TranslateModule,
    IconComponent,
    EmptyPageMessageComponent
  ],
  providers: [ContainersStore],
})
export class ContainersPageComponent {
  public readonly tractorHeadConfigStore = inject(
    TractorHeadOperatorConfigStore
  );
  public readonly containersStore = inject(ContainersStore);

  public availableTractorHeads = computed(() => ({
    suggestions: this.tractorHeadConfigStore.assignedTractorHeads(),
    others: this.tractorHeadConfigStore.tractorHeadList(),
  }));

  public selectedContainer = computed(() => {
    const selectedId = this.containersStore.selectedContainerId();
    if (!selectedId) return null;
    return this.containersStore.pickUpList().find((c) => c.id === selectedId);
  });

  public handleFiltersOpen(): void {
    this.containersStore.toggleFiltersOpen();
  }

  public handlePickUpBooking($event: ContainerPickUpViewModel) {
    this.containersStore.selectContainerToSchedulePickUp(
      $event.id,
      $event.residueTypes
    );
  }

  public handlePickUpFormCancel(): void {
    this.containersStore.resetSelectedContainer();
  }

  handlePickUpFormSubmit($event: {
    tractorHead: TractorHeadViewModel;
    destination: LocationViewModel;
    date: Date;
  }): void {
    const containerstayId = this.containersStore.selectedContainerId();

    if (!containerstayId) return;

    this.containersStore.schedulePickUp({
      id: containerstayId,
      destinationId: $event.destination.locationId,
      scheduledExit: $event.date,
      tractorHeadId: $event.tractorHead.id,
    });
    this.containersStore.resetSelectedContainer();
  }

  public onPageChange($event: PaginatorState) {
    const { page, rows } = $event;

    if (page !== null && page !== undefined) {
      this.containersStore.changePage(page + 1);
    }

    if (rows) {
      this.containersStore.changeRowsPerPage(rows);
    }
  }
}