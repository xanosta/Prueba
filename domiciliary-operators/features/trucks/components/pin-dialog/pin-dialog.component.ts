import { Component, inject, input, signal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { InputOtpModule } from 'primeng/inputotp';

@Component({
  selector: 'domiciliary-truck-pin-dialog',
  templateUrl: './pin-dialog.component.html',
  styleUrl: './pin-dialog.component.scss',
  imports: [InputOtpModule, FormsModule, TranslatePipe],
})
export class PinDialogComponent {
  private readonly translateService = inject(TranslateService);

  public readonly truckEntry = input.required<{ id: number; companyName: string }>();
  public readonly truckValidator = input.required<(pin?: string) => void>();
  public readonly cancelOutput = output<void>();

  public invalidOtpFormat = signal<boolean>(false);

  public value: number | null = null;

  public validate(): void {
    if (!this.value) {
      this.invalidOtpFormat.set(true);
      return;
    };

    if (this.value.toString().length !== 4) {
      this.invalidOtpFormat.set(true);
      return
    };

    if (this.invalidOtpFormat()) this.invalidOtpFormat.set(false);

    this.truckValidator()(this.value.toString());
  }

  public handleCancel(): void {
    this.cancelOutput.emit();
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
