const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    { id: 1, name: "Product A" },
    { id: 2, name: "Product B" },
  ]);
});

router.post("/", (req, res) => {
  const { name } = req.body;
  res.status(201).json({ message: `Product ${name} added successfully!` });
});

module.exports = router;
