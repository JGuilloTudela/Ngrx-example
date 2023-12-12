import { inject, makeEnvironmentProviders } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Actions, createEffect, ofType, provideEffects } from '@ngrx/effects';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { provideRouterStore } from '@ngrx/router-store';
import {
  Store,
  createActionGroup,
  createFeature,
  createReducer,
  createSelector,
  emptyProps,
  on,
  props,
  provideState,
} from '@ngrx/store';
import { exhaustMap, map, of } from 'rxjs';

//INTERFACES
export interface Book {
  id: number;
  title: string | null;
  author: string | null;
  year?: number;
}

interface BooksState extends EntityState<Book> {
  currentBookId: number | null;
}

const bookAdapter: EntityAdapter<Book> = createEntityAdapter<Book>();

const initialState: BooksState = bookAdapter.getInitialState({
  currentBookId: null,
});

const booksActions = createActionGroup({
  source: 'Books',
  events: {
    list: emptyProps(),
    booksSelected: props<{ id: number }>(), // <-- camelCase
    booksLoadedSuccess: props<{ books: Book[] }>(),
    'Books Loaded Failure': props<{ error: string }>(),
    addBook: props<{ book: Book }>(),
  },
});

const booksFeature = createFeature({
  name: 'books',
  reducer: createReducer(
    initialState,
    on(booksActions.list, (state) => {
      return {
        ...state,
      };
    }),
    on(booksActions.booksSelected, (state, action) => {
      return {
        ...state,
        currentBookId: action.id,
      };
    }),
    on(booksActions.booksLoadedSuccess, (state, action) =>
      bookAdapter.setAll(action.books, state)
    ),
    on(booksActions.addBook, (state, action) =>
      bookAdapter.addOne({ ...action.book, id: state.ids.length+1 }, state)
    )
  ),
  extraSelectors: ({
    selectBooksState,
    selectEntities,
    selectCurrentBookId,
  }) => ({
    ...bookAdapter.getSelectors(selectBooksState), // <-- Adapter Selectors
    selectCurrentBook: createSelector(
      selectEntities,
      selectCurrentBookId,
      (books, id) => (id ? books[id] : null)
    ),
  }),
});

const loadBooks$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(booksActions.list),
      exhaustMap(() =>
        of([
          {
            id: 1,
            title: 'The Fellowship of the Ring',
            author: 'J. R. R. Tolkien',
          },
          {
            id: 2,
            title: 'The Two Towers',
            author: 'J. R. R. Tolkien',
          },
          {
            id: 3,
            title: 'The Return of the King',
            author: 'J. R. R. Tolkien',
          },
          {
            id: 4,
            title: 'The Hobbit',
            author: 'J. R. R. Tolkien',
          },
          {
            id: 5,
            title: 'The Silmarillion',
            author: 'J. R. R. Tolkien',
          },
        ]).pipe(map((books) => booksActions.booksLoadedSuccess({ books })))
      )
    );
  },
  { functional: true } // <-- FUNCTIONAL EFFECT
);

export const provideBooksFeature = () =>
  makeEnvironmentProviders([
    provideState(booksFeature),
    provideEffects({ loadBooks$ }),
    provideRouterStore(),
  ]);

export const booksFacade = () => {
  const store = inject(Store);
  return {
    list: () => store.dispatch(booksActions.list()),
    bookSelected: (id: number) =>
      store.dispatch(booksActions.booksSelected({ id })),
    selectCurrentBook: store.selectSignal(booksFeature.selectCurrentBook),
    books: store.selectSignal(booksFeature.selectAll), // <-- As Signal
    books$: store.select(booksFeature.selectAll), // <-- As Observable
    totalBooks: toSignal(store.select(booksFeature.selectTotal)), // <-- From Observable To Signal
    addBook: (book: Book) => store.dispatch(booksActions.addBook({ book })),
  };
};
