import { Component, OnInit, signal, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BarcodeFormat } from '@zxing/library';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { BookService } from '../../core/services/book.service';
import { Book } from '../../core/models/book.interface';
import { MatIcon } from '@angular/material/icon';
import { ErrorAlert } from '../../shared/components/error-alert/error-alert';
import { LoadingState } from '../../shared/components/loading-state/loading-state';
import { BooksTableComponent } from './components/books-table/books-table.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { EditBookComponent } from './components/edit-book/edit-book.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIcon,
    ErrorAlert,
    LoadingState,
    BooksTableComponent,
    AddBookComponent,
    EditBookComponent,
  ],
})
export class HomeComponent implements OnInit {
  books = signal<Book[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Modal states
  showAddModal = signal(false);
  showEditModal = signal(false);
  isEditing = signal(false);
  scannerEnabled = signal(false);

  // Forms
  isbnInput = signal('');
  selectedBook = signal<Book | null>(null);
  newCategory = '';

  // Scanner config
  readonly formats: BarcodeFormat[] = [BarcodeFormat.EAN_13, BarcodeFormat.EAN_8];

  constructor(
    private bookService: BookService,
    private destroyRef: DestroyRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading.set(true);
    this.error.set(null);

    this.bookService
      .getBooks()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (data) => this.books.set(data),
        error: (err) => {
          console.error('Error fetching books:', err);

          // Don't show error if it's a 401 (handled by interceptor)
          if (err.status !== 401) {
            this.error.set('Failed to load books. Please try again.');
          }
        },
      });
  }
  openAddModal(): void {
    this.showAddModal.set(true);
    this.isbnInput.set('');
    // Enable scanner after modal opens
    setTimeout(() => this.scannerEnabled.set(true), 100);
  }

  closeAddModal(): void {
    this.showAddModal.set(false);
    this.scannerEnabled.set(false);
    this.isbnInput.set('');
  }

  addBookByIsbn(): void {
    const isbn = this.isbnInput();
    if (!isbn.trim()) {
      return;
    }

    this.loading.set(true);

    this.bookService
      .addBookByIsbn(isbn)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (book) => {
          // Immutable update
          this.books.update((books) => [...books, book]);
          this.closeAddModal();
        },
        error: (err) => {
          console.error('Error adding book:', err);
          this.error.set('Book not found or could not be added.');
        },
      });
  }

  // Handlers for child components
  handleAdd(isbn: string) {
    // kept for backward compatibility if needed
    this.isbnInput.set(isbn);
    // child AddBook now performs the add and will emit 'added' with the new book
  }

  handleSaveBook(updated: Book) {
    // child component handles update and will emit this event after successful save
    this.books.update((books) => books.map((b) => (b.id === updated.id ? updated : b)));
    this.closeEditModal();
  }

  handleAddedBook(book: Book) {
    this.books.update((books) => [...books, book]);
  }

  handleDeletedBook(id?: string) {
    if (!id) return;
    this.books.update((books) => books.filter((b) => b.id !== id));
  }


  openEditModal(book: Book): void {
    // Deep copy to avoid mutations
    this.selectedBook.set({
      ...book,
      categories: [...(book.categories || [])],
    });

    this.isEditing.set(false);
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
    this.isEditing.set(false);
    this.selectedBook.set(null);
  }

  toggleEdit(state?: boolean): void {
    if (typeof state === 'boolean') {
      this.isEditing.set(state);
    } else {
      this.isEditing.update((val) => !val);
    }
  }

  get currentUser() {
    return this.authService.currentUser;
  }
}
