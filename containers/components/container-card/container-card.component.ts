import { Component, computed, inject, input, output } from '@angular/core';
import { ContainerViewModel } from '../../view-models/container.view-model';
import { ResidueTypeChipComponent } from '../../../../../../features/residue-types/components/residue-type-chip/residue-type-chip.component';
import { TranslatePipe } from '@ngx-translate/core';
import { DatePipe, CommonModule } from '@angular/common';
import { ContainersLocationChip } from '../location-chip/location-chip.component';

@Component({
  selector: 'planta-operators-container-card',
  templateUrl: './container-card.component.html',
  imports: [CommonModule, TranslatePipe, ResidueTypeChipComponent, ContainersLocationChip],
})
export class ContainerCardComponent {
  public container = input.required<ContainerViewModel>();
  public onClick = output<ContainerViewModel>();

  private readonly datePipe = inject(DatePipe);

  public handleClick() {
    this.onClick.emit(this.container());
  }

  public entryDatetime = computed(() => {
    const entry = this.container().entry;

    return entry ? this.datePipe.transform(entry, 'd/M/yyyy HH:mm') : '-';
  });

  public exitDatetime = computed(() => {
    const exit = this.container().exit;

    return exit ? this.datePipe.transform(exit, 'd/M/yyyy HH:mm') : '-';
  });
}
