import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { AppIcons } from '@shared/types/appIcons';
import { NavbarEntry } from '@shared/components/navbar-entry/navbar-entry.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';

@Component({
    selector: 'domiciliary-operators-layout',
    templateUrl: './domiciliary-operators-layout.component.html',
    imports: [
        RouterOutlet,
        FooterComponent,
        ToastModule,
        ConfirmDialogModule,
        NavbarComponent,
    ],
})
export class DomiciliaryOperatorsLayoutComponent {
    private readonly translateService = inject(TranslateService);

    public readonly navbarEntries: Array<NavbarEntry> = [
        {
            type: 'simple',
            icon: AppIcons.TRUCK,
            label: this.translateService.instant(
                'routes.domiciliaryOperators.trucks'
            ),
            link: '/domiciliarios/trucks',
        },
    ];
}