import { CommonModule } from "@angular/common";
import { Component, inject, input, output } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: 'truck-actions-card',
  templateUrl: 'truck-actions-card.component.html',
  styleUrl: 'truck-actions-card.component.scss',
  imports: [
    TranslateModule,
    CommonModule
  ]
})
export class TruckActionsCardComponent {
  public truckPlate = input<string>();
  public companyName = input<string>();
  public isValidated = input<boolean>();
  public deleteDisabled = input<boolean>(true);

  onValidatePin = output<void>();
  onDelete = output<void>();

  private readonly confirmationService = inject(ConfirmationService);
  private readonly translateService = inject(TranslateService);

  public deleteTruck(): void {
    this.confirmationService.confirm({
      header: `${this.translateService.instant(
        'truck.confirmationModal.title'
      )} ${this.truckPlate()}`,
      message: this.translateService.instant(
        'truck.confirmationModal.description'
      ),
      acceptLabel: this.translateService.instant(
        'truck.confirmationModal.buttons.accept'
      ),
      rejectLabel: this.translateService.instant(
        'truck.confirmationModal.buttons.reject'
      ),
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-info',
      accept: () => {
        this.onDelete.emit();
      },
    });
  }
}
