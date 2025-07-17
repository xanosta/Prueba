import { Component, computed, input, output } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

import { TruckViewModel } from '../../view-models/truck.view-model';
import { TruckPlateComponent } from 'app/features/trucks/components/truck-plate/truck-plate.component';
import { TruckStateChipComponent } from 'app/modules/plant-operators/features/trucks/components/truck-state-chip/truck-state-chip.component';
import { ResidueTypesChipsComponent } from 'app/features/residue-types/components/residue-types-chips/residue-types-chips.component';
import { IconComponent } from '../../../../../../shared/components/icon/icon.component';
import { Button } from 'primeng/button';

@Component({
    selector: 'domiciliary-truck-card',
    imports: [
        CommonModule,
        TranslatePipe,
        DatePipe,
        TruckPlateComponent,
        TruckStateChipComponent,
        ResidueTypesChipsComponent,
        IconComponent,
        Button
    ],
    templateUrl: './domiciliary-truck-card.component.html',
})
export class DomiciliaryTruckCardComponent {
    public truck = input.required<TruckViewModel>();
    public onValidate = output<number>();

    public originsText = computed(() => {
        const origins = this.truck()?.origins ?? [];

        return origins.length > 0
            ? origins.map((origin) => origin.name).join(', ')
            : '-'
            ;
    });

    public onClickValidate() {
        this.onValidate.emit(this.truck().id);
    }
}