import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  getBooksError,
  getBooksLoaded,
  ReadingListBook,
  searchBooks
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit, OnDestroy {
  books: ReadingListBook[];
  spinner = false;
  componentSubcription: Subscription[] = [];
  errFlag = false;

  searchForm = this.fb.group({
    term: ''
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder
  ) { }

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {

    this.componentSubcription.push(

      this.searchForm.valueChanges.subscribe(term => {
        this.spinner = true;
        this.store.dispatch(searchBooks({ term: this.searchTerm }));
        this.componentSubcription.push(
          this.store.select(getBooksError).subscribe((err => {
            if (err) {
              this.spinner = false;
              this.errFlag = true;
            } else {
              this.errFlag = false;
            }
          }))
        );
      }),

      this.store.select(getAllBooks).subscribe(books => {
        this.books = books;
      }),

      this.store.select(getBooksLoaded).subscribe((loaded => {
        if (!loaded && this.searchForm.value.term) {
          this.spinner = true;
        } else {
          this.spinner = false;
        }
      }))
    );
  }

  formatDate(date: void | string) {
    return date
      ? new Intl.DateTimeFormat('en-US').format(new Date(date))
      : undefined;
  }

  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
  }

  searchExample() {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }

  searchBooks() {
    if (this.searchForm.value.term) {
      this.spinner = true;
      this.store.dispatch(searchBooks({ term: this.searchTerm }));
      this.componentSubcription.push(
        this.store.select(getBooksError).subscribe((err => {
          if (err) {
            this.spinner = false;
            this.errFlag = true;
          } else {
            this.errFlag = false;
          }
        }))
      );
    } else {
      this.store.dispatch(clearSearch());
    }
  }

  ngOnDestroy() {
    this.componentSubcription.forEach(s => s.unsubscribe());
  }
}
