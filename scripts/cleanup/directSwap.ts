import { ethers } from "ethers"
import { abi as SWAPROUTER_ABI } from "@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json"

const ERC20_ABI = require("../abi/ERC20.json")

const USDT_WETH_POOL = "0x931c6b0da4d050a8047e1ac8c6836b8526c0cc74"
const SWAPROUTER_ADDRESS = "0xE592427A0AEce92De3Edee1F18E0157C05861564"

const main = async () => {
  const name0 = "USDT"
  const symbol0 = "USDT"
  const decimals0 = 6
  const address0 = "0x3637925ee8b837f85c7309e4b291ca56a40457a4"

  const name1 = "WETH"
  const symbol1 = "WETH"
  const decimals1 = 18
  const address1 = "0xfff9976782d46cc05630d1f6ebab18b2324d6b14"

  const provider = hre.ethers.getDefaultProvider("sepolia")
  const [signer] = await hre.ethers.getSigners()

  const SwapRouter = new ethers.Contract(SWAPROUTER_ADDRESS, SWAPROUTER_ABI, signer)

  const WETH = new ethers.Contract(address1, ERC20_ABI, signer)
  const weth_approve = await WETH.approve(SwapRouter.target, ethers.parseEther("1"))
  await weth_approve.wait()

  const allowance = await WETH.allowance(signer.address, SwapRouter.target)
  console.log("Allowance: ", allowance.toString())

  //   const exactInputSingleParams = {
  //     tokenIn: address1,
  //     tokenOut: address0,
  //     fee: 500,
  //     recipient: signer.address,
  //     deadline: Math.floor(Date.now() / 1000) + 60 * 20,
  //     amountIn: ethers.parseUnits("0.5", decimals1),
  //     amountOutMinimum: 1,
  //     sqrtPriceLimitX96: 0,
  //   }

  //   const swapTx = await SwapRouter.exactInputSingle(exactInputSingleParams, { gasLimit: 3000000 })
  //   const swapTxReceipt = await swapTx.wait()
  //   console.log({ swapTxReceipt })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
