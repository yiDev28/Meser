import express from "express";
import bodyParser from "body-parser";
import router from "./routes";

export function startServer() {
  const app = express();
  app.use(bodyParser.json());

  app.use("/api", router);

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Servidor API escuchando en http://localhost:${PORT}`);
  });
}
