import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';

import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputSwitchModule } from 'primeng/inputswitch';

import { LocationsStore } from 'app/features/locations/store/locations.store';

export type EditEntityFieldType = 'text' | 'number' | 'select' | 'switch';
export type EditEntityFieldOptionsKey = 'locations';

export type EditEntityFieldOption = Record<string, unknown>;

export interface EditEntityFieldConfig {
  id: string;
  label: string;
  type: EditEntityFieldType;
  placeholder?: string;
  validators?: ValidatorFn[];
  options?: EditEntityFieldOption[];
  optionsKey?: EditEntityFieldOptionsKey;
  optionLabel?: string;
  optionValue?: string;
  defaultValue?: unknown;
  layout?: 'default' | 'row';
  inputType?: string;
}

export type EditEntityFieldSection = EditEntityFieldConfig[];

@Component({
  selector: 'app-edit-entity-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
    InputSwitchModule,
  ],
  templateUrl: './edit-entity-dialog.component.html',
})
export class EditEntityDialogComponent implements OnInit, OnChanges {
  private readonly fb = inject(FormBuilder);
  protected readonly ref = inject(DynamicDialogRef);
  protected readonly config = inject(DynamicDialogConfig);
  protected readonly locationsStore = inject(LocationsStore);

  @Input()
  public entityKey!: string;

  @Input()
  public formGroupName = 'entityForm';

  @Input()
  public fields: EditEntityFieldSection[] = [];

  public entityForm: FormGroup = this.fb.group({});

  ngOnInit(): void {
    this.buildForm();
    this.patchEntityData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fields'] && !changes['fields'].firstChange) {
      this.buildForm();
      this.patchEntityData();
    }

    if (changes['entityKey'] && !changes['entityKey'].firstChange) {
      this.patchEntityData();
    }
  }

  public get sections(): EditEntityFieldSection[] {
    return this.fields ?? [];
  }

  public resolveOptions(
    field: EditEntityFieldConfig,
  ): EditEntityFieldOption[] | undefined {
    if (field.optionsKey === 'locations') {
      const { locations } = this.locationsStore as {
        locations?: () => EditEntityFieldOption[];
      };

      return locations?.() ?? [];
    }

    return field.options;
  }

  public save(): void {
    this.entityForm.markAllAsTouched();

    if (this.entityForm.invalid) {
      return;
    }

    this.ref.close(this.entityForm.value);
  }

  public cancel(): void {
    this.ref.close();
  }

  private buildForm(): void {
    const controlsConfig: Record<string, [unknown, ValidatorFn[]]> = {};

    for (const section of this.sections) {
      for (const field of section) {
        controlsConfig[field.id] = [
          this.getInitialValue(field),
          field.validators ?? [],
        ];
      }
    }

    this.entityForm = this.fb.group(controlsConfig);
  }

  private getInitialValue(field: EditEntityFieldConfig): unknown {
    if (field.defaultValue !== undefined) {
      return field.defaultValue;
    }

    switch (field.type) {
      case 'switch':
        return false;
      case 'number':
      case 'select':
        return null;
      default:
        return '';
    }
  }

  private patchEntityData(): void {
    if (!this.entityKey || !this.config?.data) {
      return;
    }

    const entityData = this.config.data[this.entityKey];
    if (entityData) {
      this.entityForm.patchValue(entityData);
    }
  }
}
