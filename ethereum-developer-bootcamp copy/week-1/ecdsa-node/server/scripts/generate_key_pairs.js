const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");

for (let i = 0; i < 5; i++) {
  const private_key = secp.utils.randomPrivateKey();

  const public_key = secp.getPublicKey(private_key);

  const address = keccak256(public_key).slice(-20);

  console.log("=================");
  console.log("Account ", i);
  console.log("Private Key: ", toHex(private_key));
  console.log("Public Key: ", toHex(public_key));
  console.log("Address: ", toHex(address));
  console.log("=================");
}
