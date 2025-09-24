import { Component } from '@angular/core';
import { Validators } from '@angular/forms';

import {
  EditEntityDialogComponent,
  EditEntityFieldSection,
} from '../edit-entity-dialog/edit-entity-dialog.component';

@Component({
  selector: 'app-edit-hopper-dialog',
  standalone: true,
  imports: [EditEntityDialogComponent],
  templateUrl: './edit-hopper-dialog.component.html',
})
export class EditHopperDialogComponent {
  public readonly hopperFields: EditEntityFieldSection[] = [
    [
      {
        id: 'name',
        label: 'Nombre',
        type: 'text',
        validators: [Validators.required],
      },
      {
        id: 'locationId',
        label: 'Planta',
        type: 'select',
        validators: [Validators.required],
        optionsKey: 'locations',
        optionLabel: 'name',
        optionValue: 'locationId',
        placeholder: 'Selecciona una planta',
      },
    ],
    [
      {
        id: 'containerRfidDeviceId',
        label: 'ID Dispositivo RFID Contenedor',
        type: 'text',
        validators: [Validators.required],
      },
      {
        id: 'truckRfidDeviceId',
        label: 'ID Dispositivo RFID Camión',
        type: 'text',
        validators: [Validators.required],
      },
    ],
  ];
}
