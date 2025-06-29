const express = require("express");
const router = express.Router();
const clientPromise = require("../api/db");

router.get("/", async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("mydatabase"); // Substitua pelo nome do seu banco de dados
    const muralAvisos = await db.collection("mural-avisos").find({}).toArray();
    res.json(muralAvisos);
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
    res.status(500).json({ error: "Erro ao buscar avisos" });
  }
});

router.post("/", async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("mydatabase"); // Substitua pelo nome do seu banco de dados

    const { turma, message, link, deadline } = req.body; // Espera receber 'turma' e 'message' no corpo da requisição

    if ((!turma || !message, !link, !deadline)) {
      return res.status(400).json({
        error:
          "Os campos 'turma', 'message', 'deadline' e 'link' são obrigatórios.",
      });
    }

    // Inserir no banco de dados
    const result = await db
      .collection("mural-avisos")
      .insertOne({ turma, message, link, deadline });

    res.status(201).json({
      message: "Aviso criado com sucesso!",
      userId: result.insertedId,
    });
  } catch (err) {
    console.error("Erro ao adicionar aviso:", err);
    res.status(500).json({ error: "Erro ao adicionar aviso." });
  }
});

module.exports = router;
