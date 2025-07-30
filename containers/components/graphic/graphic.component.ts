import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ContainerLoad } from '../../../hoppers/models/hopper-event';

@Component({
  selector: 'graphic',
  templateUrl: './graphic.component.html',
  styleUrl: './graphic.component.scss',
  imports: [CommonModule],
})
export class GraphicComponent {
  public containerLoads = input.required<Array<ContainerLoad>>();
  public containerCapacity = input.required<number>();

  get sortedLoads(): Array<ContainerLoad> {
    return [...this.containerLoads()].sort(
      (a, b) => b.unloadWeight - a.unloadWeight
    );
  }
}
