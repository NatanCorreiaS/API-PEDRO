import express from "express";
import Chart from "./Chart";
import fs from "fs/promises";
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
const loadChartData = async () => {
  try {
    const data = await fs.readFile("chart.json", "utf8");
    const parsedData = JSON.parse(data);
    chartArray = loadCharts(parsedData); // Convert to chart instances
  } catch (err) {
    console.error(err);
  }
};

loadChartData();

// CRUD methods
const sumAllPrices = (chartArray: Chart[]): Number => {
  return chartArray.reduce((acc, chart) => acc + Number(chart.getPrice()), 0);
};

// Serving index page ../www/index.html
app.get("/", async (req, res) => {
  try {
    await res.sendFile(path.join(__dirname, "../www/index.html"));
    console.log(
      "Arquivo enviado com sucesso: ",
      path.join(__dirname, "../www/index.html")
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Serving css file ../www/style.css
app.get("/style.css", async (req, res) => {
  try {
    await res.sendFile(path.join(__dirname, "../www/style.css"));
    console.log(
      "Arquivo enviado com sucesso: ",
      path.join(__dirname, "../www/style.css")
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Serving js file ../www/script/manipulator.js
app.get("/manipulator.js", async (req, res) => {
  try {
    await res.sendFile(path.join(__dirname, "../www/manipulator.js"));
    console.log(
      "Arquivo enviado com sucesso: ",
      path.join(__dirname, "../www/manipulator.js")
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Serving all the imgs in the ../www/img folder
app.use("/img", express.static(path.join(__dirname, "../www/img")));

app.get("/api/", async (req, res) => {
  try {
    res.send({ chart: chartArray, total: sumAllPrices(chartArray) });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Method GET: get a chart by ID
app.get("/api/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const chart = chartArray.find((chart) => chart.getId() === id);
    if (chart) {
      res.send({ chart });
    } else {
      res.status(404).send({ message: "Chart not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Method POST: create a new chart and save it to chart.json
app.post("/api/", express.json(), async (req, res) => {
  try {
    const { productName, price, quantity } = req.body;
    const id = chartArray.length + 1;
    const newChart = new Chart(id, productName, price, quantity);
    chartArray.push(newChart);
    await fs.writeFile("chart.json", JSON.stringify(chartArray));
    console.log("METHOD POST, CREATED NEW CHART: ", newChart);
    res.send({ msg: "Chart created!", chart: newChart });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Method PUT: update a chart by ID and save it to chart.json
app.put("/api/:id", express.json(), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { productName, price, quantity } = req.body;
    const chart = chartArray.find((chart) => chart.getId() === id);
    if (chart) {
      chart.setProductName(productName);
      chart.setPrice(price);
      chart.setQuantity(quantity);
      await fs.writeFile("chart.json", JSON.stringify(chartArray));
      console.log("METHOD PUT, UPDATED CHART: ", chart);
      res.send({ msg: "Chart Updated!", updatedChart: chart });
    } else {
      res.status(404).send({ message: "Chart not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Method DELETE: delete a chart by ID and save it to chart.json
app.delete("/api/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const chartIndex = chartArray.findIndex((chart) => chart.getId() === id);
    if (chartIndex !== -1) {
      chartArray.splice(chartIndex, 1);
      await fs.writeFile("chart.json", JSON.stringify(chartArray));
      console.log("METHOD DELETE, DELETED CHART: ", id);
      res.send({ message: "Chart deleted" });
    } else {
      res.status(404).send({ message: "Chart not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(
    `Server is running on port http://localhost:${PORT}/ for the front-end and http://localhost:${PORT}/api/ for the back-end`
  );
});
