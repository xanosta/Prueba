import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputOtpModule } from 'primeng/inputotp';

@Component({
  templateUrl: './pin-dialog.component.html',
  styleUrl: './pin-dialog.component.scss',
  imports: [InputOtpModule, FormsModule, TranslatePipe],
})
export class PinDialogComponent {
  private readonly translateService = inject(TranslateService);

  public truckEntry = input.required<{ id: number; companyName: string }>();
  public truckValidator = input.required<(pin?: string) => void>();

  public value: number | null = null;

  constructor(private readonly ref: DynamicDialogRef) {}

  public close() {
    this.ref.close();
  }

  public validate(): void{
    if (!this.value) return;
    if (this.value.toString().length !== 4) return;

    this.truckValidator()(this.value.toString());

    this.close();
  }

  get description(): string {
    return this.translateService.instant(
      'truck.pinValidationDialog.description',
      {
        companyName: this.truckEntry().companyName,
      }
    );
  }
}
