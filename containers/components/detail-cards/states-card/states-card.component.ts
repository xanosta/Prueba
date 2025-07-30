import { Component, input } from '@angular/core';
import { ResidueTypeChipComponent } from '@features/residue-types/components/residue-type-chip/residue-type-chip.component';
import { ResidueType } from '@features/residue-types/models/residue-type';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'container-states-card',
  templateUrl: 'states-card.component.html',
  styleUrl: 'states-card.component.scss',
  imports: [TranslateModule, ResidueTypeChipComponent],
})
export class StatesCardComponent {
  public location = input<string>();
  public residueType = input<ResidueType[]>();
}
