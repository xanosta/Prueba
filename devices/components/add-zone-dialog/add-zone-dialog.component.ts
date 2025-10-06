import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { LocationsStore } from '@features/locations/store/locations.store';
import { DevicesStore } from '../../store/devices.store';

interface AddZoneForm {
  locationId: FormControl<number | null>;
  zoneType: FormControl<string | null>;
  name: FormControl<string | null>;
}

@Component({
  selector: 'app-add-zone-dialog',
  templateUrl: './add-zone-dialog.component.html',
  styleUrls: ['./add-zone-dialog.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectModule,
    TranslateModule,
    InputTextModule,
    ButtonModule,
  ],
})
export class AddZoneDialogComponent {
  public readonly locationsStore = inject(LocationsStore);
  public readonly devicesStore = inject(DevicesStore);
  public readonly isSubmitting = this.devicesStore.isBusy;

  private readonly fb = inject(FormBuilder);
  public form: FormGroup<AddZoneForm>;

  public areaTypes = [
    { label: 'Entrada', value: 'ENTRY_AREA' },
    { label: 'Plataforma de pesado', value: 'WEIGHING_PLATFORM' },
    { label: 'Tolva', value: 'HOPPER' },
  ];

  public ref = inject(DynamicDialogRef);

  constructor() {
    this.form = this.fb.group<AddZoneForm>({
      locationId: this.fb.control(null, [Validators.required]),
      zoneType: this.fb.control(null, [Validators.required]),
      name: this.fb.control(null, [Validators.required]),
    });
  }

  public submit(): void {
    if (this.form.valid) {
      const { name, locationId, zoneType: areaType } = this.form.getRawValue();
      if (name && locationId && areaType) {
        this.devicesStore.addZone({
          name,
          locationId,
          areaType,
        });
        this.ref.close();
      }
    }
  }

  public cancel(): void {
    this.ref.close();
  }
}
