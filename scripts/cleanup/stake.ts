import { ethers } from "ethers"
import { abi as ROUTER02__ABI } from "@uniswap/v2-periphery/build/IUniswapV2Router02.json"

const ERC20__ABI = require("../abi/ERC20.json")
const ROUTER02__ADDRESS = "0xc532a74256d3db42d0bf7a0400fefdbad7694008"

const WETH__ADDRESS = "0xfff9976782d46cc05630d1f6ebab18b2324d6b14"
const WETH__DECIMALS = 18

const UNI__ADDRESS = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
const UNI__DECIMALS = 18

const USDC__ADDRESS = "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238"
const USDC__DECIMALS = 6

const main = async () => {
  const [signer] = await hre.ethers.getSigners()

  const ROUTER02 = new ethers.Contract(ROUTER02__ADDRESS, ROUTER02__ABI, signer)

  const tokenIn = WETH__ADDRESS
  const decimalsIn = WETH__DECIMALS
  const tokenOut = UNI__ADDRESS
  const decimalsOut = UNI__DECIMALS

  const path = [tokenIn, tokenOut]
  const amountsIn = ethers.parseUnits("0.05", decimalsIn)
  const approvalAmount = ethers.parseEther("1000000")

  let amountsOut = await ROUTER02.getAmountsOut(amountsIn, path)
  amountsOut = amountsOut[1]
  console.log("Amounts out: ", ethers.formatUnits(amountsOut, decimalsOut))

  // ------------------------------------------------

  const contractIn = new ethers.Contract(tokenIn, ERC20__ABI, signer)
  const contractOut = new ethers.Contract(tokenOut, ERC20__ABI, signer)
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10

  // await Promise.all([
  //   contractIn.approve(ROUTER02__ADDRESS, approvalAmount),
  //   contractOut.approve(ROUTER02__ADDRESS, approvalAmount),
  // ])

  const tx = await ROUTER02.addLiquidity(tokenIn, tokenOut, amountsIn, amountsOut, 0, 0, signer.address, deadline, {
    gasLimit: 3000000,
  })
  console.log("Transaction hash: ", tx.hash)
  await tx.wait()
  console.log("Liquidate added!")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
