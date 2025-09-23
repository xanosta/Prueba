import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { LocationsStore } from 'app/features/locations/store/locations.store';
import { SelectModule } from 'primeng/select';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'app-edit-entry-area-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
    InputSwitchModule,
  ],
  templateUrl: './edit-entry-area-dialog.component.html',
})
export class EditEntryAreaDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  public readonly ref = inject(DynamicDialogRef);
  public readonly config = inject(DynamicDialogConfig);
  public readonly locationsStore = inject(LocationsStore);

  public editEntryAreaForm: FormGroup;

  constructor() {
    this.editEntryAreaForm = this.fb.group({
      name: ['', Validators.required],
      locationId: [null, Validators.required],
      plateReaderDeviceId: ['', Validators.required],
      rfidReaderDeviceId: ['', Validators.required],
      ignoreEntry: [false],
    });
  }

  ngOnInit(): void {
    const entryAreaData = this.config.data?.entryArea;
    if (entryAreaData) {
      this.editEntryAreaForm.patchValue(entryAreaData);
    }
  }

  public save(): void {
    if (this.editEntryAreaForm.invalid) {
      return;
    }
    this.ref.close(this.editEntryAreaForm.value);
  }

  public cancel(): void {
    this.ref.close();
  }
}
