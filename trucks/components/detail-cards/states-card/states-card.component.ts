import { Component, input } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: 'states-card',
  templateUrl: 'states-card.component.html',
  styleUrl: 'states-card.component.scss',
  imports: [ TranslateModule],
})
export class StatesCardComponent {
  public location = input<string>();
  public validated = input<boolean>();
}
