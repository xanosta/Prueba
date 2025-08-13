import {
  Component,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { HoppersDetailFiltersComponent } from '../../components/detail-hopper-filters/detail-hopper-filters.component';
import { ContainerInHopperStayComponent } from '../../components/container-in-hopper-stay/container-in-hopper-stay.component';
import { HeaderComponent } from '@shared/components/header/header.component';
import { PlantOperatorBreadCrumbsComponent } from '../../../breadcrumbs/components/plant-operators-breadcrumbs.component';
import { DetailsHoppersStore } from '../../store/hopper-detail/detail-hopper.store';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { IconComponent } from "@shared/components/icon/icon.component";
import { Router } from '@angular/router';
import { HoppersStore } from '../../store/hoppers/hoppers.store';

@Component({
  templateUrl: './hopper-detail-page.component.html',
  imports: [
    CommonModule,
    TranslateModule,
    FloatLabelModule,
    ProgressSpinnerModule,
    HoppersDetailFiltersComponent,
    ContainerInHopperStayComponent,
    HeaderComponent,
    PlantOperatorBreadCrumbsComponent,
    LoaderComponent,
    IconComponent,
  ],
})
export class HopperDetailPage {
  public hopperId = input.required({ transform: numberAttribute });

  public filtersVisible = signal<boolean>(false);

  public readonly breadcrumbs = computed(() => [
    { label: this.detailsHopperStore.selectedHopper()?.name || '', link: `/planta/hoppers/${this.hopperId()}` },
  ]);

  public readonly detailsHopperStore = inject(DetailsHoppersStore);
  private readonly hoppersStore = inject(HoppersStore);
  private readonly router = inject(Router);

  constructor(){
    effect(()=>{
      if (!this.hopperId()) return;
      const locationHoppers = this.hoppersStore.locationHoppers();

      if (!locationHoppers.some(({ id }) => id === this.hopperId())) {
        this.router.navigate(['planta']);
      }

      this.detailsHopperStore.setSelectedHopper(this.hopperId());
    })
  }

  public changeFiltersVisibility(): void {
    this.filtersVisible.set(!this.filtersVisible());
  }
}
