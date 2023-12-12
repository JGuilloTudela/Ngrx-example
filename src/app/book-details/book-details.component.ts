import { Component, Input } from '@angular/core';
import { booksFacade } from '../store/books';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [],
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss'],
})
export class BookDetailsComponent {
  @Input({ alias: 'id', required: true }) set bookId(id: number) {
    console.log(id);
    this.booksFeature.bookSelected(id);
  } // <-- REQUIRED INPUT FROM ROUTE

  readonly booksFeature = booksFacade();
  readonly currentBook = this.booksFeature.selectCurrentBook;
}
