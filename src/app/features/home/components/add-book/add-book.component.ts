import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { BookService } from '../../../../core/services/book.service';
import { Book } from '../../../../core/models/book.interface';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [CommonModule, FormsModule, ZXingScannerModule],
  templateUrl: './add-book.component.html',
})
export class AddBookComponent {
  @Input() isbn = '';
  @Input() loading = false;
  @Input() scannerEnabled = false;
  @Input() formats: BarcodeFormat[] = [BarcodeFormat.EAN_13, BarcodeFormat.EAN_8];

  @Output() isbnChange = new EventEmitter<string>();
  @Output() add = new EventEmitter<string>();
  @Output() added = new EventEmitter<Book>();
  @Output() close = new EventEmitter<void>();

  scanSuccess = false;
  scanMessage = '';
  processing = false;

  constructor(private bookService: BookService) {}

  handleScan(result: string) {
    // Guard: if we're already processing an add, ignore further scans
    if (this.processing) return;

    this.isbn = result;
    this.isbnChange.emit(this.isbn);
    this.scanSuccess = true;
    this.scanMessage = 'Successfully scanned!';
    // auto-clear after short delay
    setTimeout(() => {
      this.scanSuccess = false;
      this.scanMessage = '';
    }, 2500);

    // auto-attempt add
    this.onAdd();
  }

  onAdd() {
    const isbn = this.isbn?.trim();
    if (!isbn) return;

    // Prevent re-entry
    if (this.processing) return;
    this.processing = true;

    this.loading = true;
    this.bookService.addBookByIsbn(isbn).subscribe({
      next: (book) => {
        this.loading = false;
        this.processing = false;
        this.isbnChange.emit('');
        this.added.emit(book);
        this.close.emit();
      },
      error: (err) => {
        console.error('Add book failed', err);
        this.loading = false;
        this.processing = false;
      },
    });
  }
}
