import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../../../core/models/book.interface';

@Component({
  selector: 'app-books-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './books-table.component.html',
})
export class BooksTableComponent {
  @Input() books: Book[] = [];
  @Input() placeholder = 'https://via.placeholder.com/60x80?text=No+Cover';
  @Output() select = new EventEmitter<Book>();
}
