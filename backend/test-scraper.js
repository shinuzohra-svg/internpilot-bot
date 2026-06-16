const { chromium } = require('playwright');

async function testScrape() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('Navigating to Internshala...');
  try {
    // Search HR internships
    await page.goto('https://internshala.com/internships/human-resources-hr-internship/', { waitUntil: 'domcontentloaded', timeout: 15000 });
    
    console.log('Waiting for job cards...');
    await page.waitForSelector('.internship_meta', { timeout: 10000 });
    
    const jobs = await page.$$eval('.individual_internship', elements => {
      return elements.slice(0, 10).map(el => {
        const titleEl = el.querySelector('.job-title-href');
        const companyEl = el.querySelector('.company-name');
        
        return {
          title: titleEl ? titleEl.innerText.trim() : 'Unknown',
          company: companyEl ? companyEl.innerText.trim() : 'Unknown',
          url: titleEl ? 'https://internshala.com' + titleEl.getAttribute('href') : ''
        };
      });
    });
    
    console.log('Found Jobs:', jobs);
  } catch (e) {
    console.error('Scraping failed:', e.message);
  } finally {
    await browser.close();
  }
}

testScrape();
