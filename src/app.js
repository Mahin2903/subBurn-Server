import express from "express";
import cors from "cors";

import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/rendered", express.static("rendered"));


app.get("/", (req, res) => {
  res.send("subBurn is Running");
});

app.use("/api/upload", uploadRoutes);

export default app;