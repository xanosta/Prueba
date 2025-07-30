import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
@Component({
  selector: 'container-dates-card',
  templateUrl: 'date-card.component.html',
  styleUrl: 'date-card.component.scss',
  imports: [DatePipe],
})
export class DatesCardComponent {
  public labelEntry = input<string>();
  public entryDate = input<Date>();
  public labelExit = input<string>();
  public exitDate = input<Date>();
}
