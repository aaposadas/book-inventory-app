import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Book } from '../models/book.interface';

@Injectable({ providedIn: 'root' })
export class BookService {
  private apiUrl = `${environment.apiUrl}/books`;

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  getBook(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  updateBook(id: string, book: Book): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, book);
  }

  deleteBook(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addBookByIsbn(isbn: string): Observable<Book> {
    return this.http.post<Book>(`${this.apiUrl}/isbn/${isbn}`, {});
  }
}
