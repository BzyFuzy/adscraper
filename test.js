const fs = require("fs");
const moment = require("moment");
const list = require("./outputs/2022-06-08_20-33-24.json");

const parseList = list.reduce((prev, curr) => {
  let temp = curr.articles.map((el) => JSON.parse(el));
  return (prev = [...prev, ...temp]);
}, []);

const jsonString = JSON.stringify(parseList);
fs.writeFile(
  `./outputs/${moment().format("YYYY-MM-DD_HH-mm-ss")}-parsed.json`,
  jsonString,
  (err) => {
    if (err) {
      console.log("Error writing file", err);
    } else {
      console.log("Successfully wrote file");
    }
  }
);
