import { Component, input, output } from '@angular/core';
import { AlertViewModel } from '../../view-models/alert.view-model';
import { AlertSeverityChip } from '../alert-severity-chip/alert-severity-chip.component';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '../../../../../../shared/components/icon/icon.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'plant-operator-alert-card',
  templateUrl: 'alert-card.component.html',
  styleUrl: './alert-card.component.scss',
  imports: [AlertSeverityChip, TranslatePipe, IconComponent, DatePipe],
  providers: [DatePipe]
})
export class AlertCard {
  public alert = input.required<AlertViewModel>();
  public onClick = output<number>();

  public handleClick(): void {
    this.onClick.emit(this.alert().id);
  }
}
