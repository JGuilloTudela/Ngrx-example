import { Component, Input, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, skip } from 'rxjs';
import { BookCreatorStore } from '../book-creator.store';

@Component({
  selector: 'app-step-2',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './step-2.component.html',
  styleUrl: './step-2.component.scss',
})
export class Step2Component {
  @Input() readOnly = false;
  @Input({ required: true }) set author(author: string | null) {
    this.form.get('author')?.setValue(author);
  }

  private _formBuilder = inject(FormBuilder);
  private _bookCreatorStore = inject(BookCreatorStore);
  form = this._formBuilder.group({ author: ['', Validators.required] });

  constructor() {
    this._bookCreatorStore.updateBook$(
      this.form.get('author')!.valueChanges.pipe(
        skip(1),
        map((value) => ({ author: value }))
      )
    );
  }
}
