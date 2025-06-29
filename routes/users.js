const express = require("express");
const router = express.Router();
const clientPromise = require("../api/db");

router.get("/", async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("mydatabase"); // Substitua pelo nome do seu banco de dados
    const users = await db.collection("users").find({}).toArray();
    res.json(users);
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

router.post("/", async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("mydatabase"); // Substitua pelo nome do seu banco de dados

    const { name, email } = req.body; // Espera receber 'name' e 'email' no corpo da requisição

    if (!name || !email) {
      return res
        .status(400)
        .json({ error: "Os campos 'name' e 'email' são obrigatórios." });
    }

    // Inserir no banco de dados
    const result = await db.collection("users").insertOne({ name, email });

    res.status(201).json({
      message: "Usuário criado com sucesso!",
      userId: result.insertedId,
    });
  } catch (err) {
    console.error("Erro ao adicionar usuário:", err);
    res.status(500).json({ error: "Erro ao adicionar usuário." });
  }
});

module.exports = router;
