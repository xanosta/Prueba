import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ResidueTypeChipComponent } from '@features/residue-types/components/residue-type-chip/residue-type-chip.component';
import { TranslateModule } from '@ngx-translate/core';
import { ChipModule } from 'primeng/chip';
import { HopperEvent } from '../../models/hopper-event';
import { TruckUnloadComponent } from '../truck-unload/truck-unload.component';
import { ContainersLocationChip } from '../../../containers/components/location-chip/location-chip.component';
import { ContainerLocations } from '../../../containers/models/container-locations';
import { GraphicComponent } from '../../../containers/components/graphic/graphic.component';

@Component({
  selector: 'hoppers-container-stay',
  templateUrl: './container-in-hopper-stay.component.html',
  styleUrl: './container-in-hopper-stay.component.scss',
  imports: [
    CommonModule,
    TranslateModule,
    ResidueTypeChipComponent,
    TruckUnloadComponent,
    ContainersLocationChip,
    ChipModule,
    GraphicComponent,
  ],
})
export class ContainerInHopperStayComponent {
  public containerStay = input.required<HopperEvent>();

  private readonly router = inject(Router);

  get inHopperState(): string {
    return ContainerLocations.IN_USE;
  }

  public handleContainerClick() {
    this.router.navigate([
      'planta',
      'containers',
      this.containerStay().containerCompact.containerStayId,
    ]);
    return;
  }
}
