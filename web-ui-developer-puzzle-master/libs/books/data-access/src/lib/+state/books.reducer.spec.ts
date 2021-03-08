import { initialState, reducer, State } from './books.reducer';
import * as BooksActions from './books.actions';
import { createBook } from '@tmo/shared/testing';

describe('Books Reducer', () => {
  describe('valid Books actions', () => {
    it('loadBooksSuccess should return set the list of known Books', () => {
      const books = [createBook('A'), createBook('B'), createBook('C')];
      const action = BooksActions.searchBooksSuccess({ books });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(3);
    });
  });

  describe('invalid Books actions', () => {
    it('searchBooksFailure should return the errors occurred during search', () => {
      const searchFailErr = BooksActions.searchBooksFailure({ error: 'error' });

      const result: State = reducer(initialState, searchFailErr);

      expect(result.loaded).toBe(false);
      expect(result.error).toBeDefined();
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
