import { $, $$, browser, by, element, ExpectedConditions } from 'protractor';

describe('When: I use the reading list feature', () => {
  it('Then: I should see my reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );

  });


  it('Then: I should be able to add book to reading list and UNDO it when user clicks UNDO button on the snackbar', async () => {

    await browser.get('/');
    const inputForm = await $('form');
    const searchInput = await $('input[type="search"]');
    await searchInput.sendKeys('javascript');
    await inputForm.submit();

    const isWantToReadBtnEnabled = await browser.isElementPresent(element(by.css('[data-testing="book-item"] button:not(:disabled)')));
    if (!isWantToReadBtnEnabled) return;

    const readingListItemsBeforeAdd = await $$('.reading-list-item');

    const firstEnabledWantToReadBtn = await $$('[data-testing="book-item"] button:not(:disabled)').first();
    await firstEnabledWantToReadBtn.click();

    const snackBarUndoBtn = await browser.driver.findElement(by.css('.mat-simple-snackbar-action .mat-button'));
    snackBarUndoBtn.click();

    const readingListItemsAfterAdd = await $$('.reading-list-item');
    expect(readingListItemsBeforeAdd.length).toEqual(readingListItemsAfterAdd.length)

  });

  it('Then: I should be able to delete the book from reading list and UNDO it when user clicks UNDO button on the snackbar', async () => {

    await browser.get('/');

    let readingListItemsBeforeAdd = await $$('.reading-list-item');

    if (readingListItemsBeforeAdd && readingListItemsBeforeAdd.length === 0) {
      const inputForm = await $('form');
      const searchInput = await $('input[type="search"]');
      await searchInput.sendKeys('javascript');
      await inputForm.submit();
      const isWantToReadBtnEnabled = await browser.isElementPresent(element(by.css('[data-testing="book-item"] button:not(:disabled)')));
      if (isWantToReadBtnEnabled) {
        const firstEnabledWantToReadBtn = await $$('[data-testing="book-item"] button:not(:disabled)').first();
        await firstEnabledWantToReadBtn.click();
        readingListItemsBeforeAdd = await $$('.reading-list-item');
      } else return;
    }
    const readingListToggleBtn = await $('[data-testing="toggle-reading-list"]');
    await readingListToggleBtn.click();

    if (readingListItemsBeforeAdd && readingListItemsBeforeAdd.length === 0) return;

    const readingListRemoveBtn = await $$('.reading-list-item .mat-icon-button ').first();
    readingListRemoveBtn.click();

    const snackBarUndoBtn = await browser.driver.findElement(by.css('.mat-simple-snackbar-action .mat-button'));
    snackBarUndoBtn.click();

    const readingListItemsAfterAdd = await $$('.reading-list-item');

    expect(readingListItemsBeforeAdd.length).toEqual(readingListItemsAfterAdd.length);

    const clsList = await element(by.id('close'))
    await clsList.click();

  });

});
