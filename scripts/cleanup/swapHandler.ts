import { ethers } from "ethers"

const ERC20_ABI = require("../abi/ERC20.json")
const UniswapV3SwapHelper_ABI = require("../abi/UniswapV3SwapHelper.json")

const USDT_WETH_POOL = "0x931c6b0da4d050a8047e1ac8c6836b8526c0cc74"
const SWAPROUTER02_ADDRESS = "0xE592427A0AEce92De3Edee1F18E0157C05861564"
const SWAPHELPER_ADDRESS = "0xFD1855F2C78725BA884d55A0fE802F7adf218D32"

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
  const [signer] = await hre.ethers.getSigners()

  // const UniswapV3SwapHelper = await hre.ethers.getContractAt("UniswapV3SwapHelper", SWAPHELPER_ADDRESS)
  const UniswapV3SwapHelper = new ethers.Contract(SWAPHELPER_ADDRESS, UniswapV3SwapHelper_ABI, signer)

  // const testNo = await UniswapV3SwapHelper.testNo()
  // console.log({ testNo })

  // const testNoTx = await UniswapV3SwapHelper.incrementTestNo()
  // await testNoTx.wait()
  // const testNoNew = await UniswapV3SwapHelper.testNo()
  // console.log({ testNoNew })

  const USDT = new ethers.Contract(address0, ERC20_ABI, signer)
  const WETH = new ethers.Contract(address1, ERC20_ABI, signer)

  const weth_balance = await WETH.balanceOf(signer.address)
  console.log({ weth_balance })

  // const weth_approve = await WETH.approve(UniswapV3SwapHelper.target, ethers.parseUnits("0.5", decimals1))
  // const weth_approve_receipt = await weth_approve.wait()

  const swapTx = await UniswapV3SwapHelper.swapExactInputSingle(
    address1,
    address0,
    500,
    ethers.parseUnits("0.5", decimals1),
    signer.address,
    { gasLimit: 1000000 }
  )
  const swapTxReceipt = await swapTx.wait()
  console.log({ swapTxReceipt })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
