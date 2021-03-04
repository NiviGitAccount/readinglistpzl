#### Code review

- No Spinner or Loading indication is displayed to the user while fetching data from server.
- Ordering of the imports is not maintained as Core, Third Party, Application imports.
- Search operation should be invoked on each Key press in the search field.
- In book-search.component.ts, getAllBooks store select is not unsubscribed.
- There is no proper comments.
- Standard Ngrx folder structure is not followed.
- Error handling is not done.
- Takes considerable time to fetch and load searched book details.


#### Manually found Accessibility issues

- Not able to navigate to "javasipt" through tab navigation.
- When no search result is found,User is not prompted.
- alt attribute is not set for all the Book cover images.
