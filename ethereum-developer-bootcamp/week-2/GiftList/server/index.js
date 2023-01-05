const express = require("express");

const MerkleTree = require("../utils/MerkleTree");
const verifyProof = require("../utils/verifyProof");

const niceList = require("../utils/niceList");

const merkleTree = new MerkleTree(niceList);

const port = 1225;

const app = express();
app.use(express.json());

const MERKLE_ROOT = merkleTree.getRoot();

app.post("/gift", (req, res) => {
  const body = req.body;

  const { proof, name } = body;

  const isInTheList = verifyProof(proof, name, MERKLE_ROOT);
  if (isInTheList) {
    res.send("You got a toy robot!");
  } else {
    res.send("You are not on the list :(");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
