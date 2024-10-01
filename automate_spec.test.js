const { chromium } = require("@playwright/test");
const nodemailer = require('nodemailer');

async function sendEmail(subject, message) {
  console.log('Preparing to send email...');
  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'tech@promodome.in',
          pass: 'kozb zvha ured yxrb'
      }
  });

  const mailOptions = {
      from: 'tech@promodome.in',
      to: 'gaurav.kadam@promodome.in,vaishnav.nair@promodome.in,aman.ansari@promodome.in,ansh.ved@promodome.in,usama.shaikh@promodome.in,abhijeet.jagadale@promodome.in,juned.shaikh@promodome.in,yash.yadav@promodome.in',
      subject: subject,
      text: message
  };

  try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
  } catch (error) {
      console.error('Error sending email:', error);
  }
}

async function runAutomation() {
  let channelIds = [];
  try {
    const browser = await chromium.connectOverCDP("http://localhost:9222");
    const contexts = await browser.contexts();
    const context = contexts.length ? contexts[0] : await browser.newContext();
    const page = await context.newPage();

    console.log("Navigating to the URL...");
    await page.goto("https://ads.google.com/aw/productlinks/youtube", { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // Increase timeout if needed

    if ((await page.title()).includes("Sign in")) {
      console.log("Performing login actions...");
      try {
          // Check if "Use another account" is present
          const useAnotherAccountExists = await page.isVisible('xpath=//*[text()="Use another account"]', { timeout: 3000 });
          if (useAnotherAccountExists) {
              await page.click('xpath=//*[text()="Use another account"]');
          }

          // Fill email and password
          await page.fill('xpath=//*[@id="identifierId"]', "abhijeet.jagadale@promodome.in");
          await page.click('xpath=//*[text()="Next"]');
          await page.waitForTimeout(2000); // Adjust this wait time

          // Wait for password input to appear
          await page.waitForSelector('xpath=//*[@type="password"]', { timeout: 5000 });
          await page.fill('xpath=//*[@type="password"]', "Abhijeet@2023");
          await page.click('xpath=//*[text()="Next"]');
          
          // Wait for navigation after login
          await page.waitForTimeout(3000);
      } catch (error) {
          console.log("Error during login:", error.message);

          // Confirm that login actually failed
          const currentPageTitle = await page.title();
          if (currentPageTitle.includes("Sign in")) {
              const emailSubject = 'Error: Login failed Playwright';
              const emailMessage = `Issue during Playwright automation login.\n\nDetails:\n- Error Message: ${error.message}\n- Timestamp: ${new Date().toLocaleString()}`;
              await sendEmail(emailSubject, emailMessage);
              console.log('Stopping execution due to login failure.');
              process.exit(1);
          } else {
              console.log("Unexpected error, but login seems successful. Continuing...");
          }
      }
    }

    // If login is successful, proceed to next steps
    console.log("Navigating to the 'Received' tab...");
    await page.waitForSelector('xpath=//tab-button[@aria-label="Received"]', { timeout: 3000 });
    await page.click('xpath=//tab-button[@aria-label="Received"]');
    await page.waitForTimeout(1000);

    let viewRequestSelector = 'xpath=(//*[text()="View request"])[1]';
    let approveSelector = 'xpath=(//*[text()="Approve"])[1]';
    
    while (true) {
      try {
        console.log('Waiting for "View request" button...');
        await page.waitForSelector(viewRequestSelector, { timeout: 3000 });
        await page.click(viewRequestSelector);

        console.log('Waiting for "Approve" button...');
        await page.waitForTimeout(1000);
        await page.click(approveSelector);
        await page.waitForTimeout(1000);

        console.log("Checking for the channel links...");
        const channelLinkSelector = 'a.channel-link';
        await page.waitForSelector(channelLinkSelector, { timeout: 3000 });

        const hrefValue = await page.$eval(channelLinkSelector, element => element.href);
        const channelId = hrefValue.split('/').pop();
        channelIds.push(channelId);
        console.log(`Approved Channel ID: ${channelId}`);

      } catch (error) {
        console.log('No more "View request" buttons found or an error occurred:', error.message);
        break;
      }
    }

    if (channelIds.length > 0) {
      channelIds.forEach(channelId => {
        console.log(`Channel ID: ${channelId}`);
      });
    } else {
      console.log("No channel links found.");
    }

    await page.close();
    await browser.close();

  } catch (error) {
    console.error("Unexpected error:", error.message);
  }

  return channelIds;
}

module.exports = { runAutomation };
