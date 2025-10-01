import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { finalize, take } from 'rxjs';
import { DevicesStore } from '../../store/devices.store';

interface AddZoneForm {
  zoneType: FormControl<string | null>;
  locationId: FormControl<number | null>;
  name: FormControl<string>;
}

@Component({
  selector: 'app-add-zone-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: './add-zone-dialog.component.html',
  styleUrl: './add-zone-dialog.component.scss',
})
export class AddZoneDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly dialogConfig = inject(DynamicDialogConfig);
  private readonly devicesStore = inject(DevicesStore);

  public readonly zoneForm: FormGroup<AddZoneForm> = this.fb.group<AddZoneForm>({
    zoneType: this.fb.control<string | null>(null, { validators: [Validators.required] }),
    locationId: this.fb.control<number | null>(null, { validators: [Validators.required] }),
    name: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(3)],
      nonNullable: true,
    }),
  });

  public isSubmitting = false;

  public readonly zoneTypes =
    this.dialogConfig.data?.zoneTypes ?? ([
      { label: 'Entrada', value: 'ENTRY_AREA' },
      { label: 'Plataforma de pesado', value: 'WEIGHING_PLATFORM' },
      { label: 'Tolva', value: 'HOPPER' },
    ] as const);

  public get locationOptions() {
    const fromDialog = this.dialogConfig.data?.locations;
    if (fromDialog && fromDialog.length > 0) {
      return fromDialog;
    }

    return this.devicesStore._locations().map(location => ({
      id: location.id,
      name: location.name,
    }));
  }

  public submit(): void {
    if (this.zoneForm.invalid) {
      console.warn('Formulario inválido para crear zona', this.zoneForm.value);
      this.zoneForm.markAllAsTouched();
      return;
    }

    const { zoneType, locationId, name } = this.zoneForm.getRawValue();

    if (!zoneType || locationId === null || !name) {
      console.warn('Valores incompletos para crear zona', this.zoneForm.value);
      return;
    }

    const payload = {
      zoneType,
      locationId,
      name,
    };

    console.log('Enviando creación de zona desde el diálogo', payload);

    this.isSubmitting = true;

    this.devicesStore
      .createZone(zoneType, locationId, name)
      .pipe(
        take(1),
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: zone => {
          console.log('Zona creada correctamente en el diálogo', zone);
          this.dialogRef.close(zone);
        },
        error: error => {
          console.error('Error al crear la zona', error);
        },
      });
  }

  public cancel(): void {
    console.log('Cancelando creación de zona');
    this.dialogRef.close();
  }
}
