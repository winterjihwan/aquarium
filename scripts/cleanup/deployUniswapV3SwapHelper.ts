import { ethers } from "hardhat"

const SWAPROUTER02_ADDRESS = "0xE592427A0AEce92De3Edee1F18E0157C05861564"

const main = async () => {
  const uniswapV3SwapHelper = await hre.ethers.getContractFactory("UniswapV3SwapHelper")
  const UniswapV3SwapHelper = await uniswapV3SwapHelper.deploy(SWAPROUTER02_ADDRESS)
  await UniswapV3SwapHelper.waitForDeployment()
  console.log({ UniswapV3SwapHelper: UniswapV3SwapHelper.target })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
