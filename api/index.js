const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Corrija os caminhos para rotas
const userRoutes = require("../routes/users");
const productRoutes = require("../routes/products");

app.use(express.json());

// Use as rotas corretamente
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

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
