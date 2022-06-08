const csvwriter = require("csv-writer");
const moment = require("moment");
const list = require("./outputs/2022-06-08_20-33-24.json");

const parsedList = list.reduce((prev, curr) => {
  let ads = curr.articles.map((el) => {
    let temp = JSON.parse(el);
    return { ...temp, maYear: temp.years.man, inYear: temp.years.in };
  });
  return (prev = [...prev, ...ads]);
}, []);


var createCsvWriter = csvwriter.createObjectCsvWriter;

const csvWriter = createCsvWriter({
  path: `./outputs/2022-06-08_20-33-24.csv`,
  header: [
    { id: "title", title: "title" },
    { id: "link", title: "link" },
    { id: "price", title: "price" },
    { id: "maYear", title: "YEAR MA" },
    { id: "inYear", title: "YEAR IN" },
  ],
});
csvWriter
  .writeRecords(parsedList)
  .then(() => console.log("Data uploaded into csv successfully"));
