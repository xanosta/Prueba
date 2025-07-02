import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';

import { SmallLocationViewModel } from 'app/features/locations/view-model/location.view-model';
import { HopperViewModel } from '../../../../hoppers/view-models/hopper.view-model';
import { ResidueType } from 'app/features/residue-types/models/residue-type';
import { PostTruckEntry } from '../../../services/types/postTruckEntry';
import { TruckViewModel } from '../../../view-models/truck.view-model';

interface FormFields {
  plate: FormControl<string>;
  originIds: FormControl<Array<number>>;
  residueTypeId: FormControl<string>;
  arrivalWeight: FormControl<number | null>;
  dateTimeUnload: FormControl<Date | null>;
  hopperId: FormControl<number | null>;
  exitWeight: FormControl<number | null>;
}

@Component({
  templateUrl: './new-truck.component.html',
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    SelectModule,
    FloatLabelModule,
    DividerModule,
    InputTextModule,
    ButtonModule,
    MultiSelectModule,
    DatePickerModule,
    InputNumberModule,
    AutoCompleteModule,
  ],
})
export class NewTruckComponent implements OnInit {
  private readonly translateService = inject(TranslateService);
  private readonly messageService = inject(MessageService);

  public readonly allTrucks = input<Array<TruckViewModel>>();
  public readonly locations = input<Array<SmallLocationViewModel>>();
  public readonly hoppers = input<Array<HopperViewModel>>();
  public readonly residueTypes = input<Array<ResidueType>>();
  public readonly onNewTruck = input.required<(values: any) => void>();

  public newTruckForm!: FormGroup;
  public plateSuggestions = signal<Array<string>>([]);
  public currentDate = new Date();

  constructor(private readonly ref: DynamicDialogRef) {}

  get residueWeight(): string {
    const arrivalWeight = this.newTruckForm?.get('arrivalWeight')?.value;
    const exitWeight = this.newTruckForm?.get('exitWeight')?.value;

    if (arrivalWeight === null || exitWeight === null) return '-';

    if (arrivalWeight < exitWeight) return this.translateService.instant('newTruckEntry.errors.residueWeight');

    return (arrivalWeight - exitWeight).toString();
  }

  public ngOnInit(): void {
    let DateTime: Date | null = null;

    this.newTruckForm = new FormGroup<FormFields>({
      plate: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      originIds: new FormControl<Array<number>>([], {
        nonNullable: true,
        validators: [Validators.required]
      }),
      residueTypeId: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      arrivalWeight: new FormControl<number | null>(null, {
        validators: [Validators.min(1)]
      }),
      dateTimeUnload: new FormControl<Date | null>(DateTime, {
        validators: [Validators.required]
      }),
      hopperId: new FormControl<number | null>(null, {
        validators: [Validators.required]
      }),
      exitWeight: new FormControl<number | null>(null, {
        validators: [Validators.min(1)]
      }),
    });
  }

  get originsOptions() {
    return this.locations()?.map((origin) => ({
      value: origin.locationId,
      label: origin.name
    }));
  }

  get residueTypeOptions() {
    return this.residueTypes()?.map((residueType) => ({
      value: residueType,
      label: this.translateService.instant(`enums.residueTypes.${residueType}`),
    }));
  }

  get hoppersOptions() {
    return this.hoppers()?.map((hopper) => ({
      value: hopper.id,
      label: hopper.name,
    }));
  }

  public handleSubmit() {
    if (this.newTruckForm.invalid) {
      const invalidFields: string[] = [];

      if(this.newTruckForm.get('plate')?.invalid) {
        invalidFields.push(
          this.translateService.instant('newTruckEntry.form.plate')
        );
      }
      if (this.newTruckForm.get('dateTimeUnload')?.invalid) {
        invalidFields.push(
          this.translateService.instant(
            'newTruckEntry.form.unloadDate'
          )
        );
      }
      if (this.newTruckForm.get('originIds')?.invalid) {
        invalidFields.push(
          this.translateService.instant('newTruckEntry.form.origin')
        );
      }
      if (this.newTruckForm.get('arrivalWeight')?.invalid) {
        invalidFields.push(
          this.translateService.instant(
            'newTruckEntry.form.entryWeight'
          )
        );
      }
      if (this.newTruckForm.get('exitWeight')?.invalid) {
        invalidFields.push(
          this.translateService.instant(
            'newTruckEntry.form.exitWeight'
          )
        );
      }
      if (this.newTruckForm.get('hopperId')?.invalid) {
        invalidFields.push(
          this.translateService.instant('newTruckEntry.form.hopper')
        );
      }

      const msg = invalidFields.join(', ');
      this.messageService.add({
        severity: 'error',
        summary: this.translateService.instant(
          'truck.errors.missingFields.title'
        ),
        detail: msg,
      });
      return;
    }

    if (this.newTruckForm.value.dateTimeUnload)
      this.newTruckForm.value.dateTimeUnload = new Date(this.newTruckForm.value.dateTimeUnload).toISOString();

    const result = this.mapValuesToPost(this.newTruckForm.value)

    this.onNewTruck()(result);
    this.ref.close();
  }

  private mapValuesToPost(values: any): PostTruckEntry {
    const residueEntryData = {
      hopperId: values.hopperId,
      residueType: values.residueTypeId,
      origins: values.originIds,
      arrivalWeight: values.arrivalWeight,
      UnloadDatetime: values.dateTimeUnload,
      exitWeight: values.exitWeight
    }

    const vehicleData = {
      plate: values.plate,
      weightKg: +this.residueWeight,
    }

    return {residueEntryData, vehicleData}
  }

  public handleCancel(): void {
    this.newTruckForm.reset();
    this.ref.close();
  }

  public filterPlateSuggestions(event: AutoCompleteCompleteEvent): void {
    this.plateSuggestions.set(
      this.autocompletePlateItems.filter((plate) => plate.includes(event.query))
    );
  }

  get autocompletePlateItems(): Array<string> {
    const trucks = this.allTrucks();
    if (!trucks || trucks.length === 0) return [];
    
    return trucks.map((truck) => truck.plate);
  }
}
