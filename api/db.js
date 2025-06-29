const { MongoClient } = require("mongodb");
require("dotenv").config();

let client;
let clientPromise;

const uri = process.env.MONGODB_URI; // Defina a URI no ambiente

const options = {};

if (!process.env.MONGODB_URI) {
  throw new Error("Por favor, defina a variável MONGODB_URI no ambiente.");
}

if (!client) {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

module.exports = clientPromise;
