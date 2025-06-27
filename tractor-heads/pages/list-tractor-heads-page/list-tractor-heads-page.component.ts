import { Component, inject } from '@angular/core';
import { TractorHeadsStore } from '../../store/tractor-heads.store';
import { ListTractorHeadsPageFiltersComponent } from '../../components/list-tractor-heads-page-filters/list-tractor-heads-page-filters.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { EmptyPageMessageComponent } from '@shared/components/empty-page-message/empty-page-message.component';
import { CloseButtonComponent } from '@shared/components/buttons/close-button/close-button.component';
import { TractorHeadCardComponent } from '../../components/card/tractor-head-card.component';

@Component({
    standalone: true,
    templateUrl: './list-tractor-heads-page.component.html',
    imports: [
        PageHeaderComponent,
        EmptyPageMessageComponent,
        CloseButtonComponent,
        ListTractorHeadsPageFiltersComponent,
        TractorHeadCardComponent,
    ],
})
export class ListTractorHeadsPageComponent {
    public tractorHeadsStore = inject(TractorHeadsStore);

    handleFiltersOpen(): void {
        this.tractorHeadsStore.openFilters();
    }

    handleFiltersClose(): void {
        this.tractorHeadsStore.closeFilters();
    }
}