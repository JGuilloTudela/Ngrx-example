import { Routes } from '@angular/router';
import { BookDetailsComponent } from './book-details/book-details.component';

export const routes: Routes = [
  {
    path: 'book/:id',
    component: BookDetailsComponent,
  },
];
