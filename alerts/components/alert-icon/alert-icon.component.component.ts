import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsStore } from 'app/modules/plant-operators/features/alerts/store/alerts.store';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';

@Component({
  selector: 'alert-icon',
  templateUrl: 'alert-icon.component.html',
  styleUrl: 'alert-icon.component.scss',
  imports: [OverlayBadgeModule, BadgeModule],
})
export class AlertIcon {
  private readonly router = inject(Router);
  public readonly alertsStore = inject(AlertsStore);

  constructor() {}

  public handleClick(): void {
    this.router.navigate(['planta', 'alerts']);
  }
}
