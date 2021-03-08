import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { createBook, SharedTestingModule } from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
      providers: [
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('loadReadingList$', () => {
    it('should work', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.init());

      effects.loadReadingList$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush([]);
    });
  });

  describe('addBook$', () => {
    it('should work', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.addToReadingList({ 'book': createBook('B') }));

      effects.addBook$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.confirmedAddToReadingList({ book: createBook('B') })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush([createBook('B')]);
    });
  });

  describe('removeBook$', () => {
    it('should work', done => {
      actions = new ReplaySubject();
      const item = {
        bookId: 'B',
        title: 'A',
        authors: ['A'],
        description: 'A'
      }
      actions.next(ReadingListActions.removeFromReadingList({
        item
      }));

      effects.removeBook$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.confirmedRemoveFromReadingList({
            item
          })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list/B').flush([]);
    });
  });

  describe('markAsRead$', () => {
    it('should work', done => {
      actions = new ReplaySubject();
      const item = {
        bookId: 'A',
        title: 'A',
        authors: ['A'],
        description: 'A'
      }
      actions.next(ReadingListActions.markAsRead({
        item
      }));

      effects.markAsRead$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.confirmedMarkAsRead({
            item
          })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list/A/finished').flush([]);
    });
  });
});
