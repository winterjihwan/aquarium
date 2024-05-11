import { ethers } from "ethers"
import hre from "hardhat"

const WETH__ABI = require("../abi/WETH.json")
const ERC20_ABI = require("../abi/ERC20.json")
const WETH__ADDRESS = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"
const USDC__ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"
const WETH_USDC_PAIR_ADDRESS = "0xf605cdA0Bf33e42ccac267Db4B8c06496E77937f"

const main = async () => {
  const provider = ethers.getDefaultProvider("sepolia")
  const [signer] = await hre.ethers.getSigners()

  //   USDC balance of signer
  const USDC = new hre.ethers.Contract(USDC__ADDRESS, ERC20_ABI, provider)
  const usdcBalance = await USDC.balanceOf(signer.address)
  console.log(`USDC balance: ${ethers.formatUnits(usdcBalance, 6)}`)

  //   Weth balance of signer 
  const Weth = new hre.ethers.Contract(WETH__ADDRESS, WETH__ABI, provider)
  const wethBalance = await Weth.balanceOf(signer.address)
  console.log(`Weth balance: ${ethers.formatUnits(wethBalance, 18)}`)

  // //  Weth - USDC pair balance
  // const WU_PAIR = new hre.ethers.Contract(WETH_USDC_PAIR_ADDRESS, ERC20_ABI, provider)
  // const pairBalance = await WU_PAIR.balanceOf(signer.address)
  // console.log(`Weth - USDC pair balance: ${ethers.formatUnits(pairBalance, 18)}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
