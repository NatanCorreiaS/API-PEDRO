import express from "express";
import Chart, { ChartCRUD } from "./Chart";
// import fs from "fs/promises";
import path from "path";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

// Permitindo o uso de variáveis de ambiente
dotenv.config();

const URI = process.env.MONGO_URI;
const DB_NAME = "ecommerce_database";
const COLLECTION_NAME = "ecommerce";
const PORT = process.env.PORT;

// Verifying if the PORT is valid
if (!PORT) {
  throw new Error("Please provide a valid PORT");
}

// Verifying if the URI is valid
if (!URI) {
  throw new Error("Please provide a valid URI");
}

// Establishing connection to the database
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// testing connection
const testConnection = async () => {
  try {
    await client.connect();
    console.log("Connected to the database");
  } catch (err) {
    console.error(err);
  }
};

testConnection();

const app = express();

// Array of chart data
let chartArray: Chart[] = [];

// Loading the data from the database to the chartArray
const loadChartData = async () => {
  try {
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    const charts = await collection.find({}).toArray();
    chartArray = charts.map(
      (chart) =>
        new Chart(chart._id, chart.productName, chart.price, chart.quantity)
    );
  } catch (err) {
    console.error(err);
  }
};

loadChartData();

console.log("CHART ARRAY: ", chartArray);

// Function to map plain objects to instances of the Chart class
// const loadCharts = (data: any[]): Chart[] => {
//   return data.map(
//     (item) => new Chart(item.id, item.productName, item.price, item.quantity)
//   );
// };

// Reading saved data from chart.json to load the data
// const loadChartData = async () => {
//   try {
//     const data = await fs.readFile("chart.json", "utf8");
//     const parsedData = JSON.parse(data);
//     chartArray = loadCharts(parsedData); // Convert to chart instances
//   } catch (err) {
//     console.error(err);
//   }
// };

// loadChartData();

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
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    const charts = await collection.find({}).toArray();
    res.send({ chart: charts, total: sumAllPrices(chartArray) });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
  // try {
  //   res.send({ chart: chartArray, total: sumAllPrices(chartArray) });
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).send("Internal Server Error");
  // }
});

// Method GET: get a chart by ID
app.get("/api/:productName", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    const productName = req.params.productName;
    const chart = await collection.findOne({ productName });
    if (chart) {
      res.send({ chart });
    } else {
      res.status(404).send({ message: "Chart not found" });
    }
  } finally {
    await client.close();
  }

  // try {
  //   const id = Number(req.params.id);
  //   const chart = chartArray.find((chart) => chart.getId() === id);
  //   if (chart) {
  //     res.send({ chart });
  //   } else {
  //     res.status(404).send({ message: "Chart not found" });
  //   }
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).send("Internal Server Error");
  // }
});

// Method POST: create a new chart and save it to chart.json
app.post("/api/", express.json(), async (req, res) => {
  try {
    await client.connect();
    const { productName, price, quantity } = req.body;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    const newChart = new ChartCRUD(productName, price, quantity);
    await collection.insertOne(newChart);
    console.log("METHOD POST, CREATED NEW CHART: ", newChart);
    res.send({ msg: "Chart created!", chart: newChart });
  } finally {
    await client.close();
  }
  // try {
  //   const { productName, price, quantity } = req.body;
  //   const id = new ObjectId(chartArray.length + 1);
  //   const newChart = new Chart(id, productName, price, quantity);
  //   chartArray.push(newChart);
  //   await fs.writeFile("chart.json", JSON.stringify(chartArray));
  //   console.log("METHOD POST, CREATED NEW CHART: ", newChart);
  //   res.send({ msg: "Chart created!", chart: newChart });
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).send("Internal Server Error");
  // }
});

// Method PUT: update a chart by ID and save it to chart.json
app.put("/api/:productName", express.json(), async (req, res) => {
  try {
    await client.connect();
    const productName = req.params.productName;
    const { price, quantity } = req.body;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    const updatedChart = new ChartCRUD(productName, price, quantity);
    await collection.updateOne({ productName }, { $set: updatedChart });
    console.log("METHOD PUT, UPDATED CHART: ", updatedChart);
    res.send({ msg: "Chart Updated!", updatedChart });
  } finally {
    await client.close();
  }
  // try {
  //   const id = new ObjectId(req.params.id);
  //   const { productName, price, quantity } = req.body;
  //   const chart = chartArray.find((chart) => chart.getId() === id);
  //   if (chart) {
  //     chart.setProductName(productName);
  //     chart.setPrice(price);
  //     chart.setQuantity(quantity);
  //     await fs.writeFile("chart.json", JSON.stringify(chartArray));
  //     console.log("METHOD PUT, UPDATED CHART: ", chart);
  //     res.send({ msg: "Chart Updated!", updatedChart: chart });
  //   } else {
  //     res.status(404).send({ message: "Chart not found" });
  //   }
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).send("Internal Server Error");
  // }
});

// Method DELETE: delete a chart by ID and save it to chart.json
app.delete("/api/:productName", async (req, res) => {
  try {
    await client.connect();
    const productName = req.params.productName;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    await collection.deleteOne({ productName });
    console.log("METHOD DELETE, DELETED CHART: ", productName);
    res.send({ message: "Chart deleted" });
  } finally {
    await client.close();
  }
  // try {
  //   const id = new ObjectId(req.params.id);
  //   const chartIndex = chartArray.findIndex((chart) => chart.getId() === id);
  //   if (chartIndex !== -1) {
  //     chartArray.splice(chartIndex, 1);
  //     await fs.writeFile("chart.json", JSON.stringify(chartArray));
  //     console.log("METHOD DELETE, DELETED CHART: ", id);
  //     res.send({ message: "Chart deleted" });
  //   } else {
  //     res.status(404).send({ message: "Chart not found" });
  //   }
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).send("Internal Server Error");
  // }
});

const HOSTNAME = process.env.HOSTNAME || 'localhost';

app.listen(Number(PORT), HOSTNAME, () => {
  console.log(
    `Server is running on http://${HOSTNAME}:${PORT}/ for the front-end and http://${HOSTNAME}:${PORT}/api/ for the back-end`
  );
});
