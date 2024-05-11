import { ethers } from "ethers";
import hre from "hardhat";

const WETH__ADDRESS = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"
const WETH__ABI = require("../abi/WETH.json")
const USDC__ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"
const ERC20__ABI = require("../abi/ERC20.json")

const factoryArtifact = require('@uniswap/v2-core/build/UniswapV2Factory.json')
const routerArtifact = require('@uniswap/v2-periphery/build/UniswapV2Router02.json')
const pairArtifact = require('@uniswap/v2-periphery/build/IUniswapV2Pair.json')

const FACTORY__ADDRESS = "0x7AA1CB24f20166D118087AA3b9d67943D4B903E9";
const ROUTER__ADDRESS = "0x139D70E24b8C82539800EEB99510BfB8B09eaF68"

const WETH_USDC_PAIR_ADDRESS = "0xf605cdA0Bf33e42ccac267Db4B8c06496E77937f"

const main = async () => {
    const [signer] = await hre.ethers.getSigners();

    // Swap ----------------------------------------------
    const amountInWeth = ethers.parseUnits("0.025", 18);
    const path = [WETH__ADDRESS, USDC__ADDRESS];
    const deadline = Math.floor(Date.now() / 1000) + 60*10; // 10 minutes from now

    const Router = new hre.ethers.Contract(ROUTER__ADDRESS, routerArtifact.abi, signer);

    // Weth -> USDC
    const tx = await Router.swapExactTokensForTokens(amountInWeth, 0, path, signer.address, deadline);
    console.log("Swapping Weth to USDC...", tx.hash);
    await tx.wait();
    console.log("Swapped Weth to USDC");

    // Adding liquidity-----------------------------------

    // const PAIR = new hre.ethers.Contract(WETH_USDC_PAIR_ADDRESS, pairArtifact.abi, signer);
    // let reserves
    // reserves = await PAIR.getReserves()
    // console.log("Reserves: ", reserves)

    // const Router = new hre.ethers.Contract(ROUTER__ADDRESS, routerArtifact.abi, signer);

    // // decimals 구분 주의
    // const token0Amount = ethers.parseUnits("0.4", 18);
    // const token1Amount = ethers.parseUnits("2", 6);
    // const deadLine = Math.floor(Date.now() / 1000) + 60 * 10;

    // const addLiquidityTx = await Router.addLiquidity(
    //     WETH__ADDRESS,
    //     USDC__ADDRESS,
    //     token0Amount,
    //     token1Amount,
    //     0,
    //     0,
    //     signer.address,
    //     deadLine,
    //     { gasLimit: 1000000 }
    // );
    // console.log("Adding liquidity...", addLiquidityTx.hash);
    // await addLiquidityTx.wait();
    // console.log("Liquidity added");

    // reserves = await PAIR.getReserves()
    // console.log("Updated reserves: ", reserves)

    // Approve --------------------------------------------

    // const WETH = new hre.ethers.Contract(WETH__ADDRESS, WETH__ABI, signer);
    // const USDC = new hre.ethers.Contract(USDC__ADDRESS, ERC20__ABI, signer);

    // const apW = await WETH.approve(ROUTER__ADDRESS, ethers.MaxUint256);
    // await apW.wait();

    // const apU = await USDC.approve(ROUTER__ADDRESS, ethers.MaxUint256);
    // await apU.wait();
};

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
