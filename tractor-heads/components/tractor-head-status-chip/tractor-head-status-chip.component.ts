import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { ChipModule } from 'primeng/chip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'tractor-heads-status-chip',
    standalone: true,
    imports: [CommonModule, TranslateModule, ChipModule],
    templateUrl: './tractor-head-status-chip.component.html',
})
export class TractorHeadStatusChipComponent {
    public status = input.required<string>();

    public label = computed(() => `enums.tractorHeadState.${this.status()}`);
}