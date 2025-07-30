import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { AppIcons } from '@shared/types/appIcons';
import { TranslateService } from '@ngx-translate/core';
import { NavbarEntry } from '@shared/components/navbar-entry/navbar-entry.component';

@Component({
  templateUrl: './tractor-heads-operators-layout.component.html',
  imports: [
    RouterOutlet,
    FooterComponent,
    ToastModule,
    ConfirmDialogModule,
    NavbarComponent,
  ],
})
export class TractorHeadsOperatorsLayoutComponent {
  private readonly translateService = inject(TranslateService);
  public readonly navbarEntries: Array<NavbarEntry> = [
    {
      type: 'simple',
      icon: AppIcons.CONTAINER,
      label: this.translateService.instant(
        'routes.tractorHeadsOperators.containers'
      ),
      link: '/cabezas-tractoras/containers',
    },
  ];
}
