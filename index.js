const fs = require("fs");
const moment = require("moment");
const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({
    headless: false, // false if you can see the browser, default is true
  });
  const page = await browser.newPage();

  // Navigate and wait until network is idle
  await page.goto("https://unegui.mn/avto-mashin/-avtomashin-zarna", {
    waitUntil: "networkidle",
  });

  // get the articles per page
  let articles = [];

  let nextBtn = true;
  let numPage = 1;
  while (nextBtn) {
    try {
      await page.waitForSelector(".list-announcement-block "); // wait for the element
      // get the title and link of each article
      const articlesPerPage = await page.$$eval(
        ".list-announcement-block ",
        (headerArticle) => {
          return headerArticle.map((article) => {
            const title = article.getElementsByClassName(
              "announcement-block__title"
            )[0].innerText;
            const link = article.getElementsByClassName(
              "announcement-block__title"
            )[0].href;

            const price = article.getElementsByClassName(
              "announcement-block__price"
            )[0].innerText;

            let mYears = title.match(/\d{4}\/\d{4}/g);
            let years = {
              man: "",
              in: "",
            };
            if (mYears.length > 0) {
              const z = mYears[0].split("/");
              years.man = z[0];
              years.in = z[1];
            }

            return JSON.stringify({
              title,
              link,
              price,
              years,
            });
          });
        }
      );

      articles.push({
        page: numPage++,
        articles: articlesPerPage,
      });

      // wait 4000ms
      await delay(2000);
     
      try {
        await page.waitForSelector(
          ".number-list-next.js-page-filter.number-list-line"
        );
      } catch (err) {
        nextBtn = false;
      }

      if (nextBtn) {
        console.log("page: ", numPage);
        // by clicking the Next button
        await page.click(".number-list-next.js-page-filter.number-list-line");
      }
    } catch (error) {
      console.log({ error });
    }
  }

  const jsonString = JSON.stringify(articles);
  fs.writeFile(
    `./outputs/${moment().format("YYYY-MM-DD_HH-mm-ss")}.json`,
    jsonString,
    (err) => {
      if (err) {
        console.log("Error writing file", err);
      } else {
        console.log("Successfully wrote file");
      }
    }
  );

  // close page and browser
  await page.close();
  await browser.close();
})();

// function to wait a while
function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
