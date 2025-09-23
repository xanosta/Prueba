import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

import { LocationsStore } from 'app/features/locations/store/locations.store';

@Component({
  selector: 'app-edit-device-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    SelectModule,
  ],
  templateUrl: './edit-device-dialog.component.html',
})
export class EditDeviceDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  public readonly ref = inject(DynamicDialogRef);
  public readonly config = inject(DynamicDialogConfig);
  public readonly locationsStore = inject(LocationsStore);

  public editDeviceForm: FormGroup;

  public positionOptions = [
    { label: 'Area de entrada', value: 'ENTRY_AREA' },
    { label: 'Plataforma de pesado', value: 'WEIGHING_PLATFORM' },
    { label: 'Tolva', value: 'HOPPER' },
  ];

  public typeOptions = [
    { label: 'Lector de matricula', value: 'LECTOR_MAT' },
    { label: 'Lector RFID', value: 'LECT_RFID' },
    { label: 'Bascula', value: 'BASCULA' },
    { label: 'Semaforo', value: 'SEMAFORO' },
    { label: 'GUI de transportista', value: 'GUI_TRANSP' },
    { label: 'GUI de planta', value: 'GUI_PLANTA' },
  ];

  constructor() {
    this.editDeviceForm = this.fb.group({
      name: ['', Validators.required],
      locationId: [null, Validators.required],
      plantPosition: [null, Validators.required],
      type: [null, Validators.required],
      ip: ['', Validators.required],
      port: ['', Validators.required],
      power: [null],
      frequency: [null],
    });
  }

  ngOnInit(): void {
    const deviceData = this.config.data?.device;
    if (deviceData) {
      this.editDeviceForm.patchValue({
        name: deviceData.name,
        type: deviceData.type,
        ip: deviceData.ip,
        port: deviceData.port,
        power: deviceData.power,
        frequency: deviceData.frequency,
        // Nota: locationId y plantPosition necesitarán ser mapeados si no vienen directamente
      });
    }
  }

  public save(): void {
    if (this.editDeviceForm.invalid) {
      return;
    }

    this.ref.close(this.editDeviceForm.value);
  }

  public cancel(): void {
    this.ref.close();
  }
}
