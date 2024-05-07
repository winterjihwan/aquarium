import { ethers } from "ethers"
import { abi as INonfungiblePositionManagerABI } from "@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json"
import { abi as ISwapRouterABI } from "@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json"

const ERC20_ABI = require("../abi/ERC20.json")

const SwapRouter_ADDRESS = "0x3B5E3c5E595D85fbFBC2a42ECC091e183E76697C"
const NFPManager_ADDRESS = "0x5bE4DAa6982C69aD20A57F1e68cBcA3D37de6207"
const SwapHelper_ADDRESS = "0xdCFc65b5A6E5ab8BDd844E85e78B9C6eeb828677"
const WETH_ADDRESS = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"

const main = async () => {
  const name0 = "USDT"
  const symbol0 = "USDT"
  const decimals0 = 6
  const address0 = "0x3637925ee8b837f85c7309e4b291ca56a40457a4"

  const name1 = "WETH"
  const symbol1 = "WETH"
  const decimals1 = 18
  const address1 = "0xfff9976782d46cc05630d1f6ebab18b2324d6b14"

  const provider = ethers.getDefaultProvider("sepolia")

  const nonfungiblePositionManagerContract = new ethers.Contract(
    NFPManager_ADDRESS,
    INonfungiblePositionManagerABI,
    provider
  )

  // const uniswapV3SwapHelper = await hre.ethers.getContractFactory("UniswapV3SwapHelper")
  // const UniswapV3SwapHelper = await uniswapV3SwapHelper.deploy(SwapRouter_ADDRESS)
  // await UniswapV3SwapHelper.waitForDeployment()
  // console.log({ UniswapV3SwapHelper: UniswapV3SwapHelper.target })
  const UniswapV3SwapHelper = await hre.ethers.getContractAt("UniswapV3LiquidateHelper", SwapHelper_ADDRESS)

  const swapTx = await UniswapV3SwapHelper.swapExactInputSingle(address1, address0, ethers.parseUnits("0.5", decimals1))
  //   WETH -> USDT
  console.log("swapExactInputSingle tx:", swapTx)

  //   ETH gas balance of signer
  const [signer] = await hre.ethers.getSigners()
  const signerAddress = signer.address
  const balance = await provider.getBalance(signerAddress)
  console.log({ signerAddress })

  //  USDT balance of signer
  const usdtContract = new ethers.Contract(address0, ERC20_ABI, provider)
  const usdtBalance = await usdtContract.balanceOf(signerAddress)
  console.log({ usdtBalance })

  //  WETH balance of signer
  const wethContract = new ethers.Contract(address1, ERC20_ABI, provider)
  const wethBalance = await wethContract.balanceOf(signerAddress)
  console.log({ wethBalance })

  //   ------------------------------

  //   const UniswapV3LiquidateHelper = await hre.ethers.getContractFactory("UniswapV3LiquidateHelper")
  //   const uniswapV3LiquidateHelper = await UniswapV3LiquidateHelper.deploy(nonfungiblePositionManagerContract.target)
  //   await uniswapV3LiquidateHelper.waitForDeployment()
  //   console.log(`UniswapV3LiquidateHelper deployed to: ${uniswapV3LiquidateHelper.target}`)
  const UniswapV3LiquidateHelperAddress = "0x54DaE5b96E82af6A95c375d0ab2262D2A0BCB530"
  const UniswapV3LiquidateHelper = await hre.ethers.getContractAt(
    "UniswapV3LiquidateHelper",
    UniswapV3LiquidateHelperAddress
  )

  const liquidateTx = await UniswapV3LiquidateHelper.mintNewPosition(
    address0,
    address1,
    ethers.parseUnits("5", decimals0),
    ethers.parseUnits("0.05", decimals1)
  )

  console.log("mintNewPosition tx:", liquidateTx)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
