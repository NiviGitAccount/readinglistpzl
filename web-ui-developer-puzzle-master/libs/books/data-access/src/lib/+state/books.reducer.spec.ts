import { initialState, reducer, State } from './books.reducer';
import * as BooksActions from './books.actions';
import { createBook } from '@tmo/shared/testing';

describe('Books Reducer', () => {
  describe('valid Books actions', () => {

    it('should search books', () => {
      const searchAction = BooksActions.searchBooks({ term: 'angular' });

      const result: State = reducer(initialState, searchAction);

      expect(result.searchTerm).toBe('angular');
    });

    it('loadBooksSuccess should return set the list of known Books', () => {
      const books = [createBook('A'), createBook('B'), createBook('C')];
      const successAction = BooksActions.searchBooksSuccess({ books });

      const result: State = reducer(initialState, successAction);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(3);
    });

    it('clearSearch should clear the search', () => {
      const books = [createBook('A'), createBook('B'), createBook('C')];
      const clearAction = BooksActions.clearSearch();

      const result: State = reducer({ ...initialState, ...books }, clearAction);

      expect(result.ids.length).toBe(0);
    });

    it('searchBooksFailure should return remove the list of known Books', () => {
      const books = [createBook('A'), createBook('B'), createBook('C')];
      const searchFailErr = BooksActions.searchBooksFailure({ error: { status: 500 } });

      const result: State = reducer({ ...initialState, ...books }, searchFailErr);

      expect(result.loaded).toBe(false);
      expect(result.ids.length).toBe(0);
    });

  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
