import { Component, inject } from '@angular/core';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { LocationsStore } from '../../store/locations.store';

@Component({
  selector: 'config-location-select',
  templateUrl: './location-select.component.html',
  imports: [FormsModule, MultiSelectModule],
})
export class LocationSelectComponent {
  public readonly locationsStore = inject(LocationsStore);

  constructor() {}

  onSelect(selectedOrigins: Array<number>) {
    if (selectedOrigins.length !== 1) return;

    this.locationsStore.changeLocation(selectedOrigins[0]);
  }
}
