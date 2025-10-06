import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TreeTableModule } from 'primeng/treetable';
import { HeaderComponent } from '@shared/components/header/header.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { EmptyPageMessageComponent } from '@shared/components/empty-page-message/empty-page-message.component';
import { TranslateModule } from '@ngx-translate/core';
import { DevicesStore } from '../../store/devices.store';
import { ListDevicesPageFilterComponent } from '../../components/list-devices-page-filters/list-devices-page-filters.component';
import { DeviceTreeNode } from '../../view-model/device.view-model';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { AddZoneDialogComponent } from '../../components/add-zone-dialog/add-zone-dialog.component';

@Component({
  templateUrl: './devices-page.component.html',
  styleUrls: ['./devices-page.component.scss'],
  imports: [
    CommonModule,
    TreeTableModule,
    PaginatorModule,
    HeaderComponent,
    IconComponent,
    EmptyPageMessageComponent,
    TranslateModule,
    ListDevicesPageFilterComponent,
    DynamicDialogModule,
  ],
  providers: [DevicesStore, DialogService],
})
export class DevicesPageComponent {
  public readonly devicesStore = inject(DevicesStore);
  private readonly dialogService = inject(DialogService);

  public onPageChange(event: PaginatorState) {
    if (event.page !== undefined) {
      this.devicesStore.changePage(event.page + 1);
    }
  }

  public handleFiltersOpen(): void {
    this.devicesStore.toggleFiltersOpen();
  }

  public addZone(): void {
    this.dialogService.open(AddZoneDialogComponent, {
      header: 'Añadir Zona',
      width: '35rem',
      modal: true,
    });
  }

  public edit(node: DeviceTreeNode): void {
    console.log('Edit', node);
  }
}
