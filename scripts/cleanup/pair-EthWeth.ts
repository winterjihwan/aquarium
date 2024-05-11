import { ethers } from "ethers";
import hre from "hardhat";

const WETH__ADDRESS = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"

const factoryArtifact = require('@uniswap/v2-core/build/UniswapV2Factory.json')
const routerArtifact = require('@uniswap/v2-periphery/build/UniswapV2Router02.json')
const pairArtifact = require('@uniswap/v2-periphery/build/IUniswapV2Pair.json')

const FACTORY__ADDRESS = "0x7AA1CB24f20166D118087AA3b9d67943D4B903E9";
const ROUTER__ADDRESS = "0x139D70E24b8C82539800EEB99510BfB8B09eaF68"
const WETH__ABI = require("../abi/WETH.json")

const main = async () => {
    const [signer] = await hre.ethers.getSigners();

    const Weth = new ethers.Contract(WETH__ADDRESS, WETH__ABI, signer)
    let wethBalance
    wethBalance = await Weth.balanceOf(signer.address)
    console.log(`Weth balance: ${ethers.formatUnits(wethBalance, 18)}`)

    const depositTx = await Weth.deposit({ value: ethers.parseEther("0.5") })
    console.log("Depositing Weth...", depositTx.hash)
    await depositTx.wait()
    console.log("Deposited Weth")

    wethBalance = await Weth.balanceOf(signer.address)
    console.log(`Updated Weth balance: ${ethers.formatUnits(wethBalance, 18)}`)
};

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
