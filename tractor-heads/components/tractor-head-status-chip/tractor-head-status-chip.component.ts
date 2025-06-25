import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { ChipModule } from 'primeng/chip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'tractor-heads-status-chip',
    standalone: true,
    imports: [CommonModule, TranslateModule, ChipModule],
    template: `<p-chip [label]="label() | translate" />`,
})
export class TractorHeadStatusChipComponent {
    public status = input.required<string>();

    public label = computed(() => `enums.tractorHeadStatus.${this.status()}`);
}