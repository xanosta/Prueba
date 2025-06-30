import { Component, input } from "@angular/core";
import { DividerModule } from "primeng/divider";

import { TruckPlateComponent } from "app/features/trucks/components/truck-plate/truck-plate.component";

@Component({
  selector: 'truck-info-card',
  templateUrl: 'truck-info-card.component.html',
  styleUrl: 'truck-info-card.component.scss',
  imports: [TruckPlateComponent, DividerModule]
})
export class TruckInfoCardComponent {
  public plate = input<string>("-");
  public model = input<string>();
  public company = input<string>();
}
