import puppeteer from 'puppeteer';
import * as fs from 'fs';

function storeData(path:string, data:string) {
  try {
    fs.writeFileSync(path, data)
  } catch (err) {
    console.error(err)
  }
}

async function main() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(`https://www.youtube.com/watch?v=9DKfk1VdsqY&list=UUKBnlTTgEnhIXv_c4LvvyMQ&index=2`);
  for(let i=0;i<1500;i++){
    const transcriptions = await page.waitForSelector( 'ytd-video-primary-info-renderer', { visible: true } );
    await page.waitForTimeout(1000);
    const init = await page.evaluate(() => {
      let bt:HTMLElement = document.querySelector('ytd-app')?.
      querySelector('div#content')?.
      querySelector('ytd-page-manager#page-manager')?.
      querySelector('ytd-watch-flexy')?.
      querySelector('div#columns')?.
      querySelector('div#primary')?.
      querySelector('div#primary-inner')?.
      querySelector('div#info')?.
      querySelector('div#info-contents')?.
      querySelector('ytd-video-primary-info-renderer')?.
      querySelector('div#container')?.
      querySelector('div#info')?.
      querySelector('div#menu-container')?.
      querySelector('div#menu')?.
      querySelector('ytd-menu-renderer')?.
      querySelector('yt-icon-button#button.dropdown-trigger') as HTMLElement;
      if(bt){
        bt.click();
        return true;
      }
    });
    if(!init)
      continue;
    await page.waitForTimeout(1000)
    const clicou = await page.evaluate(() => {
      let open = Array.from(document.querySelectorAll('yt-formatted-string')).find(el => el.textContent === 'Open transcript');
      let bt: HTMLElement = open as HTMLElement;
      if(bt){
        bt.click();
        return true;
      }
    });
    let pageTitle = await page.title();
    pageTitle = pageTitle.replace(' - YouTube','');
    let content = '';
    if(clicou) {
      await page.waitForTimeout(2000)
      content = await page.evaluate(() => {
        let text = document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-transcript"]')?.textContent;
        return text??'';
      });
      content=content.replace(/\n               /g,'\n');
      content=content.replace(/\n              /g,'\n');
      content=content.replace(/\n             /g,'\n');
      content=content.replace(/\n            /g,'\n');
      content=content.replace(/\n           /g,'\n');
      content=content.replace(/\n          /g,'\n');
      content=content.replace(/\n         /g,'\n');
      content=content.replace(/\n        /g,'\n');
      content=content.replace(/\n       /g,'\n');
      content=content.replace(/\n      /g,'\n');
      content=content.replace(/\n     /g,'\n');
      content=content.replace(/\n    /g,'\n');
      content=content.replace(/\n   /g,'\n');
      content=content.replace(/\n  /g,'\n');
      content=content.replace(/\n /g,'\n');
      content=content.replace(/\n\n\n/g,'\n');
      content=content.replace(/\n\n/g,'\n');
      content=content.replace(/\n\n/g,'\n');
      content=content.toLowerCase();
    }
    storeData(`./subtitles/${pageTitle}.txt`,content);
    if(!content){
      await page.waitForTimeout(10000);
    }
    await page.evaluate(() => {
      let bt: HTMLElement = document?.querySelector('div.ytp-chrome-bottom')?.
      querySelector('div.ytp-chrome-controls')?.
      querySelector('div.ytp-left-controls')?.
      querySelector('a.ytp-next-button.ytp-button') as HTMLElement;
      bt.click();
    });
  }
  browser.close();
}

main();
