import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { BookCreatorStore } from './book-creator.store';
import { Step1Component } from './step-1/step-1.component';
import { Step2Component } from './step-2/step-2.component';
import { Step3Component } from './step-3/step-3.component';

@Component({
  selector: 'app-book-creator',
  standalone: true,
  imports: [
    Step1Component,
    Step2Component,
    Step3Component,
    AsyncPipe,
    JsonPipe,
    NgIf,
  ],
  templateUrl: './book-creator.component.html',
  styleUrl: './book-creator.component.scss',
  providers: [BookCreatorStore],
})
export class BookCreatorComponent implements OnDestroy {
  bookCreatorStore = inject(BookCreatorStore);

  ngOnDestroy(): void {
    this.bookCreatorStore.setState({ valid: false });
  }
  step = 0;
  book$ = this.bookCreatorStore.book$;

  prev() {
    if (this.step > 0) {
      this.step -= 1;
    }
  }

  submit() {
    console.log('SUBMIT');
    this.bookCreatorStore.submit$();
    this.step = 0;
    this.bookCreatorStore.resetState();
  }
}
