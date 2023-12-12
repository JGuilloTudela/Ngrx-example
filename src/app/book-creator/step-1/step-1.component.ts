import { Component, Input, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, skip } from 'rxjs';
import { BookCreatorStore } from '../book-creator.store';

@Component({
  selector: 'app-step-1',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './step-1.component.html',
  styleUrl: './step-1.component.scss',
})
export class Step1Component {
  @Input() readOnly = false;
  @Input({ required: true }) set title(title: string | null) {
    this.form.get('title')?.setValue(title);
  }

  private _formBuilder = inject(FormBuilder);
  private _bookCreatorStore = inject(BookCreatorStore);
  form = this._formBuilder.group({ title: ['', Validators.required] });

  constructor() {
    this.form
      .get('title')
      ?.valueChanges.pipe(takeUntilDestroyed(), skip(1))
      .subscribe((value) =>
        this._bookCreatorStore.updateBook({ title: value })
      );
    this._bookCreatorStore.patchValidity(
      this.form
        .get('title')!
        .statusChanges.pipe(
          map((valid: string) => ({ valid: valid === 'VALID' }))
        )
    );
  }
}
