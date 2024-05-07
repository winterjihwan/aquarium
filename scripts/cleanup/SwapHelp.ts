import { ethers } from "ethers"

const ERC20_ABI = require("../abi/ERC20.json")

const main = async () => {
  //   const swapHelper = await hre.ethers.getContractFactory("SwapUniswapV3")
  //   const SwapHelper = await swapHelper.deploy("0xe592427a0aece92de3edee1f18e0157c05861564")
  //   await SwapHelper.waitForDeployment()
  //   console.log(`SwapHelper deployed to: ${SwapHelper.target}`)

  const provider = ethers.getDefaultProvider("sepolia")
  const [signer] = await hre.ethers.getSigners()

  const SwapHelperAddress = "0xef701fFFB149462c6fceFb22761a6852c83E4394"
  const SwapHelper = await hre.ethers.getContractAt("SwapUniswapV3", SwapHelperAddress)

  // ----------------------------------------------
  const nameIn = "WETH"
  const tokenIn = "0xfff9976782d46cc05630d1f6ebab18b2324d6b14"

  const nameOut = "METH"
  const tokenOut = "0x4f7a67464b5976d7547c860109e4432d50afb38e"

  const poolAddress = "0x84f491dd1e1bb2b251bea2cab9ac6849e94bfbc5"
  // ----------------------------------------------

  const Weth = new ethers.Contract(tokenIn, ERC20_ABI, signer)
  const approveTx = await Weth.approve(SwapHelperAddress, ethers.MaxUint256)
  await approveTx.wait()

  const tx = await SwapHelper.swapExactInputSingle(ethers.parseEther("0.3"), 0, tokenIn, tokenOut, 3000, {
    gasLimit: 8000000,
  })
  console.log("Transaction submitted, hash:", tx.hash)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
