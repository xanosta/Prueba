import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChipModule } from 'primeng/chip';

import { CommonModule } from '@angular/common';
import { ContainerLocations } from '../../models/container-locations';

@Component({
  selector: 'containers-location-chip',
  imports: [CommonModule, ChipModule],
  template: ` <p class="card-redesing__tag">{{ label }}</p> `,
})
export class ContainersLocationChip {
  @Input()
  public location!: string;

  constructor(private readonly translateService: TranslateService) {}

  ngOnInit(): void {
    if (
      !Object.values(ContainerLocations).includes(
        this.location as ContainerLocations
      )
    )
      throw new Error(
        `[ContainerLocationChip] ${this.location} is not a valid location`
      );
  }

  get locations() {
    return ContainerLocations;
  }

  get label() {
    return this.translateService.instant(
      `enums.containerState.${this.location}`
    );
  }
}
