const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");
const bigintConversion = require("bigint-conversion");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x45bd607d9ef8d57bdb0f2364e54e7e4d4dbd837c": 100,
  "0xcb6c10427727d91c4f1a7d63ca5852354c0a2e0a": 50,
  "0x321aa9659dfd0a15b01d40421fd3bac3e03a973c": 75,
  "0x20862db4f85e25e7bdb76f92fdfe4e43708b3faa": 68,
  "0x226e091ebc00f304d7e4d939f37a82ca1fb3307b": 120,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { amount, recipient, privateKey } = req.body;

  const public_key = secp.getPublicKey(
    new Uint8Array(bigintConversion.bigintToBuf(BigInt(privateKey)))
  );

  const sender = "0x" + toHex(keccak256(public_key).slice(-20));

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

// =================
// Account  0
// Private Key:  b4d3743a4d22ea9a1637e877c25de1462657357636d5128ab1e41cacaac6bb65
// Public Key:  0486dd01a7d5772e62c02072132ef9beee0e844314de7345d60d126aac81882b3f28b57b70bbdf1934c2d560d6bd2e61d61aa3c0789516922279fd7ae4bc17e4fb
// Address:  45bd607d9ef8d57bdb0f2364e54e7e4d4dbd837c
// =================
// =================
// Account  1
// Private Key:  fd864f90fb006fdbe221a2bbb83ec5dd42a42a56dbf176e4840eccbe26e61ef2
// Public Key:  0401623022eda019c5a44864d02b7cba4215aed22e265af3e5af5a20673ab6f35f51d353784d16e779dbb156db1d10250e9649f4c11cf6148e271199d1036176e5
// Address:  cb6c10427727d91c4f1a7d63ca5852354c0a2e0a
// =================
// =================
// Account  2
// Private Key:  c1edbce43e08012a5b241a3d8625878bdbd1c08a198711bb63b49b86ae52ec85
// Public Key:  04f523658009e0f15b8b56beeb28b3f133abb20da9c1b94985001c067213548ea24dead182f68f42d9ed2112a67e38334834c2cec881ded5fc5887155eedff08f3
// Address:  321aa9659dfd0a15b01d40421fd3bac3e03a973c
// =================
// =================
// Account  3
// Private Key:  b746f001a4ac7e5087419adbd59d724d30d2c448728e775a24db77882dc4af68
// Public Key:  0458e039d4bd66977d0dc8b1e2ec05c89af9af1c9b31907af89d65a53f6002cd698d161961d3b0fb3f43359791c0e82c22433ca997b1685ed39be3bef87311010b
// Address:  20862db4f85e25e7bdb76f92fdfe4e43708b3faa
// =================
// =================
// Account  4
// Private Key:  23baef8db308ccf70fe5c8bd85f2c326527e08504bc22cc0a5b9a9700e953c05
// Public Key:  042bb8980e9fd16180edd36c30c205ef52fabc25889bfd98fef04e97575221846efd6eaf7744915693b0c6b585722d2dbe0d1c0939bc3953cb8c14c0ce55627928
// Address:  226e091ebc00f304d7e4d939f37a82ca1fb3307b
// =================
