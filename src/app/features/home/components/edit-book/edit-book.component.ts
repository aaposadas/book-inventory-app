import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from '../../../../core/models/book.interface';
import { BookService } from '../../../../core/services/book.service';

@Component({
  selector: 'app-edit-book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-book.component.html',
})
export class EditBookComponent {
  @Input() book: Book | null = null;
  @Input() isEditing = false;
  @Input() placeholder = 'https://via.placeholder.com/150x200?text=No+Cover';

  @Output() close = new EventEmitter<void>();
  @Output() toggleEdit = new EventEmitter<boolean>();
  @Output() saveBook = new EventEmitter<Book>();
  @Output() delete = new EventEmitter<string | undefined>();

  form: FormGroup;
  deleting = false;
  // categories (tag-like) input handling
  categories: string[] = [];

  // small input control is part of the form so template binds cleanly
  // we'll use formControlName 'categoryInput' for the typing box
  constructor(private fb: FormBuilder, private bookService: BookService) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      description: [''],
      coverUrl: [''],
      categoryInput: [''],
    });
  }

  ngOnChanges(): void {
    if (this.book) {
      this.form.patchValue({
        title: this.book.title,
        author: this.book.author,
        description: this.book.description,
        coverUrl: this.book.coverUrl,
      });
      // copy categories so user can edit tags locally
      this.categories = [...(this.book.categories || [])];
      // clear the input box
      this.form.get('categoryInput')?.setValue('');
    }
  }

  save() {
    if (!this.book) return;
    const updated: Book = { ...this.book, ...this.form.value, categories: this.categories };
    this.bookService.updateBook(updated.id!, updated).subscribe({
      next: () => this.saveBook.emit(updated),
      error: (err) => console.error('Update failed', err),
    });
  }

  // Category helpers
  onCategoryKey(event: KeyboardEvent) {
    const key = event.key;
    // treat Enter or Space as add triggers
    if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
      event.preventDefault();
      const val = (this.form.get('categoryInput')?.value || '').toString().trim();
      if (val) this.addCategory(val);
      this.form.get('categoryInput')?.setValue('');
    }
  }

  addCategory(value: string) {
    const v = value.trim();
    if (!v) return;
    // avoid duplicates (case-insensitive)
    const exists = this.categories.some((c) => c.toLowerCase() === v.toLowerCase());
    if (!exists) this.categories.push(v);
  }

  removeCategoryByValue(value: string) {
    this.categories = this.categories.filter((c) => c !== value);
  }

  confirmDelete() {
    if (!this.book?.id) return;
    if (!confirm('Are you sure you want to delete this book?')) return;
    this.deleting = true;
    this.bookService.deleteBook(this.book.id).subscribe({
      next: () => {
        this.deleting = false;
        this.delete.emit(this.book?.id);
      },
      error: (err) => {
        this.deleting = false;
        console.error('Delete failed', err);
      },
    });
  }
}
