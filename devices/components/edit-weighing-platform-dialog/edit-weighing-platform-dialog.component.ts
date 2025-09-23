import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { LocationsStore } from 'app/features/locations/store/locations.store';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-edit-weighing-platform-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, SelectModule],
  templateUrl: './edit-weighing-platform-dialog.component.html',
})
export class EditWeighingPlatformDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  public readonly ref = inject(DynamicDialogRef);
  public readonly config = inject(DynamicDialogConfig);
  public readonly locationsStore = inject(LocationsStore);

  public editWeighingPlatformForm: FormGroup;

  constructor() {
    this.editWeighingPlatformForm = this.fb.group({
      name: ['', Validators.required],
      locationId: [null, Validators.required],
      rfidReaderDeviceId: ['', Validators.required],
      scaleDeviceId: ['', Validators.required],
      entryColumnDeviceId: ['', Validators.required],
      exitColumnDeviceId: ['', Validators.required],
      hopperId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    const weighingPlatformData = this.config.data?.weighingPlatform;
    if (weighingPlatformData) {
      this.editWeighingPlatformForm.patchValue(weighingPlatformData);
    }
  }

  public save(): void {
    if (this.editWeighingPlatformForm.invalid) {
      return;
    }
    this.ref.close(this.editWeighingPlatformForm.value);
  }

  public cancel(): void {
    this.ref.close();
  }
}
