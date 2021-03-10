import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { createBook, createReadingListItem, SharedTestingModule } from '@tmo/shared/testing';

import { ReadingListComponent } from './reading-list.component';
import { BooksFeatureModule } from '@tmo/books/feature';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReadingListItem } from '@tmo/shared/models';
import { addToReadingList, getReadingList, removeFromReadingList } from '@tmo/books/data-access';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('ReadingListComponent', () => {
  let component: ReadingListComponent;
  let fixture: ComponentFixture<ReadingListComponent>;
  let store: MockStore;

  let overlayContainerElement: HTMLElement;
  let snackBar: MatSnackBar;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule],
      providers: [provideMockStore({ initialState: { items: {} } }),]
    }).compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(inject([MatSnackBar, OverlayContainer],
    (matSnackBar: MatSnackBar, overlayContainer: OverlayContainer) => {
      snackBar = matSnackBar;
      overlayContainerElement = overlayContainer.getContainerElement();
    }));


  beforeEach(() => {
    fixture = TestBed.createComponent(ReadingListComponent);
    component = fixture.componentInstance;
    store.overrideSelector(getReadingList, []);
    fixture.detectChanges();
    spyOn(store, 'dispatch').and.callThrough();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove book from reading list', () => {
    fixture.detectChanges();
    const book: ReadingListItem = createReadingListItem('B');
    component.removeFromReadingList(book);
    expect(store.dispatch).toHaveBeenCalledWith(removeFromReadingList({ item: book }));
  });

  it('should remove book from reading list and trigger UNDO action', () => {
    fixture.detectChanges();
    const book: ReadingListItem = createReadingListItem('B');
    component.removeFromReadingList(book);
    expect(store.dispatch).toHaveBeenCalledWith(removeFromReadingList({ item: book }));
    const containerElement = overlayContainerElement.querySelector('snack-bar-container ')
      .getElementsByTagName('button').item(0);
    containerElement.click();
    expect(store.dispatch).toHaveBeenCalledWith(addToReadingList({ book: { id: book.bookId, ...book } }));

  });



});
