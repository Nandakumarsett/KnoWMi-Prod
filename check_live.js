import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure().errorText);
  });
  
  try {
    await page.goto('https://knowmi.in', { waitUntil: 'networkidle0' });
    const content = await page.evaluate(() => document.getElementById('root').innerHTML);
    if (content.trim() === '') {
      console.log('RESULT: Page is completely blank (root div is empty)');
    } else {
      console.log('RESULT: Page rendered successfully. Root length:', content.length);
    }
  } catch (err) {
    console.error('SCRIPT ERROR:', err.message);
  }
  
  await browser.close();
})();
