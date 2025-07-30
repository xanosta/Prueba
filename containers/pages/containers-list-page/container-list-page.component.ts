import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { PlantOperatorBreadCrumbsComponent } from '../../../breadcrumbs/components/plant-operators-breadcrumbs.component';
import { ContainersStore } from '../../store/containers.store';
import { LoaderComponent } from '../../../../../../shared/components/loader/loader.component';
import { PlantOperatorsContainersFilters } from '../../components/containers-list-page-filters/containers-list-page-filters.component';
import { EmptyPageMessageComponent } from '../../../../../../shared/components/empty-page-message/empty-page-message.component';
import { ContainerCardComponent } from '../../components/container-card/container-card.component';
import { ContainerViewModel } from '../../view-models/container.view-model';
import { HeaderComponent } from '@shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IconComponent } from '@shared/components/icon/icon.component';

@Component({
  templateUrl: './container-list-page.component.html',
  imports: [
    PlantOperatorBreadCrumbsComponent,
    HeaderComponent,
    LoaderComponent,
    PlantOperatorsContainersFilters,
    EmptyPageMessageComponent,
    ContainerCardComponent,
    CommonModule,
    TranslateModule,
    IconComponent
  ],
})
export class ContainersListPageComponent {
  public readonly breadcrumbs = [
    { label: 'containers', link: '/planta/containers' },
  ];

  public readonly containersStore = inject(ContainersStore);
  private readonly router = inject(Router);

  public handleOpenFilters(): void {
    this.containersStore.toggleFilters();
  }

  handleCardClick($event: ContainerViewModel) {
    this.router.navigateByUrl(`/planta/containers/${$event.id}`);
  }
}
