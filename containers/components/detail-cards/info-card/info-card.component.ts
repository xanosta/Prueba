import { Component, input } from '@angular/core';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'container-info-card',
  templateUrl: 'info-card.component.html',
  styleUrl: 'info-card.component.scss',
  imports: [DividerModule],
})
export class InfoCardComponent {
  public containerCode = input<string>();
  public lastHopper = input<string>();
}
