import { Component, inject, effect } from '@angular/core';
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
import { EditDeviceDialogComponent } from '../../components/edit-device-dialog/edit-device-dialog.component';
import { filter } from 'rxjs';
import { DeviceUpdateRequest } from '../../services/devices.service';
import { EditHopperDialogComponent } from '../../components/edit-hopper-dialog/edit-hopper-dialog.component';
import { EditEntryAreaDialogComponent } from '../../components/edit-entry-area-dialog/edit-entry-area-dialog.component';
import { EditWeighingPlatformDialogComponent } from '../../components/edit-weighing-platform-dialog/edit-weighing-platform-dialog.component';
import { EntryArea, Hopper, WeighingPlatform } from '../../models/device.model';

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

  constructor() {
    effect(() => {
      const deviceDetails = this.devicesStore.selectedDeviceDetail();
      if (deviceDetails) {
        this.openEditDeviceDialog(deviceDetails);
      }
    });
    effect(() => {
      const hopperDetails = this.devicesStore.selectedHopper();
      if (hopperDetails) {
        this.openEditHopperDialog(hopperDetails);
      }
    });
    effect(() => {
      const entryAreaDetails = this.devicesStore.selectedEntryArea();
      if (entryAreaDetails) {
        this.openEditEntryAreaDialog(entryAreaDetails);
      }
    });
    effect(() => {
      const weighingPlatformDetails = this.devicesStore.selectedWeighingPlatform();
      if (weighingPlatformDetails) {
        this.openEditWeighingPlatformDialog(weighingPlatformDetails);
      }
    });
  }

  public editNode(nodeData: any): void {
    if (nodeData.level === 2) {
      // device
      this.devicesStore.getDeviceById(nodeData.id);
    } else if (nodeData.level === 1) {
      // zone
      switch (nodeData.type) {
        case 'HOPPER':
          this.devicesStore.getHopperById(nodeData.id);
          break;
        case 'ENTRY_AREA':
          this.devicesStore.getEntryAreaById(nodeData.id);
          break;
        case 'WEIGHING_PLATFORM':
          this.devicesStore.getWeighingPlatformById(nodeData.id);
          break;
      }
    }
  }

  private openEditDeviceDialog(deviceData: any): void {
    const dialogRef = this.dialogService.open(EditDeviceDialogComponent, {
      header: `Editar Dispositivo: ${deviceData.name}`,
      width: '50%',
      data: {
        device: deviceData,
      },
    });

    dialogRef.onClose.pipe(filter(result => !!result)).subscribe(formData => {
      const updatePayload: DeviceUpdateRequest = {
        deviceId: deviceData.id,
        name: formData.name,
        type: formData.type,
        locationId: formData.locationId,
        ip: formData.ip,
        port: formData.port,
        power: formData.power,
        frequency: formData.frequency,
        PositionDTO: {
          id: 0,
          plantPosition: formData.plantPosition,
          deviceTypeInPlant: 'RFID_READER_TRUCK_DEVICE_ID',
        },
      };

      this.devicesStore.updateDevice(deviceData.id, updatePayload);
    });

    dialogRef.onClose.subscribe(() => {
      this.devicesStore.clearSelectedDevice();
    });
  }

  private openEditHopperDialog(hopperData: Hopper): void {
    const dialogRef = this.dialogService.open(EditHopperDialogComponent, {
      header: `Editar Tolva: ${hopperData.name}`,
      width: '50%',
      data: {
        hopper: hopperData,
      },
    });

    dialogRef.onClose.pipe(filter(result => !!result)).subscribe(formData => {
      this.devicesStore.updateHopper(hopperData.hopperId, formData);
    });

    dialogRef.onClose.subscribe(() => {
      this.devicesStore.clearSelectedHopper();
    });
  }

  private openEditEntryAreaDialog(entryAreaData: EntryArea): void {
    const dialogRef = this.dialogService.open(EditEntryAreaDialogComponent, {
      header: `Editar Área de Entrada: ${entryAreaData.name}`,
      width: '50%',
      data: {
        entryArea: entryAreaData,
      },
    });

    dialogRef.onClose.pipe(filter(result => !!result)).subscribe(formData => {
      this.devicesStore.updateEntryArea(entryAreaData.entryAreaId, formData);
    });

    dialogRef.onClose.subscribe(() => {
      this.devicesStore.clearSelectedEntryArea();
    });
  }

  private openEditWeighingPlatformDialog(weighingPlatformData: WeighingPlatform): void {
    const dialogRef = this.dialogService.open(EditWeighingPlatformDialogComponent, {
      header: `Editar Plataforma de Pesado: ${weighingPlatformData.name}`,
      width: '50%',
      data: {
        weighingPlatform: weighingPlatformData,
      },
    });

    dialogRef.onClose.pipe(filter(result => !!result)).subscribe(formData => {
      this.devicesStore.updateWeighingPlatform(weighingPlatformData.weighingAreaId, formData);
    });

    dialogRef.onClose.subscribe(() => {
      this.devicesStore.clearSelectedWeighingPlatform();
    });
  }

  public onPageChange(event: PaginatorState) {
    if (event.page !== undefined) {
      this.devicesStore.changePage(event.page + 1);
    }
  }

  public handleFiltersOpen(): void {
    this.devicesStore.toggleFiltersOpen();
  }

  public delete(node: DeviceTreeNode): void {
    console.log('Delete', node);
  }
}
