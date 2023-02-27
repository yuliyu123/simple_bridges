import { ethers } from "hardhat";

import { expect } from "chai";

import BridgeIn from "../typechain/BridgeIn.sol/BridgeIn.json";
import BridgeOut from "../typechain/BridgeOut.sol/BridgeOut.json";
import hETH from "../typechain/hETH.sol/hETH.json";
import * as dotenv from "dotenv";

dotenv.config();


const providerEth = new ethers.providers.WebSocketProvider(
    "wss://eth-goerli.g.alchemy.com/v2/-xJhTJIuMhZ1dtPqlYsqSiE4HyUZz5Md"
);

const providerBsc = new ethers.providers.JsonRpcProvider(
    'https://data-seed-prebsc-2-s1.binance.org:8545'
);

export async function deployEthBridge() {
    // hETH
    const bscSigner = new ethers.Wallet(process.env.PRI_KEY || "", providerBsc);
    const hEthFactory = await ethers.getContractFactory(hETH.abi, hETH.bytecode.object, bscSigner);
    const hEth = await hEthFactory.deploy();
    await hEth.deployed();

    console.log("signer address:", bscSigner.address);
    console.log("bsc hEth address:", hEth.address);
    console.log("bsc signer balance:", await providerBsc.getBalance(bscSigner.address));
    console.log("eth signer balance:", await providerEth.getBalance(bscSigner.address));

    const ethSigner = new ethers.Wallet(process.env.PRI_KEY || "", providerEth);
    const bridgeInFactory = await ethers.getContractFactory(BridgeIn.abi, BridgeIn.bytecode.object, ethSigner);
    const bridgeIn = await bridgeInFactory.deploy();
    await bridgeIn.deployed();

    console.log("eth BridgeIn deployed to:", bridgeIn.address);

    const bridgeOutFactory = await ethers.getContractFactory(BridgeOut.abi, BridgeOut.bytecode.object, bscSigner);
    const bridgeOut = await bridgeOutFactory.deploy(hEth.address);
    await bridgeOut.deployed();

    console.log("bsc bridgeOut deployed to:", bridgeOut.address);
}

async function main() {
    await deployEthBridge();
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
