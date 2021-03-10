import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createBook, SharedTestingModule } from '@tmo/shared/testing';

import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { addToReadingList, getAllBooks, getBooksError, getBooksLoaded } from '@tmo/books/data-access';
import { Book } from '@tmo/shared/models';

describe('ProductsListComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let store: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule],
      providers: [provideMockStore({ initialState: { books: { entities: [] } } }),]
    }).compileComponents();
    store = TestBed.inject(MockStore);
  }));

  afterEach(() => {
    fixture.destroy();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    store.overrideSelector(getBooksLoaded, false);
    store.overrideSelector(getAllBooks, []);
    spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should add book to reading list', () => {
    fixture.detectChanges();
    const book: Book = createBook('B');
    component.addBookToReadingList(book);
    expect(store.dispatch).toHaveBeenCalledWith(addToReadingList({ book }));
  });

  it('should  search books with the search term', () => {
    fixture.detectChanges();
    component.searchForm.value.term = 'science';
    store.overrideSelector(getBooksLoaded, true);
    store.overrideSelector(getAllBooks, [{ ...createBook('A'), isAdded: false }]);
    store.refreshState();
    component.searchBooks();
    expect(component.books.length).toBeGreaterThan(0);
  });

  it('should dispatch selector on Search query', () => {
    fixture.detectChanges();
    store.overrideSelector(getBooksLoaded, true);
    store.overrideSelector(getAllBooks, [{ ...createBook('A'), isAdded: false }]);
    store.refreshState();
    component.searchExample();
    expect(component.books.length).toBeGreaterThan(0);
  });

  it('should display No result found error message', () => {
    component.searchForm.value.term = 'java123345435843fgjdsfj';
    store.overrideSelector(getBooksLoaded, false);
    store.overrideSelector(getBooksError, {
      error: {
        statusCode: 404,
        message: "not found"
      }
    })
    store.refreshState();
    component.searchBooks();
    fixture.detectChanges();
    expect(component.books.length).toBe(0);
    expect(component.errorFlag).toBe(true);
    expect(component.errorContent).toBe("not found");
  });

  it('should display No result found error message', () => {
    component.searchForm.value.term = 'java123345435843fgjdsfj';
    store.overrideSelector(getBooksLoaded, false);
    store.overrideSelector(getBooksError, {
      error: {
        statusCode: 422,
        message: "not found"
      }
    })
    store.refreshState();
    component.searchBooks();
    fixture.detectChanges();
    expect(component.books.length).toBe(0);
    expect(component.errorFlag).toBe(true);
    expect(component.errorContent).toBe("not found");
  });

  it('should display invalid input error message', () => {
    fixture.detectChanges();
    component.searchForm.value.term = '  ';
    store.overrideSelector(getBooksLoaded, false);
    store.overrideSelector(getBooksError, 'other_errors')
    store.refreshState();
    component.searchBooks();
    expect(component.books.length).toBe(0);
    expect(component.errorFlag).toBe(true);
    expect(component.errorContent).toBe("Something went wrong! Couldn't fetch Book details for the given search term!");
  });

  it('should clear search query and dispatch clear state action', () => {
    fixture.detectChanges();
    component.searchForm.value.term = '';
    component.searchBooks();
  });

});
