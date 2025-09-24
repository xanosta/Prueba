import { Component } from '@angular/core';
import { Validators } from '@angular/forms';

import {
  EditEntityDialogComponent,
  EditEntityFieldSection,
} from '../edit-entity-dialog/edit-entity-dialog.component';

@Component({
  selector: 'app-edit-entry-area-dialog',
  standalone: true,
  imports: [EditEntityDialogComponent],
  templateUrl: './edit-entry-area-dialog.component.html',
})
export class EditEntryAreaDialogComponent {
  public readonly entryAreaFields: EditEntityFieldSection[] = [
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
        id: 'plateReaderDeviceId',
        label: 'ID Lector de Matrícula',
        type: 'text',
        validators: [Validators.required],
      },
      {
        id: 'rfidReaderDeviceId',
        label: 'ID Lector RFID',
        type: 'text',
        validators: [Validators.required],
      },
    ],
    [
      {
        id: 'ignoreEntry',
        label: 'Ignorar Entrada',
        type: 'switch',
        layout: 'row',
        defaultValue: false,
      },
    ],
  ];
}
