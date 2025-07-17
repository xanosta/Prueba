import { Component, inject, signal, effect } from '@angular/core';
import { DomiciliaryTrucksStore } from '../../store/domiciliary-trucks.store';
import { PinDialogComponent } from '../pin-dialog/pin-dialog.component';
import { TrucksBaseValidationModalComponent } from '@shared/components/modals/trucks-base-validation/trucks-base-validation.component';
import { DomiciliaryTruckValidationFormComponent, OutputFields } from '../forms/validation-form/validation-form.component';
import { LocationsStore } from '@features/locations/store/locations.store';
import { StepperModule } from 'primeng/stepper';

@Component({
  selector: 'domiciliary-truck-validation-modal',
  templateUrl: './validation-modal.component.html',
  styleUrl: './validation-modal.component.scss',
  imports: [
    TrucksBaseValidationModalComponent,
    PinDialogComponent,
    DomiciliaryTruckValidationFormComponent,
    StepperModule
  ]
})
export class DomiciliaryTruckValidationModalComponent {
  public outputEventData = signal<OutputFields | undefined>(undefined);
  public activeStep = 1;

  public readonly domiciliaryTruckEntriesStore = inject(DomiciliaryTrucksStore);
  public readonly locationsStore = inject(LocationsStore);

  constructor() {
    effect(() => {
      if (this.domiciliaryTruckEntriesStore.updateSucceeded()) {
        this.onChangeModalVisibility();
        this.domiciliaryTruckEntriesStore.resetUpdateStatus();
      }
    });
  }

  public onChangeModalVisibility() {
    this.outputEventData.set(undefined);
    this.activeStep = 1;
    this.domiciliaryTruckEntriesStore.deSelectTruck();
  }

  public validateTruck = (pin?: string): void => {
    if (this.outputEventData() !== undefined) {

      this.domiciliaryTruckEntriesStore.updateTruck(this.domiciliaryTruckEntriesStore.selectedTruck()!.id, {
        pin,
        originIds: this.outputEventData()!.originIds,
        residueTypeId: this.outputEventData()!.residueTypeId
      });
    }
  }

  public onContinue($event: OutputFields) {
    this.outputEventData.set($event);
    this.activeStep = 2;
  }

  public onClickGoBack() {
    this.activeStep = 1;
  }
}

