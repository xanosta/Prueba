import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { ResidueTypeChipComponent } from '@features/residue-types/components/residue-type-chip/residue-type-chip.component';
import { TruckPlateComponent } from '@features/trucks/components/truck-plate/truck-plate.component';
import { TranslateModule } from '@ngx-translate/core';
import { ChipModule } from 'primeng/chip';
import { TruckUnload } from '../../models/hopper-event';

@Component({
  selector: 'hoppers-truck-unload',
  templateUrl: './truck-unload.component.html',
  styleUrl: './truck-unload.component.scss',
  imports: [
    CommonModule,
    TranslateModule,
    ResidueTypeChipComponent,
    ChipModule,
    TruckPlateComponent,
  ],
})
export class TruckUnloadComponent {
  public truckLoad = input.required<TruckUnload>();
  public percentage = computed(() => {
    return `${this.truckLoad().unloadPercentage} %`;
  });
  public origins = computed(() => {
    return this.truckLoad()
      .origins.map((origin) => origin.name)
      .join(', ');
  });
}
