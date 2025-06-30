import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import {
  isGreaterThan,
  formatDateFromMilisecs,
} from '@shared/utils/date.utils';
import { ResidueType } from 'app/features/residue-types/models/residue-type';
import { TruckDetailViewModel } from '../../../view-models/truck-detail.view-model';
import { SmallLocationViewModel } from 'app/features/locations/view-model/location.view-model';
import { HopperViewModel } from 'app/modules/plant-operators/features/hoppers/view-models/hopper.view-model';
import { DialogService } from 'primeng/dynamicdialog';
import { UpdateValidationDialogComponent } from '../../update-validation-dialog/update-validation-dialog.component';


interface FormFields {
  originIds: FormControl<Array<number>>;
  residueTypeId: FormControl<string>;
  arrivalWeight: FormControl<number | null>;
  dateTimeUnload: FormControl<Date | null>;
  hopperId: FormControl<number | null>;
  exitWeight: FormControl<number | null>;
}

@Component({
  selector: 'plant-trucks-update-form',
  templateUrl: 'update-form.component.html',
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    SelectModule,
    FloatLabelModule,
    DividerModule,
    InputTextModule,
    ButtonModule,
    MultiSelectModule,
    DatePickerModule,
    InputNumberModule,
  ],
})
export class UpdateFormComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly translateService = inject(TranslateService);
  private readonly dialogService = inject(DialogService);

  public readonly truck = input.required<TruckDetailViewModel>();
  public readonly locations = input<Array<SmallLocationViewModel>>();
  public readonly hoppers = input<Array<HopperViewModel>>();
  public readonly residueTypes = input<Array<ResidueType>>();

  onTruckUpdate = output<any>();

  public truckForm!: FormGroup;

  public isPartialEdit = signal<boolean>(true);
  public currentDate = new Date();

  public container = computed(() => {
    if (this.truck().containers.length === 0) return '-';

    return this.truck()
      .containers.map(({ code }) => code)
      .join(', ');
  });
  public residueWeight = computed(() => {
    const data = this.truck();

    if (!data || data.weightResidue < 0) return '-';

    return `${data.weightResidue} kg`;
  });

  constructor() {
    effect(() => {
      const truck = this.truck();

      if (!truck) return;

      const canBeFullEdited = this.canBeFullEdited(truck);

      this.isPartialEdit.set(!canBeFullEdited);

      if (!this.isPartialEdit()) return;

      this.disableForms([
        'arrivalWeight',
        'exitWeight',
        'hopperId',
        'dateTimeUnload',
      ]);
    });

    effect(() => {
      const isPartialEdit = this.isPartialEdit();

      if (!isPartialEdit) return;

      this.notifyUntilFullEditable(this.truck().canBeModifyAfter);
    });
  }

  public ngOnInit(): void {
    const truck = this.truck();
    if (!truck) return;

    let dateTime: Date | null = null;

    if (this.truck().dateTimeUnloadBegin)
      //@ts-ignore
      dateTime = new Date(this.truck().dateTimeUnloadBegin);

    this.truckForm = new FormGroup<FormFields>({
      originIds: new FormControl<Array<number>>(
        truck.origins?.map((location) => location.locationId) ?? [],
        { nonNullable: true }
      ),
      residueTypeId: new FormControl<string>(
        this.truck().residueTypes?.[0] ?? '',
        { nonNullable: true }
      ),
      arrivalWeight: new FormControl<number | null>(this.truck().arrivalWeight),
      dateTimeUnload: new FormControl<Date | null>(dateTime),
      hopperId: new FormControl<number | null>(
        this.truck()?.hopper?.id ?? null
      ),
      exitWeight: new FormControl<number | null>(this.truck().exitWeight),
    });
  }

  public async handleSubmit() {
    if (this.truckForm.invalid) {
      const invalidFields: string[] = [];

      if (this.truckForm.get('dateTimeUnload')?.invalid) {
        invalidFields.push(
          this.translateService.instant(
            'truck.form.entrySection.fields.unloadDate'
          )
        );
      }
      if (this.truckForm.get('originIds')?.invalid) {
        invalidFields.push(
          this.translateService.instant('truck.form.entrySection.fields.origin')
        );
      }
      if (this.truckForm.get('arrivalWeight')?.invalid) {
        invalidFields.push(
          this.translateService.instant(
            'truck.form.entrySection.fields.entryWeight'
          )
        );
      }
      if (this.truckForm.get('exitWeight')?.invalid) {
        invalidFields.push(
          this.translateService.instant(
            'truck.form.entrySection.fields.exitWeight'
          )
        );
      }
      if (this.truckForm.get('hopperId')?.invalid) {
        invalidFields.push(
          this.translateService.instant('truck.form.entrySection.fields.hopper')
        );
      }

      const msg = invalidFields.join(', ');
      this.messageService.add({
        severity: 'error',
        summary: this.translateService.instant(
          'truck.errors.missingFields.title'
        ),
        detail: msg,
      });
      return;
    }

    // TODO: controlar que se modifica origen o tipo de residuo
    let originsHasChanged = this.truckForm.get('originIds')?.dirty;
    let residueTipeHasChanged = this.truckForm.get('residueTypeId')?.dirty;

    const value = this.truckForm.value;

    if (originsHasChanged || residueTipeHasChanged) {
      //TODO mandar un confirmdialog para indicarle al usuario que se ha modificado origen o tipo de residuo y que debera volver a validar la entrada
      value.validatedByLocationId = null;
    } else {
      value.validatedByLocationId = this.truck().validatedByLocationId;
    }

    if (value.dateTimeUnload)
      value.dateTimeUnload = new Date(value.dateTimeUnload).toISOString();

    if (originsHasChanged || residueTipeHasChanged) {
      this.dialogService.open(UpdateValidationDialogComponent, {
        header: '',
        modal: true,
        inputValues: {
          truckEntry: {
            truck: this.truck(),
            newValues: value,
          },
          truckUpdater: this.onValidationSubmit,
        },
      });
    }
    else {
      this.onTruckUpdate.emit(this.truckForm.value);
    }
  }

  public onValidationSubmit = (pin?: string) => {
    const newValues = {
      ...this.truckForm.value,
      pin
    }
    this.onTruckUpdate.emit(newValues);
  }

  public handleCancel() {
    const truck = this.truck();

    if (!truck) return;

    const {
      origins,
      residueTypes,
      arrivalWeight,
      dateTimeUnloadBegin,
      hopper,
      exitWeight,
    } = truck;

    this.truckForm.reset({
      originIds: origins.map((location) => location.locationId),
      residueTypeId: residueTypes,
      arrivalWeight: arrivalWeight,
      dateTimeUnload: dateTimeUnloadBegin,
      hopperId: hopper?.id,
      exitWeight: exitWeight,
    });

    this.router.navigate(['planta', 'trucks']);
  }

  private canBeFullEdited(truck: TruckDetailViewModel): boolean {
    if (truck.datetimeExit) return true;

    if (!truck.canBeModifyAfter) return true;

    if (isGreaterThan(new Date(), new Date(truck.canBeModifyAfter)))
      return true;

    return false;
  }

  private disableForms(formFields: Array<keyof FormFields>): void {
    formFields.forEach((field) => this.truckForm.get(field)?.disable());
  }

  private notifyUntilFullEditable(allowedModifyDate: Date) {
    const currentTime = new Date().getTime();
    const timeLeft = allowedModifyDate.getTime() - currentTime;
    const dateFormated = formatDateFromMilisecs(timeLeft);

    this.messageService.add({
      severity: 'warn',
      summary: this.translateService.instant('truck.errors.notEditable.title'),
      detail: this.translateService.instant(
        'truck.errors.notEditable.description',
        { mins: dateFormated.minutes, secs: dateFormated.seconds }
      ),
    });
  }

  get originsOptions() {
    return this.locations()?.map((origin) => ({
      value: origin.locationId,
      label: origin.name
    }));
  }

  get residueTypeOptions() {
    return this.residueTypes()?.map((residueType) => ({
      value: residueType,
      label: this.translateService.instant(`enums.residueTypes.${residueType}`),
    }));
  }

  get hoppersOptions() {
    return this.hoppers()?.map((hopper) => ({
      value: hopper.id,
      label: hopper.name,
    }));
  }
}
