
const puppeteer = require('puppeteer-extra')



// Import required libraries
const express = require('express');
// Create an Express application
const app = express();
const port = 8000; // Set your desired port

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
// const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// puppeteer.use(StealthPlugin())

// const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
// puppeteer.use(AdblockerPlugin({ blockTrackers: true }))


// Middleware to parse JSON requests
app.use(express.json());

// Define a route for handling POST requests
app.post('/api/automate-website', async (req, res) => {
  try {
    const { epicNo } = req.body;

    // Launch a headless browser

    puppeteer.launch({ headless: true }).then(async browser => {
        const page = await browser.newPage()
        await page.setViewport({ width: 800, height: 600 })
        
        await page.goto("https://digitalfastportal.in/");

    // Fill in the text input field
    await page.type('#loginid', "7340806456");
    await page.type('#pass', "7340806456");

    // Simulate pressing the Enter key
    await page.keyboard.press('Enter');
    
    await page.waitForTimeout(3000);
    await page.goto("https://digitalfastportal.in/admin/voteradvance1.php");


    const [inputElement] = await page.$x("/html/body/div[8]/div/div/div/section/div/form/div/div[1]/div[1]/div/div/input");

    
    // Type text into the input element
    if (inputElement) {
    await inputElement.type(epicNo);
    
    } else {
        console.error('Element not found using XPath');
    }
    
    await page.keyboard.press('Tab');

      // Send the "Enter" key
      await page.keyboard.press('Enter');
    
    
      await page.waitForTimeout(5000);

      // Get values of the specified IDs
      const values = {};
    
        const names = [
            'epicNo','photo','name','nameEng','age','nameLocal','gender','relation','fhName','fhNameLocal','tahsail','dist','ac','acLocal','partNo','partName','partNameLocal'
        ]
      // Get values of the specified XPath expressions
      const xpathList = [
        '/html/body/div[8]/div/div/div/section/div/form/div/div[1]/div[2]/div[1]/div/input',
        '/html/body/div[8]/div/div/div/section/div/form/div/div[1]/div[1]/div/div/input',
        '/html/body/div[8]/div/div/div/section/div/form/div/div[1]/div[2]/div[2]/div[1]/div/input',
        '/html/body/div[8]/div/div/div/section/div/form/div/div[1]/div[2]/div[2]/div[3]/div/input',
        '/html/body/div[8]/div/div/div/section/div/form/div/div[1]/div[2]/div[2]/div[2]/div/input',
        '/html/body/div[8]/div/div/div/section/div/form/div/div[1]/div[2]/div[2]/div[4]/div/input',
        '/html/body/div[8]/div/div/div/section/div/form/div/div[1]/div[2]/div[3]/div[1]/div/input',
        '/html/body/div[8]/div/div/div/section/div/form/div/div[1]/div[2]/div[3]/div[2]/div/input',
        '/html/body/div[8]/div/div/div/section/div/form/div/div[1]/div[2]/div[3]/div[3]/div/input',
        '/html/body/div[8]/div/div/div/section/div/form/div/div[1]/div[2]/div[4]/div/input',
        '/html/body/div[8]/div/div/div/section/div/form/div/div[1]/div[2]/div[5]/div/input',
        '/html/body/div[8]/div/div/div/section/div/form/div/div[2]/div[1]/div[1]/div/input',
        '/html/body/div[8]/div/div/div/section/div/form/div/div[2]/div[1]/div[2]/div/input',
        '/html/body/div[8]/div/div/div/section/div/form/div/div[2]/div[2]/div[1]/div/input',
        '/html/body/div[8]/div/div/div/section/div/form/div/div[2]/div[2]/div[2]/div/input',
        '/html/body/div[8]/div/div/div/section/div/form/div/div[2]/div[2]/div[3]/div/input[1]',
      ];

      for (let i = 0; i < xpathList.length; i++) {
        const [xpathElement] = await page.$x(xpathList[i]);
        if (xpathElement) {
          const xpathElementText = await page.evaluate(xpathElement => xpathElement.value, xpathElement);
          values[`${names[i]}`] = xpathElementText;
        } else {
          values[`${names[i]}`] = 'XPath element not found';
        }
      }

      res.json({ result: values });
     
        await browser.close()
      })



  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while automating the website.' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});