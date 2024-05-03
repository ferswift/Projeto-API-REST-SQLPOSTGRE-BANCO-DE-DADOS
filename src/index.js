require("dotenv").config();
const express = require("express");
const { router } = require("./routes/routes");

const app = express();

app.use(express.json());

app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});