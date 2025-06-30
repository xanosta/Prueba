import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputOtpModule } from 'primeng/inputotp';

import { TruckDetailViewModel } from '../../view-models/truck-detail.view-model';

@Component({
  templateUrl: './update-validation-dialog.component.html',
  styleUrl: './update-validation-dialog.component.scss',
  imports: [InputOtpModule, FormsModule, TranslatePipe],
})
export class UpdateValidationDialogComponent {
  private readonly messageService = inject(MessageService);
  private readonly translateService = inject(TranslateService);

  public truckEntry = input.required<{ truck: TruckDetailViewModel; newValues: any }>();
  public truckUpdater = input.required<(pin?: string) => void>();

  public value: number | null = null;

  constructor(private readonly ref: DynamicDialogRef) {}

  public close() {
    this.ref.close();
  }

  public handleConfirmWithoutValidation(): void {
    this.truckUpdater()();

    this.close();
  }

  public async handleConfirmWithValidation(): Promise<void> {
    //TODO: Send error message if pin is not valid
    if (!this.value) return;
    if (this.value.toString().length !== 4) return;

    this.truckUpdater()(this.value.toString());

    this.close();
  }

  get description(): string {
    return this.translateService.instant(
      'truck.pinValidationDialog.description',
      {
        companyName: this.truckEntry().truck.vehicleCompanyName,
      }
    );
  }
}
