import { Component, computed, inject, input, output } from "@angular/core";
import { DrawerModule } from 'primeng/drawer';
import { DatePipe } from "@angular/common";

import { AlertDetailViewModel } from "../../view-models/alert-detail.view-model";
import { PreviousInfo } from "@alerts/types/previous-info.type";
import { TranslateModule } from "@ngx-translate/core";
import { SeverityTagComponent } from "@alerts/components/severity-tag.component.html/severity-tag.component";

@Component({
  selector: 'plant-operator-alert-detail',
  templateUrl: 'alert-detail.component.html',
  styleUrl: 'alert-detail.component.scss',
  imports: [
    DrawerModule,
    TranslateModule,
    DatePipe,
    SeverityTagComponent
  ],
  providers: [DatePipe]
})
export class AlertDetailDrawerComponent {
  public alert = input.required<AlertDetailViewModel | null>();
  public onClose = output<void>();

  private datePipe = inject(DatePipe);


  public handleClose(): void {
    this.onClose.emit();
  }

  public formattedPreviousInfo = computed<Partial<PreviousInfo> | null>(() => {
    if(!this.alert()) return null;

    const info = this.alert()?.previousInfo;
    if (!info) return null;

    const formattedInfo: Partial<PreviousInfo> = { ...info };
    const dateFields: (keyof PreviousInfo)[] = [
      'dateTimeArrival', 'dateTimeArrivalWeigh', 'dateTimeExit',
      'dateTimeExitWeigh', 'dateTimeUnloadBegin', 'dateTimeUnloadEnd'
    ];

    for (const key of dateFields) {
      if (key in formattedInfo && formattedInfo[key]) {
        const formattedDate = this.datePipe.transform(formattedInfo[key] as string, 'd/M/yyyy HH:mm');
        (formattedInfo[key] as string) = formattedDate || (formattedInfo[key] as string);
      }
    }
    return formattedInfo;
  });
}
