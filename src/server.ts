import express, { Request, Response } from "express";
import path from "path";
import {
  MongoClient,
  Db,
  Collection,
  ServerApiVersion,
  Document,
} from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import Chart, { ChartCRUD } from "./Chart";

// Permitindo o uso de variáveis de ambiente
dotenv.config();

const URI = process.env.MONGO_URI!;
const DB_NAME = "ecommerce_database";
const COLLECTION_NAME = "ecommerce";
const PORT = process.env.PORT!;

const app = express();
// Allowing all origins to access the API
app.use(cors({ origin: "*" }));

// Verificando se o PORT é válido
if (!PORT) {
  throw new Error("Please provide a valid PORT");
}

// Verificando se o URI é válido
if (!URI) {
  throw new Error("Please provide a valid URI");
}

// Estabelecendo a conexão com o banco de dados MongoDB
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Garantir que a conexão com o MongoDB será estabelecida uma vez no início
let db: Db | null = null;

const connectDB = async (): Promise<Db> => {
  if (!db) {
    await client.connect();
    db = client.db(DB_NAME);
    console.log("Conexão com MongoDB estabelecida!");
  }
  return db;
};

// Array de dados de gráficos
let chartArray: Chart[] = [];

// Carregar os dados de gráfico do banco de dados ao iniciar o servidor
const loadChartData = async (): Promise<void> => {
  try {
    const db = await connectDB();
    const collection: Collection = db.collection(COLLECTION_NAME);
    const charts = await collection.find({}).toArray();
    chartArray = charts.map(
      (chart: Document) =>
        new Chart(chart._id, chart.productName, chart.price, chart.quantity)
    );
  } catch (err) {
    console.error("Falha ao carregar dados de gráfico:", err);
  }
};

loadChartData().then(() => {
  console.log("CHART ARRAY carregado: ", chartArray);
});

// Função para somar todos os preços
const sumAllPrices = (chartArray: Chart[]): number => {
  return chartArray.reduce((acc, chart) => acc + Number(chart.getPrice()), 0);
};

// Servir a página inicial
app.get("/", async (req: Request, res: Response) => {
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

// Servir o arquivo CSS
app.get("/style.css", async (req: Request, res: Response) => {
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

// Servir o arquivo JS manipulator.js
app.get("/manipulator.js", async (req: Request, res: Response) => {
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

// Servir as imagens estáticas
app.use("/img", express.static(path.join(__dirname, "../www/img")));

// Rota API GET: buscar todos os gráficos
app.get("/api/", async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const collection: Collection = db.collection(COLLECTION_NAME);
    const charts = await collection.find({}).toArray();
    res.send({ chart: charts, total: sumAllPrices(chartArray) });
  } catch (err) {
    console.error("Falha ao buscar gráficos:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Rota API GET: buscar gráfico por nome do produto
app.get("/api/:productName", async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const collection: Collection = db.collection(COLLECTION_NAME);
    const productName = req.params.productName;
    const chart = await collection.findOne({ productName });
    if (chart) {
      res.send({ chart });
    } else {
      res.status(404).send({ message: "Chart not found" });
    }
  } catch (err) {
    console.error("Falha ao buscar gráfico:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Rota API POST: criar novo gráfico
app.post("/api/", express.json(), async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const { productName, price, quantity } = req.body;
    const collection: Collection = db.collection(COLLECTION_NAME);
    const newChart = new ChartCRUD(productName, price, quantity);
    await collection.insertOne(newChart);
    console.log("Novo gráfico criado: ", newChart);
    res.send({ msg: "Chart created!", chart: newChart });
  } catch (err) {
    console.error("Falha ao criar gráfico:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Rota API PUT: atualizar gráfico existente
app.put(
  "/api/:productName",
  express.json(),
  async (req: Request, res: Response) => {
    try {
      const db = await connectDB();
      const productName = req.params.productName;
      const { price, quantity } = req.body;
      const collection: Collection = db.collection(COLLECTION_NAME);
      const updatedChart = new ChartCRUD(productName, price, quantity);
      await collection.updateOne({ productName }, { $set: updatedChart });
      console.log("Gráfico atualizado: ", updatedChart);
      res.send({ msg: "Chart Updated!", updatedChart });
    } catch (err) {
      console.error("Falha ao atualizar gráfico:", err);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Rota API DELETE: deletar gráfico
app.delete("/api/:productName", async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const productName = req.params.productName;
    const collection: Collection = db.collection(COLLECTION_NAME);
    await collection.deleteOne({ productName });
    console.log("Gráfico deletado: ", productName);
    res.send({ message: "Chart deleted" });
  } catch (err) {
    console.error("Falha ao deletar gráfico:", err);
    res.status(500).send("Internal Server Error");
  }
});

const HOSTNAME = process.env.HOSTNAME || "localhost";

app.listen(Number(PORT), HOSTNAME, () => {
  console.log(
    `Server is running on http://${HOSTNAME}:${PORT}/ for the front-end and http://${HOSTNAME}:${PORT}/api/ for the back-end`
  );
});
