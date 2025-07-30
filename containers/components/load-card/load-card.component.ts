import {
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { DividerModule } from 'primeng/divider';
import { ResidueTypeChipComponent } from '@features/residue-types/components/residue-type-chip/residue-type-chip.component';
import { TruckPlateComponent } from '@features/trucks/components/truck-plate/truck-plate.component';
import { ContainerLoadViewModel } from '../../view-models/container-load.view-model';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

export interface UnloadWeightUpdate {
  id: number;
  newValue: number;
}

@Component({
  selector: 'containers-load-card',
  templateUrl: './load-card.component.html',
  styleUrl: 'load-card.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ResidueTypeChipComponent,
    InputNumberModule,
    TruckPlateComponent,
    DividerModule,
    ToastModule
  ],
})
export class ContainerLoadCard implements OnInit, OnDestroy {
  public load = input.required<ContainerLoadViewModel>();
  unloadWeightChange = output<UnloadWeightUpdate>();

  private readonly messageService = inject(MessageService);
  private readonly translateService = inject(TranslateService);

  public truckResidueWeight = computed(() =>
    this.load()?.truckResidueWeight
  );

  public loadForm!: FormGroup;
  private readonly fb = inject(FormBuilder);
  private weightSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.loadForm = this.fb.group({
      unloadWeight: [
        this.load().unloadWeight,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(this.load().truckResidueWeight),
        ],
      ],
    });

    const unloadWeightControl = this.loadForm.get('unloadWeight');

    if (unloadWeightControl) {
      this.weightSubscription = unloadWeightControl.valueChanges.subscribe(() => {
        const currentLoadId = this.load().id;
        const newValue = unloadWeightControl.value;

        if (!unloadWeightControl.valid) {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('container.messages.invalidWeight.title'),
            detail: this.translateService.instant('container.messages.invalidWeight.description', {
              plate: this.load().truckPlate,
              maxWeight: this.load().truckResidueWeight,
            }),
          });
        }

        this.unloadWeightChange.emit({
          id: currentLoadId,
          newValue: newValue,
        });
      });
    }
  }

  ngOnDestroy(): void {
    if (this.weightSubscription) {
      this.weightSubscription.unsubscribe();
    }
  }

  public clearValidationState(): void {
    const ctrl = this.loadForm.get('unloadWeight');
    if (!ctrl) {
      return;
    }

    ctrl.markAsPristine({ emitEvent: false });
    ctrl.markAsUntouched({ emitEvent: false });

    ctrl.updateValueAndValidity({ onlySelf: true, emitEvent: false }); // :contentReference[oaicite:2]{index=2}
  }

  public resetUnloadWeight(original: number): void {
    const ctrl = this.loadForm.get('unloadWeight');
    if (!ctrl) return;

    ctrl.setValue(original, { emitEvent: false });
    this.loadForm.markAsPristine();
    this.loadForm.markAsUntouched();
  }

  get loadWeightIsInvalid() {
    return (
      this.loadForm.get('unloadWeight')?.touched &&
      this.loadForm.get('unloadWeight')?.dirty &&
      this.loadForm.get('unloadWeight')?.invalid
    );
  }
}
