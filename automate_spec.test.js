const { chromium } = require("@playwright/test");

async function runAutomation() {
  let channelIds=[];
  try {
    // Connect to the existing browser instance
    const browser = await chromium.connectOverCDP("http://localhost:9222");
    const contexts = await browser.contexts();
    const context = contexts.length ? contexts[0] : await browser.newContext();
    const page = await context.newPage();

    console.log("Navigating to the URL...");
    await page.goto("https://ads.google.com/aw/productlinks/youtube?ocid=6555916490&tabId&euid=1190320949&__u=4809930701&uscid=6555916490&__c=9882550010&authuser=0", { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    if ((await page.title()).includes("Sign in")) {
      console.log("Performing login actions...");
      await page.waitForTimeout(1000);

      try {
        const useAnotherAccountExists = await page.isVisible('xpath=//*[text()="Use another account"]', { timeout: 1000 });
        if (useAnotherAccountExists) {
          await page.click('xpath=//*[text()="Use another account"]');
        }

        await page.fill('xpath=//*[@id="identifierId"]', "abhijeet.jagadale@promodome.in");
        await page.waitForTimeout(1000);
        await page.click('xpath=//*[text()="Next"]');
        await page.waitForTimeout(2000);
        await page.fill('xpath=//*[@type="password"]', "Abhijeet@2023");
        await page.waitForTimeout(1000);
        await page.click('xpath=//*[text()="Next"]');
        await page.waitForTimeout(3000);

      } catch (loginError) {
        console.error("Error during login:", loginError.message);
      }
    }

    try {
      console.log("Navigating to the 'Received' tab...");
      await page.waitForSelector('xpath=//tab-button[@aria-label="Received"]', { timeout: 1000 });
      await page.click('xpath=//tab-button[@aria-label="Received"]');
      await page.waitForTimeout(1000);

      console.log("Checking for the channel links...");
      const channelLinkSelector = 'a.channel-link'; // Selector for the channel link elements

      // Wait for the channel links to be visible
      await page.waitForSelector(channelLinkSelector, { timeout: 1000 });

      // Extract only channel IDs
      channelIds = await page.$$eval(channelLinkSelector, elements => {
        return elements.map(element => {
          const href = element.href;
          return href.split('/').pop();
        });
      });

      // Log the channel IDs
      if (channelIds.length > 0) {
        channelIds.forEach(channelId => {
          console.log(`Channel ID: ${channelId}`);
        });
      } else {
        console.log("No channel links found.");
      }

    } catch (navigationError) {
      console.error("Error checking for channel links:", navigationError.message);
    }

    await page.close();
    await browser.close();

  } catch (error) {
    console.error("Unexpected error:", error.message);
  }

  return channelIds;
}

module.exports = { runAutomation };

//     let viewRequestSelector = 'xpath=(//*[text()="View request"])[1]';
//     let approveSelector = 'xpath=(//*[text()="Approve"])[1]';

//     const approvedLinks = [];

//     while (true) {
//       try {
//         console.log('Waiting for "View request" button...');
//         await page.waitForSelector(viewRequestSelector, { timeout: 2000 });
//         await page.click(viewRequestSelector);

//         const channelLinkSelector = 'a.channel-link';
//         await page.waitForSelector(channelLinkSelector, { timeout: 1000 });
//         const hrefValue = await page.$eval(channelLinkSelector, element => element.href);
//         approvedLinks.push(hrefValue);
//         console.log('Approved link:', hrefValue);

//         console.log('Waiting for "Approve" button...');
//         await page.waitForTimeout(5000);
//         await page.waitForSelector(approveSelector, { timeout: 2000 });
//         await page.click(approveSelector);

//         await page.waitForTimeout(2000);
//       } catch (error) {
//         console.log(
//           'No more "View request" buttons found or an error occurred:',
//           error.message
//         );
//         break;
//       }
//     }
//     console.log("Approved Links:", approvedLinks);
//   } catch (error) {
//     console.log("Error handling requests:", error.message);
//   }

//   await page.close();
//   await browser.close();
// }

// module.exports = { runAutomation };
