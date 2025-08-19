import { Component, input } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";

import { SeverityType } from "../../models/severity";

@Component({
  selector: 'alert-severity-chip',
  templateUrl: 'alert-severity-chip.component.html',
  styleUrl: 'alert-severity-chip.component.scss',
  imports: [
    TranslatePipe
  ]
})
export class AlertSeverityChip {
  public severity = input.required<SeverityType>();
}
