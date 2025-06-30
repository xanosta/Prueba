import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { ChipModule } from 'primeng/chip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'trucks-state-chip',
  templateUrl: './truck-state-chip.component.html',
  imports: [CommonModule, TranslateModule, ChipModule],
})
export class TruckStateChipComponent {
  public state = input.required<string>();

  public label = computed(() => `enums.truckState.${this.state()}`);
}
