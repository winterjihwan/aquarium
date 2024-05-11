import { ethers } from "ethers"
import hre from "hardhat"

// [ ERC20 ]
const WETH__ADDRESS = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"
const WETH__ABI = require("../abi/WETH.json")
const USDC__ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"
const ERC20__ABI = require("../abi/ERC20.json")

// [ Account Native ]
const ACCOUNT_NATIVE__ADDRESS = "0x5e7D78B3dEdA29Ab2B1FCE1883Fac31a5BE9A4C8"

// [ Uniswap ]
const factoryArtifact = require("@uniswap/v2-core/build/UniswapV2Factory.json")
const routerArtifact = require("@uniswap/v2-periphery/build/UniswapV2Router02.json")
const pairArtifact = require("@uniswap/v2-periphery/build/IUniswapV2Pair.json")

const FACTORY__ADDRESS = "0x7AA1CB24f20166D118087AA3b9d67943D4B903E9"
const ROUTER__ADDRESS = "0x139D70E24b8C82539800EEB99510BfB8B09eaF68"

const WETH_USDC_PAIR_ADDRESS = "0xf605cdA0Bf33e42ccac267Db4B8c06496E77937f"

// [ Multicall ]
const MULTICALL__ADDRESS = "0x05b72D2354162108F1b726F5e135e357A86f60bD"

const main = async () => {
  const [signer] = await hre.ethers.getSigners()

  const AccountNative = await hre.ethers.getContractAt("AccountNative", ACCOUNT_NATIVE__ADDRESS)
  const initialValue = ethers.parseEther("0.01")
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10
  const incubateTx = await AccountNative.incubate(WETH__ADDRESS, USDC__ADDRESS, initialValue, deadline, {
    gasLimit: 3000000,
  })
  console.log("Incubating Weth / USDC...", incubateTx.hash)
  await incubateTx.wait()
  console.log("Incubated!")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
