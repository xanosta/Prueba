import { Component, input } from "@angular/core";
import { ContainerViewModel } from "../../../view-models/truck-detail.view-model";

@Component({
  selector: 'containers-detail-card',
  templateUrl: 'containers-card.component.html',
  styleUrl: 'containers-card.component.scss',
})
export class ContainersCardComponent {
  public containers = input<Array<ContainerViewModel>>();
}
