import { ethers } from "ethers";

import BridgeIn  from "../typechain/BridgeIn.sol/BridgeIn.json";
import BridgeOut from "../typechain/BridgeOut.sol/BridgeOut.json";
import * as dotenv from "dotenv";

dotenv.config();

const providerEth = new ethers.providers.WebSocketProvider(
    "wss://eth-goerli.g.alchemy.com/v2/-xJhTJIuMhZ1dtPqlYsqSiE4HyUZz5Md"
);

// https://etherscan.io/address/0xA5445C3e55d76DD9E030d3971031E8c0124DEe3e
const bridgeEth = new ethers.Contract(
    "0xA5445C3e55d76DD9E030d3971031E8c0124DEe3e",
    BridgeIn.abi,
    providerEth
);

const providerBsc = new ethers.providers.JsonRpcProvider(
    'https://data-seed-prebsc-2-s1.binance.org:8545'
);
const adminWalletBsc = new ethers.Wallet(
    process.env.PRI_KEY || "",
    providerBsc
);

// 
const bridgeBsc = new ethers.Contract(
    "0x69975B1d1FC09c8bcc142efBfaf7F29199d499f5",
    BridgeOut.abi,
    adminWalletBsc
);

bridgeEth.on("Transfer", (from, to, amount, date, nonce, signature, step) => {
    bridgeBsc.mint(from, to, amount, nonce, signature);
    console.log(`
       Processed transfer:
       - from ${from}
       - to ${to}
       - amount ${amount} wei
       - date ${date}
       - nonce ${nonce}
       - signature ${signature}
     `);
});
