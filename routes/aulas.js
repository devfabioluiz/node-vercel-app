const express = require("express");
const router = express.Router();
const clientPromise = require("../api/db");

// GET: Listar todas as aulas
router.get("/", async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("mydatabase"); // Substitua pelo nome do seu banco de dados
    const aulas = await db.collection("aulas").find({}).toArray();
    res.json(aulas);
  } catch (err) {
    console.error("Erro ao buscar aulas:", err);
    res.status(500).json({ error: "Erro ao buscar aulas" });
  }
});

// POST: Inserir uma nova aula
router.post("/", async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("mydatabase");

    // Modelo esperado do corpo da requisição
    const { escola } = req.body;

    // Validação básica
    if (
      !escola ||
      !escola.nome ||
      !Array.isArray(escola.disciplinas) ||
      escola.disciplinas.length === 0
    ) {
      return res.status(400).json({
        error: "O modelo de dados está incorreto ou incompleto.",
      });
    }

    // Inserir no banco de dados
    const result = await db.collection("aulas").insertOne(req.body);

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
