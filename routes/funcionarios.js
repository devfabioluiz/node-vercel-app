const express = require("express");
const router = express.Router();
const clientPromise = require("../api/db");
const { ObjectId } = require("mongodb");

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

// GET: Listar propriedades do funcionário
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const client = await clientPromise;
    const db = client.db("mydatabase");

    // Verifica se o ID é válido
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    // Busca o funcionário pelo ID
    const funcionario = await db
      .collection("funcionarios")
      .findOne({ _id: new ObjectId(id) });

    if (!funcionario) {
      return res.status(404).json({ error: "Funcionário não encontrado" });
    }

    res.json(funcionario);
  } catch (err) {
    console.error(`Erro ao buscar funcionário de id: ${id}`, err);
    res.status(500).json({ error: `Erro ao buscar funcionário de id ${id}` });
  }
});

// delete: deletar funcionario
router.delete("/:id", async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("mydatabase"); 

    const { id } = req.params;

    // Deleta o documento com o _id especificado
    const result = await db
      .collection("funcionarios")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Funcionário não encontrado" });
    }

    res.json({ message: "Funcionário deletado com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar funcionario:", err);
    res.status(500).json({ error: "Erro ao deletar funcionario" });
  }
});

// POST: Inserir uma nova aula
router.post("/", async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("mydatabase");

    // Modelo esperado do corpo da requisição
    const { funcionario } = req.body;

    if (!ObjectId.isValid(id)) {
  return res.status(400).json({ error: "ID inválido." });
}

    // Validação básica
    if (
  funcionario.nome == null ||
  funcionario.sobrenome == null ||
  funcionario.sexo == null ||
  funcionario.dtNascimento == null ||
  funcionario.grauEscolaridade == null ||
  funcionario.endereco == null ||
  funcionario.foto == null ||
  funcionario.salarioAtual == null ||
  funcionario.valorPassagem == null ||
  funcionario.optouVT == undefined ||
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

// put: Inserir uma nova aula
router.put("/:id", async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("mydatabase");

    const { id } = req.params;
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

    // Atualizar o funcionário existente
    const result = await db
      .collection("funcionarios")
      .updateOne({ _id: new ObjectId(id) }, { $set: funcionario });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Funcionário não encontrado" });
    }

    res.json({ message: "Dados atualizados com sucesso!" });
  } catch (err) {
    console.error("Erro ao atualizar dados:", err);
    res.status(500).json({ error: "Erro ao atualizar dados." });
  }
});

module.exports = router;
