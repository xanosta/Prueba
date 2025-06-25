import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ResidueType } from 'app/features/residue-types/models/residue-type';
import { MessageService } from 'primeng/api';
import { HoppersStore } from 'app/modules/plant-operators/features/hoppers/store/hoppers.store';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { CommonModule } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { LocationsStore } from 'app/features/locations/store/locations.store';
import { TrucksEntriesStore } from '../../../store/truck-entries.store';

@Component({
  selector: 'plant-trucks-create-form',
  templateUrl: './create-truck-form.component.html',
  imports: [
    CommonModule,
    TranslatePipe,
    AutoComplete,
    DividerModule,
    ReactiveFormsModule,
    SelectModule,
    MultiSelectModule,
    InputNumberModule,
    DatePickerModule,
  ],
})
export class TruckCreateFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly translateService = inject(TranslateService);
  private readonly messageService = inject(MessageService);
  private readonly trucksEntriesStore = inject(TrucksEntriesStore);
  private readonly locationsStore = inject(LocationsStore);
  private readonly hoppersStore = inject(HoppersStore);

  public plateSuggestions = signal<Array<string>>([]);
  public createForm: FormGroup;
  public formErrors = signal<Array<string>>([]);

  constructor() {
    this.createForm = this.fb.group({
      plate: [, [Validators.required]],
      residueType: [, [Validators.required]],
      origins: [, [Validators.required]],
      entryWeight: [0, [Validators.min(1)]],
      exitWeight: [0, [Validators.min(1)]],
      residueWeight: [0, [Validators.min(1)]],
      hopper: [, [Validators.required]],
      date: [, [Validators.required]],
      container: [, [Validators.required]],
    });

    this.createForm.get('entryWeight')?.valueChanges.subscribe(() => {
      this.updateResidueWeight();
    });

    this.createForm.get('exitWeight')?.valueChanges.subscribe(() => {
      this.updateResidueWeight();
    });

    this.createForm.get('hopper')?.valueChanges.subscribe(() => {
      this.findContainer();
    });

    this.createForm.get('date')?.valueChanges.subscribe(() => {
      this.findContainer();
    });
  }

  public async handleSubmit() {
    const errors = this.getFormErrors();

    if (errors.length !== 0) {
      this.formErrors.set(errors);
      return;
    }

    const formValue = this.createForm.value;

    const newEntry = {
      vehicleData: {
        plate: formValue.plate,
        weightKg: formValue.residueWeight,
      },
      residueEntryData: {
        hopperId: formValue.hopper,
        residueType: formValue.residueType,
        origins: formValue.origins,
        arrivalWeight: formValue.entryWeight,
        UnloadDatetime: formValue.date.toISOString(),
        exitWeight: formValue.exitWeight,
      },
    };

    try {
      // TODO: !Send to store!
      // await this.trucksService.createTruck.mutateAsync(newEntry);
      this.router.navigate(['trucks']);

      this.messageService.add({
        summary: this.translateService.instant(
          'newTruckEntry.messages.success.title'
        ),
        detail: this.translateService.instant(
          'newTruckEntry.messages.success.description'
        ),
        severity: 'success',
      });
      this.router.navigate(['trucks']);
    } catch (err) {
      console.error(err);

      this.messageService.add({
        summary: this.translateService.instant(
          'newTruckEntry.messages.error.title'
        ),
        detail: this.translateService.instant(
          'newTruckEntry.messages.error.description'
        ),
        severity: 'error',
      });
    }

    return;
  }

  public async handleCancel() {
    await this.router.navigate(['trucks']);
  }

  public filterPlateSuggestions(event: AutoCompleteCompleteEvent) {
    this.plateSuggestions.set(
      this.autocompletePlateItems.filter((plate) => plate.includes(event.query))
    );
  }

  private updateResidueWeight(): void {
    const entryWeight = this.createForm.get('entryWeight')?.value || 0;
    const exitWeight = this.createForm.get('exitWeight')?.value || 0;
    const residueWeight = entryWeight - exitWeight;

    this.createForm.patchValue({
      residueWeight: residueWeight > 0 ? residueWeight : 0,
    });
  }

  private findContainer(): void {
    const hopperId = this.createForm.get('hopper')?.value;
    const date = this.createForm.get('date')?.value;

    if (!hopperId || !date) return;
  }

  private getFormErrors() {
    const errors = [];

    const plateErrors = this.createForm.get('plate')?.errors;
    if (plateErrors) {
      errors.push(this.translateService.instant('newTruckEntry.errors.plate'));
    }

    const residueTypeErrors = this.createForm.get('residueType')?.errors;
    if (residueTypeErrors) {
      errors.push(
        this.translateService.instant('newTruckEntry.errors.residueType')
      );
    }

    const originsErrors = this.createForm.get('origins')?.errors;
    if (originsErrors) {
      errors.push(
        this.translateService.instant('newTruckEntry.errors.origins')
      );
    }

    const entryWeightErrors = this.createForm.get('entryWeight')?.errors;
    if (entryWeightErrors) {
      errors.push(
        this.translateService.instant('newTruckEntry.errors.entryWeight')
      );
    }

    const exitWeightErrors = this.createForm.get('exitWeight')?.errors;
    if (exitWeightErrors) {
      errors.push(
        this.translateService.instant('newTruckEntry.errors.exitWeight')
      );
    }

    const hopperErrors = this.createForm.get('hopper')?.errors;
    if (hopperErrors) {
      errors.push(this.translateService.instant('newTruckEntry.errors.hopper'));
    }

    const dateErrors = this.createForm.get('date')?.errors;
    if (dateErrors) {
      errors.push(this.translateService.instant('newTruckEntry.errors.date'));
    }

    return errors;
  }

  get residueWeight(): number {
    return this.createForm.get('residueWeight')?.value;
  }

  get container(): string {
    const containerCode = this.createForm.get('container')?.value;

    if (!containerCode) return '-';

    return containerCode;
  }

  get autocompletePlateItems() {
    const allDomiciliarTrucks =
      this.trucksService.getAllDomiciliarTrucks.data();

    if (!allDomiciliarTrucks) return [];

    return allDomiciliarTrucks?.map((truck) => truck.plate);
  }

  get residueTypeOptions() {
    return [
      {
        value: ResidueType.AMARELA,
        label: this.translateService.instant('enums.residueTypes.AMARELA'),
      },
      {
        value: ResidueType.NEGRA,
        label: this.translateService.instant('enums.residueTypes.NEGRA'),
      },
    ];
  }

  get originOptions() {
    return this.locationsStore.locations().map((origin) => ({
      label: origin.name,
      value: origin.id,
    }));
  }

  get hopperOptions() {
    return this.hoppersStore.locationHoppers().map((hopper) => ({
      label: hopper.name,
      value: hopper.id,
    }));
  }
}
