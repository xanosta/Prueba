import { Component, computed, inject, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';

import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { TranslatePipe } from '@ngx-translate/core';
import { TruckPlateComponent } from 'app/features/trucks/components/truck-plate/truck-plate.component';
import { TruckViewModel } from '../../view-models/truck.view-model';
import { TruckStateChipComponent } from '../truck-state-chip/truck-state-chip.component';
import { ResidueTypesChipsComponent } from 'app/features/residue-types/components/residue-types-chips/residue-types-chips.component';
import { IconComponent } from '../../../../../../shared/components/icon/icon.component';

@Component({
  selector: 'trucks-card',
  templateUrl: './truck-card.component.html',
  imports: [
    TranslatePipe,
    ResidueTypesChipsComponent,
    TruckStateChipComponent,
    Button,
    TruckPlateComponent,
    DatePipe,
    IconComponent,
  ],
})
export class TruckCardComponent {
  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly translateService: TranslateService
  ) {}

  public truck = input.required<TruckViewModel>();
  public onDelete = output<number>();
  private readonly router = inject(Router);

  public originsText = computed(() => {
    const origins = this.truck()?.origins ?? [];
    return origins.length > 0
      ? origins.map((origin) => origin.name).join(', ')
      : '-';
  });

  public async handleClick() {
    await this.router.navigate(['planta', 'trucks', this.truck().id]);
  }

  public deleteTruck(event: MouseEvent): void {
    event.stopPropagation();

    this.confirmationService.confirm({
      header: `${this.translateService.instant(
        'truck.confirmationModal.title'
      )} ${this.truck().plate}`,
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
        this.onDelete.emit(this.truck().id);
      },
    });
  }
}
