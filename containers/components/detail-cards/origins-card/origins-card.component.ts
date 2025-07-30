import { Component, input } from '@angular/core';

@Component({
  selector: 'container-origins-detail-card',
  templateUrl: 'origins-card.component.html',
  styleUrl: 'origins-card.component.scss',
})
export class OriginsCardComponent {
  public origins = input<string[]>();
}
