import express from "express";
import cors from "cors";
import { validatePayments } from "./utils/validators.js";

const app = express();

const port = process.env.PORT || 7777;

app.use(
  cors({
    origin: "*",
  })
);

app.get("/validate/:master/:network/:token/:txid", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { master, network, token, txid } = req.params;
  const validity = await validatePayments(master, network, token, txid);
  res.send({ result: validity });
});

app.listen(port, async () => {
  console.log(`listening at PORT:${port}`);
});
