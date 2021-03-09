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
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit, OnDestroy {
  books: ReadingListBook[];
  spinner = false;
  componentSubcription: Subscription[] = [];
  errorFlag = false;
  previousSearchTerm = '';
  errorContent = '';

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

      this.searchForm.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(term => {
        this.searchBooks();
      }),

      this.store.select(getBooksError).subscribe((errorResponse => {
        if (errorResponse) {
          this.store.dispatch(clearSearch());
          this.spinner = false;
          this.errorFlag = true;
          if (errorResponse['error'] && (errorResponse['error']['statusCode'] === 404
            || errorResponse['error']['statusCode'] === 422)) {
            this.errorContent = errorResponse['error']['message'];
          } else {
            this.errorContent = "Something went wrong! Couldn't fetch Book details for the given search term!";
          }
        } else {
          this.errorFlag = false;
        }
      })),

      this.store.select(getAllBooks).subscribe(books => {
        this.books = books;
      }),

      this.store.select(getBooksLoaded).subscribe((loaded => {
        if (!loaded && this.searchForm.value.term) {
          this.spinner = true;
        } else {
          this.previousSearchTerm = this.searchForm.value.term;
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
      if (this.previousSearchTerm !== this.searchForm.value.term) {
        this.spinner = true;
        this.store.dispatch(searchBooks({ term: this.searchTerm }));
      }
    } else {
      this.store.dispatch(clearSearch());
      this.errorFlag = false;
    }
  }

  ngOnDestroy() {
    this.componentSubcription.forEach(s => s.unsubscribe());
  }
}
