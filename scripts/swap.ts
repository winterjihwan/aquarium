import { ethers } from "ethers"
import { abi as ROUTER02__ABI } from "@uniswap/v2-periphery/build/IUniswapV2Router02.json"

const ERC20__ABI = require("../abi/ERC20.json")
const ROUTER02__ADDRESS = "0xc532a74256d3db42d0bf7a0400fefdbad7694008"

const WETH__ADDRESS = "0xfff9976782d46cc05630d1f6ebab18b2324d6b14"
const UNI__ADDRESS = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
const USDC__ADDRESS = "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238"

const main = async () => {
  const [signer] = await hre.ethers.getSigners()

  const ROUTER02 = new ethers.Contract(ROUTER02__ADDRESS, ROUTER02__ABI, signer)

  const tokenIn = WETH__ADDRESS
  const tokenOut = USDC__ADDRESS

  const amountIn = ethers.parseEther("0.01")

  const path = [tokenIn, tokenOut]
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20

  const tokenInContract = new ethers.Contract(tokenIn, ERC20__ABI, signer)
  await tokenInContract.approve(ROUTER02__ADDRESS, ethers.parseUnits("1.0", 18))

  const tx = await ROUTER02.swapExactTokensForTokens(amountIn, 0, path, signer.address, deadline)
  console.log("Transaction hash:", tx.hash)
  await tx.wait()
  console.log("Swap executed successfully!")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
