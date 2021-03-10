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

  it('Then: I should be able to add book to reading list and mark it as READ', async () => {
    await browser.get('/');

    const inputForm = await $('form');
    const searchInput = await $('input[type="search"]');
    await searchInput.sendKeys('javascript');
    await inputForm.submit();

    const isWantToReadBtnEnabled = await browser.isElementPresent(element(by.css('[data-testing="book-item"] button:not(:disabled)')));
    if (!isWantToReadBtnEnabled) return;

    const firstEnabledWantToReadBtn = await $$('[data-testing="book-item"] button:not(:disabled)').first();
    await firstEnabledWantToReadBtn.click();

    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    const finishBtn = await $$('.reading-list-item .finish').first();
    await finishBtn.click();

  });
});
