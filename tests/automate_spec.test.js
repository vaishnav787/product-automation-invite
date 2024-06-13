const { chromium } = require("@playwright/test");

async function runAutomation() {
  // Connect to the existing browser
  const browser = await chromium.connectOverCDP("http://localhost:9222");
  const contexts = await browser.contexts();

  // Use the existing context or create a new one
  const context = contexts.length ? contexts[0] : await browser.newContext();
  const page = await context.newPage();

  // Go to your URL
  await page.goto(
    "https://ads.google.com/aw/productlinks/youtube?ocid=6555916490&tabId&euid=1190320949&__u=4809930701&uscid=6555916490&__c=9882550010&authuser=0"
  );
  await page.waitForTimeout(2000);

  const pageTitle = await page.title();
  console.log('Page title:', pageTitle);

  // If the title indicates that it's the sign-in page, perform login actions
  if (pageTitle === 'Google Ads – Sign in') {
    console.log('Performing login actions...');

    await page.waitForSelector('xpath=//*[text()="Use another account"]')
    await page.click('xpath=//*[text()="Use another account"]')

    // Fill email
    await page.fill('xpath=//*[@id="identifierId"]', 'abhijeet.jagadale@promodome.in');
    await page.waitForTimeout(1000);

    // Click next button
    await page.click('xpath=//*[@class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 BqKGqe Jskylb TrZEUc lw1w4b"]');
    await page.waitForTimeout(1000);

    // Fill password
    await page.fill('xpath=//*[@type="password"]', 'Abhijeet@2023');
    await page.waitForTimeout(1000);

    // Click next button
    await page.click('xpath=//*[@class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 BqKGqe Jskylb TrZEUc lw1w4b"]');
    await page.waitForTimeout(1000);

  }

    await page.waitForSelector('xpath=//tab-button[@aria-label="Received"]');
    await page.click('xpath=//tab-button[@aria-label="Received"]');
    await page.waitForTimeout(2000);

    let viewRequestSelector = 'xpath=(//*[text()="View request"])[1]';
    let approveSelector = 'xpath=(//*[text()="Approve"])[1]';

    while (true) {
      try {
        // Wait for the "View request" button to appear
        await page.waitForSelector(viewRequestSelector, { timeout: 2000 });

        // Click the "View request" button
        await page.click(viewRequestSelector);

        // Wait for a moment for the "Approve" button to load
        await page.waitForTimeout(5000);

        // Wait for the "Approve" button to appear
        await page.waitForSelector(approveSelector, { timeout: 2000 });

        // Click the "Approve" button
        await page.click(approveSelector);

        // Wait for a moment for the action to complete
        await page.waitForTimeout(2000);
      } catch (error) {
        // If no more "View request" buttons are found, break the loop
        console.log('No more "View request" buttons found or an error occurred:', error.message);
        break;
      }
    }
  
  await page.close();

  // Close the browser if desired
  await browser.close();
};


module.exports = { runAutomation };