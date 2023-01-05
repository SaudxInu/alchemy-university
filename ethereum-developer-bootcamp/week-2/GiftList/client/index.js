const axios = require("axios");
const MerkleTree = require("../utils/MerkleTree");

const niceList = require("../utils/niceList");

const merkleTree = new MerkleTree(niceList);

const serverUrl = "http://localhost:1225";

async function main() {
  const name = "Norman Block";

  const index = niceList.findIndex((n) => n === name);

  const proof = merkleTree.getProof(index);

  const { data: gift } = await axios.post(`${serverUrl}/gift`, {
    proof: proof,
    name: name,
  });

  console.log({ gift });
}

main();
