import { Component, input, output } from '@angular/core';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';

import { ContainerPickUpViewModel } from '../../view-model/container.view-model';
import { ResidueTypeChipComponent } from '@features/residue-types/components/residue-type-chip/residue-type-chip.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'tractor-head-operators-container-card',
  templateUrl: './tractor-head-operators-container-card.component.html',
  styleUrl: './tractor-head-operators-container-card.component.scss',
  imports: [ChipModule, DividerModule, ResidueTypeChipComponent, CommonModule, TranslateModule],
})
export class TractorHeadOperatorsContainerCardComponent {
  public container = input.required<ContainerPickUpViewModel>();

  public onBooking = output<ContainerPickUpViewModel>();

  public handleBooking() {
    this.onBooking.emit(this.container());
  }
}