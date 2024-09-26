import express from "express";
import Chart from "./Chart";
import fs from "fs";
import path from "path";

const app = express();

const PORT = 8000;

// Array of chart data
let chartArray: Chart[] = [];

// Function to map plain objects to instances of the Chart class
const loadCharts = (data: any[]): Chart[] => {
  return data.map(
    (item) => new Chart(item.id, item.productName, item.price, item.quantity)
  );
};

// Reading saved data from chart.json to load the data
fs.readFile("chart.json", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const parsedData = JSON.parse(data);
  chartArray = loadCharts(parsedData); // Convert to chart instances
});

// CRUD methods

const sumAllPrices = (chartArray: Chart[]): Number => {
  return chartArray.reduce(
    (acc, chart) => Number(acc) + Number(chart.getPrice()),
    0
  );
};

// Serving index page ../www/index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../www/index.html"));

  console.log(
    "Arquivo enviado com sucesso: ",
    path.join(__dirname, "../www/index.html")
  );
});

// Serving css file ../www/style.css
app.get("/style.css", (req, res) => {
  res.sendFile(path.join(__dirname, "../www/style.css"));

  console.log(
    "Arquivo enviado com sucesso: ",
    path.join(__dirname, "../www/style.css")
  );
});

// Serving js file ../www/script/manipulator.js
app.get("/manipulator.js", (req, res) => {
  res.sendFile(path.join(__dirname, "../www/manipulator.js"));
  console.log(
    "Arquivo enviado com sucesso: ",
    path.join(__dirname, "../www/manipulator.js")
  );
});

// Serving all the imgs in the ../www/img folder
app.use("/img", express.static(path.join(__dirname, "../www/img")));

app.get("/api/", (req, res) => {
  res.send({ chart: chartArray, total: sumAllPrices(chartArray) });
});

// Method GET: get a chart by ID
app.get("/api/:id", (req, res) => {
  const id = Number(req.params.id);
  const chart = chartArray.find((chart) => chart.getId() === id);
  if (chart) {
    res.send({ chart });
  } else {
    res.status(404).send({ message: "Chart not found" });
  }
});

// Method POST: create a new chart and save it to chart.json
app.post("/api/", express.json(), (req, res) => {
  const { id, productName, price, quantity } = req.body;
  const newChart = new Chart(id, productName, price, quantity);
  chartArray.push(newChart);
  fs.writeFile("chart.json", JSON.stringify(chartArray), (err) => {
    if (err) {
      console.error(err);
      return;
    }
    res.send({ msg: "Chart created!", chart: newChart });
  });
});

// Method PUT: update a chart by ID and save it to chart.json
app.put("/api/:id", express.json(), (req, res) => {
  const id = Number(req.params.id);
  const { productName, price, quantity } = req.body;
  const chart = chartArray.find((chart) => chart.getId() === id);
  if (chart) {
    chart.setProductName(productName);
    chart.setPrice(price);
    chart.setQuantity(quantity);
    fs.writeFile("chart.json", JSON.stringify(chartArray), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      res.send({ msg: "Chart Update!", updatedChard: chart });
    });
  } else {
    res.status(404).send({ message: "Chart not found" });
  }
});

// Method DELETE: delete a chart by ID and save it to chart.json
app.delete("/api/:id", (req, res) => {
  const id = Number(req.params.id);
  const chartIndex = chartArray.findIndex((chart) => chart.getId() === id);
  if (chartIndex !== -1) {
    chartArray.splice(chartIndex, 1);
    fs.writeFile("chart.json", JSON.stringify(chartArray), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      res.send({ message: "Chart deleted" });
    });
  } else {
    res.status(404).send({ message: "Chart not found" });
  }
});

app.listen(PORT, () => {
  console.log(
    `Server is running on port http://localhost:${PORT}/api/ to list all charts`
  );
});
