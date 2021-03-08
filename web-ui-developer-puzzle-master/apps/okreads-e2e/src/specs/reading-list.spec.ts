import { $, $$, browser, By, by, element, ExpectedConditions } from 'protractor';

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

  it('Then: I should see addded books in my reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );


    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('javascript');
    await form.submit();


    const loadingImage = element(by.id('spinner'));
    await browser.wait(ExpectedConditions.not(ExpectedConditions.presenceOf(loadingImage)));

    await browser.wait(ExpectedConditions.presenceOf($('[data-testing="book-item"]')));
    const btn = element.all(by.buttonText('Want to Read')).first();
    await browser.wait(() => {
      btn.click();
      return ExpectedConditions.presenceOf(btn)
    },
      0
    );
    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
    await browser.wait(
      ExpectedConditions.presenceOf($('[data-testing="reading-book-item"]'))
    );

    await browser.wait(
      ExpectedConditions.presenceOf($('[class="cdk-overlay-container"]'))
    );

    // const submit = element(by.css('mat-simple-snackbar-action'));
    // browser.wait(ExpectedConditions.visibilityOf(submit), 2000);
    // // await browser.wait(
    // //   ExpectedConditions.visibilityOf(submit)
    // // );
    // await submit.click();


  });
});
