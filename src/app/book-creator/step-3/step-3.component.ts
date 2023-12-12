import { Component, Input, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  Validators
} from '@angular/forms';
import { skip } from 'rxjs';
import { BookCreatorStore } from '../book-creator.store';

@Component({
  selector: 'app-step-3',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './step-3.component.html',
  styleUrl: './step-3.component.scss',
})
export class Step3Component {
  @Input() readOnly = false;
  @Input({ required: true }) set year(year: number | null) {
    this.form.get('year')?.setValue(year);
  }

  private _formBuilder = inject(UntypedFormBuilder);
  private _bookCreatorStore = inject(BookCreatorStore);

  form = this._formBuilder.group({ year: [null, Validators.required] });

  constructor() {
    this.form
      .get('year')
      ?.valueChanges.pipe(takeUntilDestroyed(), skip(1))
      .subscribe((value) =>
        this._bookCreatorStore.updateBook({ year: value })
      );
  }
}
