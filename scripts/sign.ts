require("dotenv").config();

import { ethers } from "ethers";

const adminWallet = new ethers.Wallet(process.env.PRI_KEY || "");
const nonce = 12;
const amount = 10;

async function main() {
  const message = ethers.utils.solidityKeccak256(
    ["address", "address", "uint256", "uint256"],
    [
      "0xC84bF2e019E0777e183F9F2DD46AdDcCD6020653",
      "0xC84bF2e019E0777e183F9F2DD46AdDcCD6020653",
      amount,
      nonce,
    ]
  );
  const signature = await adminWallet.signMessage(message);
  console.log(signature);
}

main();
