import * as actions from "./actionTypes";
import { csvToObjects } from "../util/processFile";

export const parseCSV = (file) => {
  const reader = new FileReader();
  reader.readAsText(file[0]);

  return function (dispatch) {
    reader.onload = function () {
      const json = csvToObjects(reader.result);
      dispatch(setFullData(csvToObjects(reader.result)));
    };
    reader.onerror = () => {
      dispatch(parseError);
    };
  };
};

export const setChartData = (data) => {
  let authorData = new Map();
  let authorSet = new Set();
  let totalBooks = 0;
  let authorChart = [];
  let chartData = new Map();

  for (let i = 0; i < data.length; i++) {
    // Setting total book & total author count
    if (data[i].ReadCount > 0) {
      totalBooks = totalBooks + 1;
      authorSet.add(data[i].Author);
    }

    // Creating data for books by author bar chart
    if (!authorData.get(data[i].Author)) {
      authorData.set(data[i].Author, Number(data[i].ReadCount));
    } else {
      authorData.set(
        data[i].Author,
        authorData.get(data[i].Author) + Number(data[i].ReadCount)
      );
    }
  }
  let authors = Array.from(authorData.keys());
  authors.forEach((key) => {
    let obj = { author: key, books: authorData.get(key) };
    authorChart.push(obj);
  });

  // Setting the map for all chart data
  chartData.set("authors", authorChart);
  chartData.set("totalBooks", totalBooks);
  chartData.set("totalAuthors", authorSet.size);
  console.log(chartData);
  return {
    type: actions.SET_CHART_DATA,
    data: chartData,
  };
};

export const setFullData = (parsed) => {
  return {
    type: actions.SET_FULL_DATA,
    parsed: parsed,
  };
};