const { chromium } = require("@playwright/test");

async function runAutomation() {
  // Connect to the existing browser
  const browser = await chromium.connectOverCDP("http://localhost:9222");
  const contexts = await browser.contexts();
  // Use the existing context or create a new one
  const context = contexts.length ? contexts[0] : await browser.newContext();
  const page = await context.newPage();

  console.log("Navigating to the URL...");
  await page.goto(
    "https://ads.google.com/aw/productlinks/youtube?ocid=6555916490&tabId&euid=1190320949&__u=4809930701&uscid=6555916490&__c=9882550010&authuser=0"
  );
  await page.waitForTimeout(2000);

  if ((await page.title()).includes("Sign in")) {
    console.log("Performing login actions...");
    await page.waitForTimeout(1000);
    try {
      // Check if "Use another account" button is present
      await page.screenshot({
        path: "D:Playwright/images/before_use_another_account_click.png",
      });
      const useAnotherAccountExists = await page.isVisible(
        'xpath=//*[text()="Use another account"]',
        { timeout: 2000 }
      );

      if (useAnotherAccountExists) {
        await page.screenshot({
          path: "D:Playwright/images/before_use_another_account_click.png",
        });
        await page.click('xpath=//*[text()="Use another account"]');
        await page.screenshot({
          path: "D:Playwright/images/after_use_another_account_click.png",
        });
      }

      // Fill email and password
      await page.fill(
        'xpath=//*[@id="identifierId"]',
        "abhijeet.jagadale@promodome.in"
      );
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: "D:Playwright/images/after_email_id.png",
      });
      await page.click('xpath=//*[text()="Next"]');
      await page.waitForTimeout(1000);
      await page.fill('xpath=//*[@type="password"]', "Abhijeet@2023");
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: "D:Playwright/images/after_password.png",
      });
      await page.screenshot({
        path: "/var/www/screenshots/before_password_next_click.png",
      });
      await page.click('xpath=//*[text()="Next"]');
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: "/var/www/screenshots/after_password_next_click.png",
      });
    } catch (error) {
      console.log("Error during login:", error.message);
    }
  }

  // post-login actions
  try {
    console.log("VeeFly_VAC_Client_Orders");
    await page.waitForSelector('xpath=//tab-button[@aria-label="Received"]', {
      timeout: 30000,
    });
    await page.screenshot({
      path: "/var/www/screenshots/before_received_click.png",
    });
    await page.click('xpath=//tab-button[@aria-label="Received"]');
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: "/var/www/screenshots/after_received_click.png",
    });

    let viewRequestSelector = 'xpath=(//*[text()="View request"])[1]';
    let approveSelector = 'xpath=(//*[text()="Approve"])[1]';

    while (true) {
      try {
        console.log('Waiting for "View request" button...');
        await page.waitForSelector(viewRequestSelector, { timeout: 2000 });
        await page.screenshot({
          path: "/var/www/screenshots/before_view_request_click.png",
        });
        await page.click(viewRequestSelector);

        console.log('Waiting for "Approve" button...');
        await page.waitForTimeout(5000);
        await page.waitForSelector(approveSelector, { timeout: 2000 });
        await page.screenshot({
          path: "/var/www/screenshots/before_approve_click.png",
        });
        await page.click(approveSelector);

        await page.waitForTimeout(2000);
      } catch (error) {
        console.log(
          'No more "View request" buttons found or an error occurred:',
          error.message
        );
        break;
      }
    }
  } catch (error) {
    console.log("Error handling requests:", error.message);
  }

  await page.close();
  await browser.close();
}

module.exports = { runAutomation };
