const express = require("express");
const router = express.Router();
const clientPromise = require("../api/db");
const { ObjectId } = require("mongodb");

// 🔧 Função de validação reutilizável
function validarFuncionario(funcionario) {
  const camposTexto = [
    "nome",
    "sobrenome",
    "sexo",
    "dtNascimento",
    "grauEscolaridade",
    "endereco",
    "foto",
  ];

  for (const campo of camposTexto) {
    if (!funcionario[campo] || typeof funcionario[campo] !== "string") {
      return `Campo '${campo}' é obrigatório e deve ser uma string.`;
    }
  }

  if (
    typeof funcionario.salarioAtual !== "number" ||
    typeof funcionario.valorPassagem !== "number"
  ) {
    return "salarioAtual e valorPassagem devem ser números.";
  }

  if (typeof funcionario.optouVT !== "boolean") {
    return "optouVT deve ser booleano.";
  }

  if (
    !Array.isArray(funcionario.historicoCargosESalarios) ||
    funcionario.historicoCargosESalarios.length === 0
  ) {
    return "historicoCargosESalarios é obrigatório e deve conter ao menos um item.";
  }

  return null; // sem erro
}

// ✅ GET: Listar todos os funcionários
router.get("/", async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("mydatabase");
    const funcionarios = await db.collection("funcionarios").find({}).toArray();
    res.json(funcionarios);
  } catch (err) {
    console.error("Erro ao buscar funcionários:", err);
    res.status(500).json({ error: "Erro ao buscar funcionários." });
  }
});

// ✅ GET: Buscar funcionário por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  try {
    const client = await clientPromise;
    const db = client.db("mydatabase");

    const funcionario = await db
      .collection("funcionarios")
      .findOne({ _id: new ObjectId(id) });

    if (!funcionario) {
      return res.status(404).json({ error: "Funcionário não encontrado." });
    }

    res.json(funcionario);
  } catch (err) {
    console.error("Erro ao buscar funcionário:", err);
    res.status(500).json({ error: "Erro ao buscar funcionário." });
  }
});

// ✅ DELETE: Remover funcionário por ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  try {
    const client = await clientPromise;
    const db = client.db("mydatabase");

    const result = await db
      .collection("funcionarios")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Funcionário não encontrado." });
    }

    res.json({ message: "Funcionário deletado com sucesso." });
  } catch (err) {
    console.error("Erro ao deletar funcionário:", err);
    res.status(500).json({ error: "Erro ao deletar funcionário." });
  }
});

// ✅ POST: Inserir novo funcionário
router.post("/", async (req, res) => {
  const funcionario = req.body;

  const erro = validarFuncionario(funcionario);
  if (erro) {
    return res.status(400).json({ error: erro });
  }

  try {
    const client = await clientPromise;
    const db = client.db("mydatabase");

    const result = await db.collection("funcionarios").insertOne(funcionario);

    res.status(201).json({
      message: "Funcionário inserido com sucesso!",
      id: result.insertedId,
    });
  } catch (err) {
    console.error("Erro ao inserir funcionário:", err);
    res.status(500).json({ error: "Erro ao inserir funcionário." });
  }
});

// ✅ PUT: Atualizar funcionário existente
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  const funcionario = req.body;

  const erro = validarFuncionario(funcionario);
  if (erro) {
    return res.status(400).json({ error: erro });
  }

  try {
    const client = await clientPromise;
    const db = client.db("mydatabase");

    const result = await db
      .collection("funcionarios")
      .updateOne({ _id: new ObjectId(id) }, { $set: funcionario });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Funcionário não encontrado." });
    }

    res.json({ message: "Funcionário atualizado com sucesso!" });
  } catch (err) {
    console.error("Erro ao atualizar funcionário:", err);
    res.status(500).json({ error: "Erro ao atualizar funcionário." });
  }
});

module.exports = router;
