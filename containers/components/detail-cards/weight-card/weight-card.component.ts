import { Component, input } from '@angular/core';

@Component({
  selector: 'container-weight-card',
  templateUrl: 'weight-card.component.html',
  styleUrl: 'weight-card.component.scss',
})
export class WeightCardComponent {
  public weight = input<number>();
}
