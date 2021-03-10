#### Code review

- No Spinner or Loading indication is displayed to the user while fetching data from server.
- Error handling is not done.
- Even for the same search term, search api is invoked unnecessarily.
- In book-search.component.ts, getAllBooks store select is not unsubscribed.
- Few test cases are failing and not all the cases are covered in scripts.
- Search operation should be invoked on each Key press in the search field.
- Ordering of the imports is not maintained as Core, Third Party, Application imports.
- There are no proper comments.
- Standard Ngrx folder structure is not followed.
- Takes considerable time to fetch and load searched book details.


#### Manually found Accessibility issues

- Not able to navigate to "javascript" through tab navigation.
- Few form elements and buttons are missing accessibility labels.
- alt attribute is not set for all the Book cover images.
