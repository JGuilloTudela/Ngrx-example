import { CommonModule } from '@angular/common';
import { Component, OnInit, Signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BookCreatorComponent } from '../book-creator/book-creator.component';
import { BookDetailsComponent } from '../book-details/book-details.component';
import { booksFacade } from '../store/books';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    BookCreatorComponent,
    CommonModule,
    RouterOutlet,
    RouterLink,
    BookDetailsComponent,
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
})
export class BookListComponent implements OnInit {
  readonly booksFeature = booksFacade();

  readonly books = this.booksFeature.books;
  readonly totalBooks: Signal<number | undefined> =
    this.booksFeature.totalBooks;

  ngOnInit() {
    this.booksFeature.list();
  }
}
