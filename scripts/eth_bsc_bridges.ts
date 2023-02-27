import { ethers } from "ethers";

import BridgeIn  from "../typechain/BridgeIn.sol/BridgeIn.json";
import BridgeOut from "../typechain/BridgeOut.sol/BridgeOut.json";
import * as dotenv from "dotenv";

dotenv.config();

const providerEth = new ethers.providers.WebSocketProvider(
    "wss://eth-goerli.g.alchemy.com/v2/-xJhTJIuMhZ1dtPqlYsqSiE4HyUZz5Md"
);

// https://goerli.etherscan.io/address/0xa5445c3e55d76dd9e030d3971031e8c0124dee3e
const bridgeEth = new ethers.Contract(
    "0xa5445c3e55d76dd9e030d3971031e8c0124dee3e",
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

// https://testnet.bscscan.com/address/0xae4cba8fa39413f0ff0bc58b42188f93485120fb
const bridgeBsc = new ethers.Contract(
    "0xae4cba8fa39413f0ff0bc58b42188f93485120fb",
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
