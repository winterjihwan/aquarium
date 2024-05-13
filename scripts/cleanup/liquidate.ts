import { ethers } from "ethers"
import { abi as ROUTER02__ABI } from "@uniswap/v2-periphery/build/IUniswapV2Router02.json"
import { abi as FACTORY__ABI } from "@uniswap/v2-core/build/IUniswapV2Factory.json"

const ERC20__ABI = require("../../abi/ERC20.json")
const ROUTER02__ADDRESS = "0xc532a74256d3db42d0bf7a0400fefdbad7694008"
const FACTORY__ADDRESS = "0xc9f18c25Cfca2975d6eD18Fc63962EBd1083e978"

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
  const tokenOut = UNI__ADDRESS
  // ------------------------------------------------
  //   const Factory = new ethers.Contract(FACTORY__ADDRESS, FACTORY__ABI, signer)
  //   const lpToken = await Factory.getPair(tokenIn, tokenOut)
  //   console.log(lpToken.slice(0, 42))

  const lpToken = "0xf4939FA2cB43Ded5BA0fA37D7A37f804b06642D3"
  const LP = new ethers.Contract(lpToken, ERC20__ABI, signer)

  const liquidateAmount = await LP.balanceOf(signer.address)
  await LP.approve(ROUTER02__ADDRESS, ethers.parseEther("1000000"))
  console.log({ liquidateAmount })

  const deadline = Math.floor(Date.now() / 1000) + 60 * 10

  const tx = await ROUTER02.removeLiquidity(tokenIn, tokenOut, liquidateAmount, 0, 0, signer.address, deadline, {
    gasLimit: 3000000,
  })
  console.log("Transaction hash: ", tx.hash)
  await tx.wait()
  console.log("Liquidated!")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
