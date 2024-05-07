import { ethers } from "ethers"
const ERC20_ABI = require("../abi/ERC20.json")

const main = async () => {
  const provider = ethers.getDefaultProvider("sepolia")
  const [signer] = await hre.ethers.getSigners()

  const SINGLESWAP__ADDRESS = "0x3AA948aDA34C1A849a70c6C46ef59881D06c1d70"
  const WETH__ADDRESS = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"

  //   const singleSwap = await hre.ethers.getContractFactory("SingleSwap")
  //   const SingleSwap = await singleSwap.deploy()
  //   await SingleSwap.waitForDeployment()
  //   console.log(`SingleSwap deployed to: ${SingleSwap.target}`)

  const Weth = new ethers.Contract(WETH__ADDRESS, ERC20_ABI, signer)
  const approveTx = await Weth.approve(SINGLESWAP__ADDRESS, ethers.parseEther("1"))
  await approveTx.wait()

  const SingleSwap = await hre.ethers.getContractAt("SingleSwap", SINGLESWAP__ADDRESS)
  const swapTx = await SingleSwap.swapExactInputSingle(ethers.parseEther("0.3"), { gasLimit: 3000000 })
  const swapTxr = await swapTx.wait()

  console.log("Transaction submitted, hash:", swapTxr.transactionHash)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
