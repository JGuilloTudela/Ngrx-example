import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, take } from 'rxjs';
import { Book, booksFacade } from '../store/books';

export interface BookState {
  book?: Partial<Book>;
  valid: boolean;
}

@Injectable()
export class BookCreatorStore extends ComponentStore<BookState> {
  
  constructor() {
    super({ valid: false });
  }
  readonly book$ = this.select((state) => state.book);
  readonly valid$ = this.select((state) => state.valid);
  readonly booksFeature = booksFacade();

  readonly updateBook = this.updater((state, book: Partial<Book>) => ({
    ...state,
    book: { ...state.book, ...book },
  }));
  readonly patchValidity = (valid$: Observable<{ valid: boolean }>) =>
    this.patchState(valid$);

  readonly resetState = () => this.setState({ valid: false });

  readonly updateBook$ = this.effect((book$: Observable<Partial<Book>>) =>
    book$.pipe(
      tapResponse(
        (book) => this.updateBook(book),
        (e) => console.log(e)
      )
    )
  );

  readonly submit$ = this.effect((event) =>
    event.pipe(
      switchMap(() =>
        this.book$.pipe(
          take(1),
          tapResponse(
            (book) => {
              console.log(book);
              this.booksFeature.addBook(book as Book);
            },
            (e) => console.log(e)
          )
        )
      )
    )
  );
}
