import {ethers} from "ethers"
import hre from "hardhat"

// [ ERC20 ]
const WETH__ADDRESS = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"
const WETH__ABI = require("../abi/WETH.json")
const USDC__ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"
const ERC20__ABI = require("../abi/ERC20.json")

// [ Incubator ]
const INCUBATOR__ADDRESS = "0x1f07a74241646e0d1001206EDA00b88c122DE94D"

// [ Uniswap ]
const factoryArtifact = require('@uniswap/v2-core/build/UniswapV2Factory.json')
const routerArtifact = require('@uniswap/v2-periphery/build/UniswapV2Router02.json')
const pairArtifact = require('@uniswap/v2-periphery/build/IUniswapV2Pair.json')

const FACTORY__ADDRESS = "0x7AA1CB24f20166D118087AA3b9d67943D4B903E9";
const ROUTER__ADDRESS = "0x139D70E24b8C82539800EEB99510BfB8B09eaF68"

const WETH_USDC_PAIR_ADDRESS = "0xf605cdA0Bf33e42ccac267Db4B8c06496E77937f"

// [ Multicall ]
const MULTICALL__ADDRESS = "0x05b72D2354162108F1b726F5e135e357A86f60bD"


const main = async() => {
    const [signer] = await hre.ethers.getSigners()

    // 1. ETH -> WETH (deposit)
    const Weth = new ethers.Contract(WETH__ADDRESS, WETH__ABI, signer)
    const toWethTx = await Weth.deposit({value: ethers.parseEther("0.05")})
    console.log("Depositing Weth...", toWethTx.hash)
    await toWethTx.wait()
    console.log("Deposited Weth")

    // 2. Incubate (approve + incubate)
    const amountInWeth = ethers.parseUnits("0.025", 18)
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10

    const WETH = new hre.ethers.Contract(WETH__ADDRESS, WETH__ABI, signer)
    const approveTx = await WETH.approve(INCUBATOR__ADDRESS, ethers.MaxUint256)
    console.log("Approving Weth...", approveTx.hash)
    await approveTx.wait()

    const Incubator = await hre.ethers.getContractAt("Incubator", INCUBATOR__ADDRESS)
    const incubateTx = await Incubator.Incubate(
        WETH__ADDRESS,
        USDC__ADDRESS,
        amountInWeth,
        0,
        0,
        signer.address,
        deadline,
        { gasLimit: 3000000 }
    )
    console.log("Incubating Weth to USDC...", incubateTx.hash)
    await incubateTx.wait()
    console.log("Incubated!")
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})