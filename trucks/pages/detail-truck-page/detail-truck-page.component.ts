import { Component, inject, input, numberAttribute } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';

import { TrucksEntriesStore } from '../../store/truck-entries.store';
import { PageHeaderComponent } from '../../../../../../shared/components/page-header/page-header.component';
import { CardComponent } from "../../../../../../shared/components/card/card.component";
import { TruckInfoCardComponent } from '../../components/detail-cards/info-card/truck-info-card.component';
import { TruckActionsCardComponent } from '../../components/detail-cards/actions-card/truck-actions-card.component';
import { UpdateFormComponent } from '../../components/forms/update-form/update-form.component';
import { LocationsStore } from 'app/features/locations/store/locations.store';
import { HoppersStore } from '../../../hoppers/store/hoppers.store';
import { LabeledInfoCard } from '@shared/components/labeled-info/labeled-info.component';
import { StatesCardComponent } from '../../components/detail-cards/states-card/states-card.component';
import { ContainersCardComponent } from '../../components/detail-cards/containers-card/containers-card.component';
import { PlantOperatorBreadCrumbsComponent } from '../../../breadcrumbs/components/plant-operators-breadcrumbs.component';
import { PinDialogComponent } from '../../components/pin-dialog/pin-dialog.component';

@Component({
  templateUrl: './detail-truck-page.component.html',
  styleUrl: './detail-truck-page.component.scss',
  imports: [
    TranslatePipe,
    PageHeaderComponent,
    CardComponent,
    TruckInfoCardComponent,
    TruckActionsCardComponent,
    UpdateFormComponent,
    LabeledInfoCard,
    DatePipe,
    StatesCardComponent,
    ContainersCardComponent,
    PlantOperatorBreadCrumbsComponent
  ],
  providers: [
    DialogService
  ],
})
export class DetailTruckPage {
  public readonly trucksEntriesStore = inject(TrucksEntriesStore);
  public readonly locationsStore = inject(LocationsStore);
  public readonly hoppersStore = inject(HoppersStore);
  public readonly messageService = inject(MessageService);
  private readonly translateService = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);

  readonly id = input.required({ transform: numberAttribute });

  constructor() {
    this.trucksEntriesStore.setSelectedTruck(this.id);
  }

  public onTruckUpdate(value: any): void {
    this.trucksEntriesStore.updateTruck(this.id(), value);

    this.messageService.add({
      severity: 'success',
      summary: this.translateService.instant('truck.messages.update.title'),
      detail: this.translateService.instant(
        'truck.messages.update.description'
      ),
    });
  }

  public onTruckDelete(): void {
    this.trucksEntriesStore.deleteTruck(this.id());

    this.messageService.add({
      severity: 'success',
      summary: this.translateService.instant(
        'truck.messages.deleteSuccess.title'
      ),
      detail: this.translateService.instant(
        'truck.messages.deleteSuccess.description'
      ),
    });

    this.router.navigate(['planta', 'trucks']);
  }

  public validateTruck = (pin: string): void => {
    this.trucksEntriesStore.updateTruck(this.id(), { pin });

    this.messageService.add({
      severity: 'success',
      summary: this.translateService.instant(
        'truck.messages.pinValidation.title'
      ),
      detail: this.translateService.instant(
        'truck.messages.pinValidation.description'
      ),
    });
  }

  public onValidatePin(): void {
    this.dialogService.open(PinDialogComponent, {
      modal: true,
      header: this.translateService.instant('truck.pinValidationDialog.title'),
      inputValues: {
        truckEntry: {
          id: this.id(),
          companyName: this.trucksEntriesStore.selectedTruck()?.vehicleCompanyName
        },
        truckValidator: this.validateTruck
      },
    });
  }
}
