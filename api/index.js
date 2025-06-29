const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Corrija os caminhos para rotas
const muralAvisoRoutes = require("../routes/mural-avisos");
const aulasRoutes = require("../routes/aulas");

app.use(express.json());

// Use as rotas corretamente
app.use("/api/mural-avisos", muralAvisoRoutes);
app.use("/api/aulas", aulasRoutes);

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

module.exports = app;

// Inicie o servidor se estiver rodando localmente
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
}
