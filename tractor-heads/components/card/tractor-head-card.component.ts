import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { TruckPlateComponent } from 'app/features/trucks/components/truck-plate/truck-plate.component';
import { TractorHeadViewModel } from '../../view-models/tractor-head.view-model';
import { TractorHeadStatusChipComponent } from '../tractor-head-status-chip/tractor-head-status-chip.component';

@Component({
    selector: 'tractor-heads-card',
    standalone: true,
    imports: [
        DatePipe,
        TranslatePipe,
        TruckPlateComponent,
        TractorHeadStatusChipComponent,
    ],
    templateUrl: './tractor-head-card.component.html',
})
export class TractorHeadCardComponent {
    public tractorHead = input.required<TractorHeadViewModel>();
}