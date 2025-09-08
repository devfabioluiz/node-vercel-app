const express = require("express");
const router = express.Router();
const clientPromise = require("../api/db");

// GET: Listar todas as funcionarios
router.get("/", async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("mydatabase"); // Substitua pelo nome do seu banco de dados
    const funcionarios = await db.collection("funcionarios").find({}).toArray();
    res.json(funcionarios);
  } catch (err) {
    console.error("Erro ao buscar funcionarios:", err);
    res.status(500).json({ error: "Erro ao buscar funcionarios" });
  }
});

// POST: Inserir uma nova aula
router.post("/", async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("mydatabase");

    // Modelo esperado do corpo da requisição
    const { funcionario } = req.body;

    // Validação básica
    if (
      !funcionario.nome ||
      !funcionario.sobrenome ||
      !funcionario.sexo ||
      !funcionario.dtNascimento ||
      !funcionario.grauEscolaridade ||
      !funcionario.endereco ||
      !funcionario.foto ||
      !funcionario.salarioAtual ||
      !funcionario.valorPassagem ||
      !funcionario.optouVT ||
      !Array.isArray(funcionario.historicoCargosESalarios) ||
      funcionario.historicoCargosESalarios.length === 0
    ) {
      return res.status(400).json({
        error: "O modelo de dados está incorreto ou incompleto.",
      });
    }

    // Inserir no banco de dados
    const result = await db.collection("funcionarios").insertOne(req.body);

    res.status(201).json({
      message: "Dados inseridos com sucesso!",
      id: result.insertedId,
    });
  } catch (err) {
    console.error("Erro ao adicionar dados:", err);
    res.status(500).json({ error: "Erro ao adicionar dados." });
  }
});

module.exports = router;
