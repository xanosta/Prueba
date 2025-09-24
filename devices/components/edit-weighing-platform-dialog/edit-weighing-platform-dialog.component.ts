import { Component } from '@angular/core';
import { Validators } from '@angular/forms';

import {
  EditEntityDialogComponent,
  EditEntityFieldSection,
} from '../edit-entity-dialog/edit-entity-dialog.component';

@Component({
  selector: 'app-edit-weighing-platform-dialog',
  standalone: true,
  imports: [EditEntityDialogComponent],
  templateUrl: './edit-weighing-platform-dialog.component.html',
})
export class EditWeighingPlatformDialogComponent {
  public readonly weighingPlatformFields: EditEntityFieldSection[] = [
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
      {
        id: 'hopperId',
        label: 'Tolva',
        type: 'number',
        validators: [Validators.required],
      },
    ],
    [
      {
        id: 'rfidReaderDeviceId',
        label: 'ID Lector RFID',
        type: 'text',
        validators: [Validators.required],
      },
      {
        id: 'scaleDeviceId',
        label: 'ID Báscula',
        type: 'text',
        validators: [Validators.required],
      },
    ],
    [
      {
        id: 'entryColumnDeviceId',
        label: 'ID Columna de Entrada',
        type: 'text',
        validators: [Validators.required],
      },
      {
        id: 'exitColumnDeviceId',
        label: 'ID Columna de Salida',
        type: 'text',
        validators: [Validators.required],
      },
    ],
  ];
}
