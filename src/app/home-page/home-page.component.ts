import { Component } from '@angular/core';
import { BookCreatorComponent } from '../book-creator/book-creator.component';
import { BookListComponent } from '../book-list/book-list.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [BookListComponent, BookCreatorComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {}
