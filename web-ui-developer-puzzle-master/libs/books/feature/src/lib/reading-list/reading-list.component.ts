import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { addToReadingList, getReadingList, removeFromReadingList } from '@tmo/books/data-access';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent {
  readingList$ = this.store.select(getReadingList);

  constructor(
    private readonly store: Store,
    private _snackBar: MatSnackBar
  ) { }

  removeFromReadingList(item) {
    this.store.dispatch(removeFromReadingList({ item }));

    const snackBarRef = this._snackBar.open("Removed from Reading List", "Undo", {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000,
    });

    snackBarRef.onAction().subscribe(() => {
      this.store.dispatch(addToReadingList({
        book: {
          id: item.bookId, ...item
        }
      }))
    });
  }
}
