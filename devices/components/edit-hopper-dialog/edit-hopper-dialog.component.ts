import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { LocationsStore } from 'app/features/locations/store/locations.store';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-edit-hopper-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, SelectModule],
  templateUrl: './edit-hopper-dialog.component.html',
})
export class EditHopperDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  public readonly ref = inject(DynamicDialogRef);
  public readonly config = inject(DynamicDialogConfig);
  public readonly locationsStore = inject(LocationsStore);

  public editHopperForm: FormGroup;

  constructor() {
    this.editHopperForm = this.fb.group({
      name: ['', Validators.required],
      locationId: [null, Validators.required],
      containerRfidDeviceId: ['', Validators.required],
      truckRfidDeviceId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const hopperData = this.config.data?.hopper;
    if (hopperData) {
      this.editHopperForm.patchValue(hopperData);
    }
  }

  public save(): void {
    if (this.editHopperForm.invalid) {
      return;
    }
    this.ref.close(this.editHopperForm.value);
  }

  public cancel(): void {
    this.ref.close();
  }
}
